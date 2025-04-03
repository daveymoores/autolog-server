export const ENV_VARS = {
  MONGODB_URI: "MONGODB_URI",
  MONGODB_DB: "MONGODB_DB",
  MONGODB_COLLECTION: "MONGODB_COLLECTION",
  MONGODB_DEMO_COLLECTION: "MONGODB_DEMO_COLLECTION",
  SITE_URL: "SITE_URL",
  MAILGUN_API_KEY: "MAILGUN_API_KEY",
  MAILGUN_DOMAIN: "MAILGUN_DOMAIN",
  SIGNED_TOKEN_SECRET: "SIGNED_TOKEN_SECRET",
  EXPIRE_TIME_SECONDS: "EXPIRE_TIME_SECONDS",
  API_ROUTE_BEARER_KEY: "API_ROUTE_BEARER_KEY",
};

const get_env_vars = (connection_vars: typeof ENV_VARS) => {
  Object.entries(connection_vars).forEach(([key]) => {
    if (!process.env[key]) {
      throw new Error(`${key} is not set`);
    }

    connection_vars[key as keyof typeof ENV_VARS] = process.env[key];
  });

  return connection_vars;
};

export default get_env_vars;
