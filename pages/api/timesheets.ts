import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import get_env_vars, { ENV_VARS } from "../../utils/get_env_vars";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const env_vars = get_env_vars(ENV_VARS);
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ") ||
    authHeader.substring(7) !== process.env.API_ROUTE_BEARER_KEY
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const client = new MongoClient(env_vars.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(env_vars.MONGODB_DB);
    const collection = db.collection(env_vars.MONGODB_COLLECTION);

    // Get document from request body - path is already included from client
    const document = req.body;

    // Check if the path already exists
    const existingDoc = await collection.findOne({
      random_path: document.random_path,
    });

    if (existingDoc) {
      return res.status(409).json({ error: "Path already exists" });
    }

    // Ensure creation_date is a Date object
    if (typeof document.creation_date === "string") {
      document.creation_date = new Date(document.creation_date);
    }

    // Insert the document
    await collection.insertOne(document);

    // Check and create TTL index if needed
    const indexes = await collection.listIndexes().toArray();
    const ttlIndexExists = indexes.some(
      (index) => index.name === "expiration_date"
    );

    if (!ttlIndexExists) {
      await collection.createIndex(
        { creation_date: 1 },
        {
          name: "expiration_date",
          expireAfterSeconds: parseInt(env_vars.EXPIRE_TIME_SECONDS, 10),
        }
      );
    }

    // Return success
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("API error:", error);

    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
}
