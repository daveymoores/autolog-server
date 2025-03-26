import crypto from "crypto";
import get_env_vars, { ENV_VARS } from "./get_env_vars";

const env_vars = get_env_vars(ENV_VARS);

export function generateSignedToken(timesheet_id: string): string {
  return crypto
    .createHmac("sha256", env_vars.HMAC_SECRET_KEY)
    .update(timesheet_id)
    .digest("hex");
}
