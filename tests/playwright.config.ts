import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./",
  testIgnore: "**/jest/**",

  use: {
    baseURL: "https://localhost:3000",
    trace: "on",
    // ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
