import get_env_vars, { ENV_VARS } from "../get_env_vars";

describe("get_connection_vars", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("gets env vars without error", () => {
    process.env.MONGODB_URI = "these";
    process.env.MONGODB_DB = "are";
    process.env.MONGODB_COLLECTION = "env";
    process.env.MONGODB_DEMO_COLLECTION = "demo";
    process.env.SITE_URL = "vars";
    process.env.MAILGUN_API_KEY = "test";
    process.env.MAILGUN_DOMAIN = "test";
    process.env.SIGNED_TOKEN_SECRET = "test";

    expect(get_env_vars(ENV_VARS)).toEqual({
      MONGODB_URI: "these",
      MONGODB_DB: "are",
      MONGODB_COLLECTION: "env",
      MONGODB_DEMO_COLLECTION: "demo",
      SITE_URL: "vars",
      MAILGUN_API_KEY: "test",
      MAILGUN_DOMAIN: "test",
      SIGNED_TOKEN_SECRET: "test",
    });
  });

  it("throws an error if an env var isn't set", () => {
    expect(() => get_env_vars(ENV_VARS)).toThrow();
  });
});
