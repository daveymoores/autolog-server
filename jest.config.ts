import type { Config } from "jest";
const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: true,
  coverageDirectory: "coverage",
  setupFiles: ["./jest.setup.js"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json", // Point to your test-specific tsconfig
        jsx: "react-jsx",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coverageReporters: ["text", "lcov"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};

export default config;
