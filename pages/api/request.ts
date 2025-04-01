import type { NextApiRequest, NextApiResponse } from "next";
import Mailgun from "mailgun.js";
import FormData from "form-data";

import crypto from "crypto";
import get_env_vars, { ENV_VARS } from "../../utils/get_env_vars";
import { getRecord } from "../../utils/get_record";

export function generateSignedToken(timesheetUrl: string): string {
  const env_vars = get_env_vars(ENV_VARS);

  return crypto
    .createHmac("sha256", env_vars.SIGNED_TOKEN_SECRET)
    .update(timesheetUrl)
    .digest("hex");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const env_vars = get_env_vars(ENV_VARS);

  const { timesheet_id } = req.query;

  if (!timesheet_id) {
    return res.status(400).json({ error: "Missing timesheet ID" });
  }

  try {
    // Get the timesheet record using the ID
    const record = await getRecord(timesheet_id as string, env_vars);

    // Extract necessary fields from the record
    const { user, approver, month_year: period } = record ?? {};
    const { approvers_name, approvers_email } = approver ?? {};

    // Validate record has all required fields
    if (!user?.name || !approvers_name || !approvers_email || !period) {
      return res.status(400).json({
        error: "Timesheet record is missing required fields",
      });
    }

    // Get mailgun configuration
    const mailgunDomain = env_vars.MAILGUN_DOMAIN;
    const mailgunApiKey = env_vars.MAILGUN_API_KEY;

    if (!mailgunDomain || !mailgunApiKey) {
      throw new Error("Missing Mailgun credentials");
    }

    // Generate signed token for approval link
    const signedToken = generateSignedToken(timesheet_id as string);
    const signedUrl = `${env_vars.SITE_URL}/${timesheet_id}?signed_token=${signedToken}`;

    // Initialize Mailgun client
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: mailgunApiKey,
      url: "https://api.eu.mailgun.net",
    });

    // Send the approval request email
    try {
      const emailResponse = await mg.messages.create(mailgunDomain, {
        from: `Autolog <no-reply@${mailgunDomain}>`,
        to: [approvers_email],
        subject: `${user.name} Has Requested You Approve Their Timesheet for ${period}`,
        template: "request template",
        "h:X-Mailgun-Variables": JSON.stringify({
          approvers_name: approvers_name,
          autolog_user_name: user.name,
          period: period,
          signed_url: signedUrl,
        }),
      });

      console.info("Email sent successfully:", emailResponse);

      return res.status(200).json({
        message: "Email sent successfully",
        signedUrl,
        record: {
          user: user.name,
          approvers_name,
          period: period,
        },
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);

      return res.status(500).json({
        error: `Failed to send email: ${(emailError as Error).message}`,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);

    return res.status(500).json({
      error: `Error processing request: ${(error as Error).message}`,
    });
  }
}
