import { createMocks } from "node-mocks-http";
import handler from "../approve";
import { getRecord } from "../../../utils/get_record";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

jest.mock("../../../utils/get_record");
jest.mock("../../../utils/get_env_vars", () => ({
  __esModule: true,
  default: jest.fn(),
  ENV_VARS: {
    MAILGUN_API_KEY: "MAILGUN_API_KEY",
    MAILGUN_DOMAIN: "MAILGUN_DOMAIN",
    SITE_URL: "SITE_URL",
    SIGNED_TOKEN_SECRET: "SIGNED_TOKEN_SECRET",
    MONGODB_URI: "MONGODB_URI",
  },
}));
jest.mock("../../../utils/connect_to_db");
jest.mock("mailgun.js");

const mockGetEnvVars = require("../../../utils/get_env_vars").default;
const mockConnectToDb = require("../../../utils/connect_to_db").default;

describe("/api/approve API Endpoint", () => {
  beforeAll(() => {
    // Mock environment variables
    mockGetEnvVars.mockReturnValue({
      MAILGUN_API_KEY: "test-mailgun-api-key",
      MAILGUN_DOMAIN: "test.mailgun.org",
      SITE_URL: "http://localhost:3000",
      SIGNED_TOKEN_SECRET: "test-secret",
      MONGODB_URI: "mongodb://localhost:27017/test",
    });

    mockConnectToDb.mockResolvedValue({
      mongoCollection: {
        updateOne: jest.fn().mockResolvedValue({}),
      },
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should return 400 if request parameters are invalid", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Invalid request parameters",
    });
  });

  it("should return 403 if token is invalid", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        timesheet_id: "test-id",
        signed_token: "invalid-token",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData()).toEqual({ message: "Invalid or expired token" });
  });

  it("should return 400 if timesheet record is missing required fields", async () => {
    const timesheet_id = "test-id";
    const signed_token = crypto
      .createHmac("sha256", "test-secret")
      .update(timesheet_id)
      .digest("hex");

    (getRecord as jest.Mock).mockResolvedValueOnce({});

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        timesheet_id,
        signed_token,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Timesheet record is missing required fields",
    });
  });

  it("should approve timesheet and send approval email", async () => {
    const timesheet_id = "test-id";
    const signed_token = crypto
      .createHmac("sha256", "test-secret")
      .update(timesheet_id)
      .digest("hex");

    const record = {
      user: { name: "Test User", email: "testuser@example.com" },
      approver: { approvers_name: "Approver Name" },
      month_year: "October 2023",
    };

    (getRecord as jest.Mock).mockResolvedValueOnce(record);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        timesheet_id,
        signed_token,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Timesheet approved successfully",
    });
  });

  it("should return 500 if there is an error approving timesheet", async () => {
    const timesheet_id = "test-id";
    const signed_token = crypto
      .createHmac("sha256", "test-secret")
      .update(timesheet_id)
      .digest("hex");

    (getRecord as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        timesheet_id,
        signed_token,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Failed to approve timesheet: Database error",
    });
  });
});
