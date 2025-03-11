import connect_to_db from "../connect_to_db";
jest.mock("mongodb", () => ({
  MongoClient: jest.fn(() => ({
    connect: jest.fn(),
    db: jest.fn(() => ({
      collection: jest.fn(),
    })),
  })),
}));

describe("connect_to_db", () => {
  it("connects and returns a connection object", async () => {
    const connection_vars = {
      MONGODB_URI: "test",
      MONGODB_DB: "test",
      MONGODB_COLLECTION: "test",
      SITE_URL: "vars",
    };
    const obj = await connect_to_db(connection_vars);
    expect(obj).toMatchInlineSnapshot(`
      {
        "client": {
          "connect": [MockFunction] {
            "calls": [
              [],
            ],
            "results": [
              {
                "type": "return",
                "value": undefined,
              },
            ],
          },
          "db": [MockFunction] {
            "calls": [
              [
                "test",
              ],
            ],
            "results": [
              {
                "type": "return",
                "value": {
                  "collection": [MockFunction] {
                    "calls": [
                      [
                        "test",
                      ],
                    ],
                    "results": [
                      {
                        "type": "return",
                        "value": undefined,
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        "database": {
          "collection": [MockFunction] {
            "calls": [
              [
                "test",
              ],
            ],
            "results": [
              {
                "type": "return",
                "value": undefined,
              },
            ],
          },
        },
        "mongoCollection": undefined,
      }
    `);
  });
});
