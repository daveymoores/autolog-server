import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import get_env_vars, { ENV_VARS } from "../../utils/get_env_vars";
import connect_to_db from "../../utils/connect_to_db";

const env_vars = get_env_vars(ENV_VARS);

async function sendApprovalEmail(timesheet_id: string): Promise<void> {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: env_vars.MAILGUN_API_KEY,
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net/v3"
  });

  try {
    const data = await mg.messages.create(env_vars.MAILGUN_DOMAIN, {
      from: `Mailgun Sandbox <postmaster@>${env_vars.MAILGUN_DOMAIN}`,
      to: ["David Moores <daveymoores@gmail.com>"],
      subject: "Your Timesheet has been Approved",
      text: "Congratulations David Moores, your timesheet has been approved!",
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}

function verifyToken(timesheetId: string, token: string): boolean {
  const hmac = crypto.createHmac("sha256", env_vars.SIGNED_TOKEN_SECRET);
  hmac.update(timesheetId);
  const expectedToken = hmac.digest("hex");

  return token === expectedToken;
}

async function updateTimesheetApprovalStatus(
  timesheetId: string
): Promise<void> {
  try {
    const { mongoCollection } = await connect_to_db(env_vars);

    mongoCollection.updateOne(
      { random_path: timesheetId },
      { $set: { approved: true } }
    );
  } catch (error) {
    throw new Error(`Unable to connect to db: ${error}`);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { timesheet_id, signed_token } = req.query;

  if (typeof timesheet_id !== "string" || typeof signed_token !== "string") {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (!verifyToken(timesheet_id, signed_token)) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  try {
    // Update timesheet approval status in mongodb
    await updateTimesheetApprovalStatus(timesheet_id);
    await sendApprovalEmail(timesheet_id);

    return res.status(200);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Failed to approve timesheet" });
  }
}
