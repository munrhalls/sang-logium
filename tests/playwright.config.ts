import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./",
  testIgnore: "**/jest/**",

  webServer: {
    command: "npm run dev:test",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL: "http://localhost:3001",
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
