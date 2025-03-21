export const ENV_VARS: { [key: string]: string } = {
  MONGODB_URI: "MONGODB_URI",
  MONGODB_DB: "MONGODB_DB",
  MONGODB_COLLECTION: "MONGODB_COLLECTION",
  MONGODB_DEMO_COLLECTION: "MONGODB_DEMO_COLLECTION",
  SITE_URL: "SITE_URL",
} as const;

const get_env_vars = (connection_vars: { [key: string]: string }) => {
  Object.entries(connection_vars).forEach(([key]) => {
    if (!process.env[key]) {
      throw new Error(`${key} is not set`);
    }

    connection_vars[key as keyof typeof ENV_VARS] = process.env[key];
  });

  return connection_vars;
};

export default get_env_vars;
