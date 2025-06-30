import nextJest from "next/jest.js";
import dotenv from "dotenv";

dotenv.config({
  path: "__tests__/.env.local",
});

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Results",
        outputPath: "test-results.html",
        includeFailureMsg: true,
      },
    ],
  ],
};

export default createJestConfig(customJestConfig);
