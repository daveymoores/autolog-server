import { Collection, Db, MongoClient } from "mongodb";

import { TimesheetResponseProps } from "../types/Timesheet.types";
import { ENV_VARS } from "./get_env_vars";

const connect_to_db = async (
  connection_vars: typeof ENV_VARS,
  useDemo: boolean = false
): Promise<{
  client: MongoClient;
  database: Db;
  mongoCollection: Collection<TimesheetResponseProps>;
}> => {
  const client = new MongoClient(connection_vars.MONGODB_URI);
  await client.connect();
  const database = client.db(connection_vars.MONGODB_DB);

  const collection = useDemo
    ? database.collection<TimesheetResponseProps>(
        connection_vars.MONGODB_DEMO_COLLECTION
      )
    : database.collection<TimesheetResponseProps>(
        connection_vars.MONGODB_COLLECTION
      );

  return {
    client,
    database,
    mongoCollection: collection,
  };
};

export default connect_to_db;
