import { createMocks } from "node-mocks-http";
import handler from "../timesheets";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

// Mock dependencies
jest.mock("mongodb");
jest.mock("../../../utils/get_env_vars", () => ({
  __esModule: true,
  default: jest.fn(),
  ENV_VARS: {
    MONGODB_URI: "MONGODB_URI",
    MONGODB_DB: "MONGODB_DB",
    MONGODB_COLLECTION: "MONGODB_COLLECTION",
    EXPIRE_TIME_SECONDS: "EXPIRE_TIME_SECONDS",
  },
}));

const mockGetEnvVars = require("../../../utils/get_env_vars").default;

describe("/api/timesheets API Endpoint", () => {
  // Mock MongoDB client and its methods
  const mockInsertOne = jest.fn();
  const mockFindOne = jest.fn();
  const mockListIndexes = jest.fn();
  const mockCreateIndex = jest.fn();
  const mockClose = jest.fn().mockResolvedValue(undefined);
  const mockConnect = jest.fn().mockResolvedValue(undefined);

  // Setup MongoDB mocks
  beforeAll(() => {
    // Mock environment variables
    mockGetEnvVars.mockReturnValue({
      MONGODB_URI: "mongodb://localhost:27017/test",
      MONGODB_DB: "testdb",
      MONGODB_COLLECTION: "timesheets",
      EXPIRE_TIME_SECONDS: "2592000", // 30 days
    });

    // Mock process.env
    process.env.API_ROUTE_BEARER_KEY = "test-api-key";

    // Setup MongoDB client mock
    (MongoClient as unknown as jest.Mock).mockImplementation(() => ({
      connect: mockConnect,
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: mockInsertOne,
          findOne: mockFindOne,
          listIndexes: mockListIndexes,
          createIndex: mockCreateIndex,
        }),
      }),
      close: mockClose,
    }));

    // Default mock implementations
    mockListIndexes.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([]),
    });
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
    delete process.env.API_ROUTE_BEARER_KEY;
  });

  it("should return 401 if authorization header is missing", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      headers: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ error: "Unauthorized" });
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it("should return 401 if bearer token is invalid", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      headers: { authorization: "Bearer invalid-token" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ error: "Unauthorized" });
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it("should return 409 if path already exists", async () => {
    // Mock findOne to return an existing document
    mockFindOne.mockResolvedValueOnce({ random_path: "existing-path" });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      headers: { authorization: "Bearer test-api-key" },
      body: { random_path: "existing-path" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(409);
    expect(res._getJSONData()).toEqual({ error: "Path already exists" });
    expect(mockFindOne).toHaveBeenCalledWith({ random_path: "existing-path" });
    expect(mockInsertOne).not.toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  it("should convert string creation_date to Date object", async () => {
    // Mock findOne to return null (no existing document)
    mockFindOne.mockResolvedValueOnce(null);
    mockInsertOne.mockResolvedValueOnce({ acknowledged: true });

    const testDate = "2023-01-01T00:00:00Z";
    const expectedDate = new Date(testDate);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      headers: { authorization: "Bearer test-api-key" },
      body: {
        random_path: "new-path",
        creation_date: testDate,
      },
    });

    await handler(req, res);

    expect(mockInsertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        random_path: "new-path",
        creation_date: expectedDate,
      })
    );
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ success: true });
  });

  it("should create TTL index if it doesn't exist", async () => {
    // Mock findOne to return null (no existing document)
    mockFindOne.mockResolvedValueOnce(null);
    mockInsertOne.mockResolvedValueOnce({ acknowledged: true });

    // Mock listIndexes to indicate TTL index doesn't exist
    mockListIndexes.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([{ name: "other_index" }]),
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      headers: { authorization: "Bearer test-api-key" },
      body: {
        random_path: "new-path",
        creation_date: new Date(),
      },
    });

    await handler(req, res);

    expect(mockCreateIndex).toHaveBeenCalledWith(
      { creation_date: 1 },
      {
        name: "expiration_date",
        expireAfterSeconds: 2592000, // Parsed from the env vars
      }
    );
    expect(res._getStatusCode()).toBe(200);
  });

  it("should not create TTL index if it already exists", async () => {
    // Mock findOne to return null (no existing document)
    mockFindOne.mockResolvedValueOnce(null);
    mockInsertOne.mockResolvedValueOnce({ acknowledged: true });

    // Mock listIndexes to indicate TTL index already exists
    mockListIndexes.mockReturnValue({
      toArray: jest
        .fn()
        .mockResolvedValue([
          { name: "expiration_date" },
          { name: "other_index" },
        ]),
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      headers: { authorization: "Bearer test-api-key" },
      body: {
        random_path: "new-path",
        creation_date: new Date(),
      },
    });

    await handler(req, res);

    expect(mockCreateIndex).not.toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(200);
  });

  it("should return 500 if there is a database error", async () => {
    // Mock connect to throw an error
    mockConnect.mockRejectedValueOnce(new Error("Database connection error"));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      headers: { authorization: "Bearer test-api-key" },
      body: {
        random_path: "new-path",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Internal server error" });
  });
});
