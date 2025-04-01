import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import get_env_vars, { ENV_VARS } from "../../utils/get_env_vars";
import connect_to_db from "../../utils/connect_to_db";
import { getRecord } from "../../utils/get_record";

export async function sendApprovalEmail(
  timesheet_id: string,
  user_name: string,
  user_email: string,
  approvers_name: string,
  period: string
): Promise<void> {
  const env_vars = get_env_vars(ENV_VARS);
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: env_vars.MAILGUN_API_KEY,
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net/v3"
  });

  const timesheet_url = `${env_vars.SITE_URL}/${timesheet_id}`;

  try {
    const data = await mg.messages.create(env_vars.MAILGUN_DOMAIN, {
      from: `Autolog <no-reply@${env_vars.MAILGUN_DOMAIN}>`,
      to: [`${user_name} <${user_email}>`],
      subject: `Timesheet for ${period} Has Been Approved`,
      template: "Approval Template",
      "h:X-Mailgun-Variables": JSON.stringify({
        approvers_name: approvers_name,
        autolog_user_name: user_name,
        period: period,
        timesheet_url: timesheet_url,
      }),
    });

    console.info("Approval email sent successfully:", data);
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to send approval email: ${error}`);
  }
}

function verifyToken(
  timesheetId: string,
  token: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(timesheetId);
  const expectedToken = hmac.digest("hex");

  return token === expectedToken;
}

export async function updateTimesheetApprovalStatus(
  timesheetId: string
): Promise<void> {
  const env_vars = get_env_vars(ENV_VARS);

  try {
    const { mongoCollection } = await connect_to_db(env_vars);

    await mongoCollection.updateOne(
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
  const env_vars = get_env_vars(ENV_VARS);
  const { timesheet_id, signed_token } = req.query;

  if (typeof timesheet_id !== "string" || typeof signed_token !== "string") {
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  if (!verifyToken(timesheet_id, signed_token, env_vars.SIGNED_TOKEN_SECRET)) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  try {
    // Get the timesheet record
    const record = await getRecord(timesheet_id, env_vars);

    // Extract necessary fields from the record
    const { user, approver, month_year: period } = record ?? {};
    const { approvers_name } = approver ?? {};

    // Validate record has all required fields
    if (!user?.name || !user?.email || !approvers_name || !period) {
      return res.status(400).json({
        message: "Timesheet record is missing required fields",
      });
    }

    // Update timesheet approval status in mongodb
    await updateTimesheetApprovalStatus(timesheet_id);

    // Send approval notification email
    await sendApprovalEmail(
      timesheet_id,
      user.name,
      user.email,
      approvers_name,
      period
    );

    return res.status(200).json({ message: "Timesheet approved successfully" });
  } catch (error) {
    console.error("Error approving timesheet:", error);

    return res.status(500).json({
      message: `Failed to approve timesheet: ${(error as Error).message}`,
    });
  }
}
