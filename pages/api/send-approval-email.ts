import type { NextApiRequest, NextApiResponse } from "next";

import crypto from "crypto";
import get_env_vars, { ENV_VARS } from "../../utils/get_env_vars";

const env_vars = get_env_vars(ENV_VARS);

export function generateSignedToken(timesheetUrl: string): string {
  return crypto
    .createHmac("sha256", env_vars.SIGNED_TOKEN_SECRET)
    .update(timesheetUrl)
    .digest("hex");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { approverEmail, timesheetId, senderName } = req.body;

  if (!approverEmail || !timesheetId || !senderName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const mailgunDomain = env_vars.MAILGUN_DOMAIN;
    const mailgunApiKey = env_vars.MAILGUN_API_KEY;

    if (!mailgunDomain || !mailgunApiKey) {
      throw new Error("Missing Mailgun credentials");
    }

    // Generate signed token
    const signedToken = generateSignedToken(timesheetId);
    const signedUrl = `${env_vars.SITE_URL}/${timesheetId}?signed_token=${signedToken}`;

    const mailgunUrl = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;

    const formData = new URLSearchParams();
    formData.append("from", `Autolog <no-reply@${mailgunDomain}>`);
    formData.append("to", approverEmail);
    formData.append("subject", "Timesheet Approval Request");
    formData.append(
      "text",
      `${senderName} has submitted a timesheet for approval.\n\nReview it here: ${signedUrl}`
    );

    const response = await fetch(mailgunUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString(
          "base64"
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Mailgun error: ${response.statusText}`);
    }

    return res
      .status(200)
      .json({ message: "Email sent successfully", signedUrl });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
