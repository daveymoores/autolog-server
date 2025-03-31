import { createMocks } from "node-mocks-http";
import handler from "../request";
import { getRecord } from "../../../utils/get_record";
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
  },
}));
jest.mock("mailgun.js");

const mockGetEnvVars = require("../../../utils/get_env_vars").default;

describe("/api/request API Endpoint", () => {
  beforeAll(() => {
    // Mock environment variables
    mockGetEnvVars.mockReturnValue({
      MAILGUN_API_KEY: "test-mailgun-api-key",
      MAILGUN_DOMAIN: "test.mailgun.org",
      SITE_URL: "http://localhost:3000",
      SIGNED_TOKEN_SECRET: "test-secret",
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should return 400 if timesheet_id is missing", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Missing timesheet ID",
    });
  });

  it("should return 400 if timesheet record is missing required fields", async () => {
    const timesheet_id = "test-id";

    (getRecord as jest.Mock).mockResolvedValueOnce({});

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        timesheet_id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Timesheet record is missing required fields",
    });
  });

  it("should send approval request email and return 200", async () => {
    const timesheet_id = "test-id";

    const record = {
      user: { name: "Test User" },
      approver: {
        approvers_name: "Approver Name",
        approvers_email: "approver@example.com",
      },
      month_year: "October 2023",
    };

    (getRecord as jest.Mock).mockResolvedValueOnce(record);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        timesheet_id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Email sent successfully",
      signedUrl: expect.any(String),
      record: {
        user: record.user.name,
        approvers_name: record.approver.approvers_name,
        period: record.month_year,
      },
    });
  });

  it("should return 500 if there is an error sending the email", async () => {
    const timesheet_id = "test-id";

    const record = {
      user: { name: "Test User" },
      approver: {
        approvers_name: "Approver Name",
        approvers_email: "approver@example.com",
      },
      month_year: "October 2023",
    };

    (getRecord as jest.Mock).mockResolvedValueOnce(record);

    const mockMailgun = require("mailgun.js").default;
    mockMailgun.mockImplementation(() => {
      return {
        client: jest.fn().mockReturnValue({
          messages: {
            create: jest.fn().mockRejectedValue(new Error("Email error")),
          },
        }),
      };
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        timesheet_id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: "Failed to send email: Email error",
    });
  });

  it("should return 500 if there is an error processing the request", async () => {
    const timesheet_id = "test-id";

    (getRecord as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        timesheet_id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: "Error processing request: Database error",
    });
  });
});
