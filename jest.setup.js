import "@testing-library/jest-dom";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
console.log(
  "TESTS: Setup file loaded, CONFIRM_API_TESTS:",
  process.env.CONFIRM_API_TESTS
);
