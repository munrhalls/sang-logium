// verify-deployment.js - Cross-platform deployment verification
import fetch from "node-fetch";
import { setTimeout } from "timers/promises";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ANSI colors for terminal output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

// Load environment variables if available
try {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.join(currentDir, ".env.production");

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
} catch (err) {
  console.log(
    `${colors.yellow}Could not load .env.production file${colors.reset}`,
  );
}

// Configuration - use environment variable or default
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://sang-logium.com";

// Endpoints to verify
const ENDPOINTS = [
  "/", // Homepage
  "/products", // Products listing
  "/products?page=2", // Pagination
  "/products?brand=sony", // Filtering
  "/api/sanity/health", // API health check
];

/**
 * Check a single endpoint
 * @param {string} url - URL to check
 * @returns {Promise<boolean>} - Whether the check passed
 */
async function checkEndpoint(url) {
  try {
    console.log(`${colors.blue}Testing${colors.reset}: ${url}`);
    const start = Date.now();
    const response = await fetch(url, {
      headers: { "User-Agent": "Sang-Logium-Deployment-Verifier/1.0" },
      timeout: 10000, // 10 second timeout
    });
    const timeMs = Date.now() - start;

    if (response.ok) {
      console.log(
        `${colors.green}✓ Success${colors.reset}: ${url} - ${response.status} (${timeMs}ms)`,
      );
      return true;
    } else {
      console.error(
        `${colors.red}✗ Failed${colors.reset}: ${url} - ${response.status} (${timeMs}ms)`,
      );
      return false;
    }
  } catch (error) {
    console.error(
      `${colors.red}✗ Error${colors.reset}: ${url} - ${error.message}`,
    );
    return false;
  }
}

/**
 * Verify the deployment by checking all endpoints
 */
async function verifyDeployment() {
  console.log(
    `\n${colors.yellow}Verifying deployment at ${colors.blue}${SITE_URL}${colors.reset}...\n`,
  );

  let passedCount = 0;
  let failedCount = 0;

  for (const path of ENDPOINTS) {
    try {
      const url = new URL(path, SITE_URL).toString();
      const passed = await checkEndpoint(url);

      if (passed) {
        passedCount++;
      } else {
        failedCount++;
      }

      // Small delay between requests to avoid rate limiting
      await setTimeout(500);
    } catch (error) {
      console.error(
        `${colors.red}Error checking endpoint ${path}:${colors.reset}`,
        error.message,
      );
      failedCount++;
    }
  }

  // Print summary
  console.log(`\n${colors.yellow}Verification Summary:${colors.reset}`);
  console.log(
    `${colors.green}✓ Passed:${colors.reset} ${passedCount}/${ENDPOINTS.length}`,
  );

  if (failedCount > 0) {
    console.log(
      `${colors.red}✗ Failed:${colors.reset} ${failedCount}/${ENDPOINTS.length}`,
    );
    console.log(
      `\n${colors.red}Some endpoints failed verification.${colors.reset}`,
    );
    console.log(`${colors.yellow}Possible actions:${colors.reset}`);
    console.log(`- Check the Netlify deployment logs`);
    console.log(`- Verify your Sanity connection is working`);
    console.log(`- Check your environment variables are set correctly`);
    console.log(
      `- Run 'netlify sites:rollback' to revert to a previous deployment if needed`,
    );
    process.exit(1);
  } else {
    console.log(
      `\n${colors.green}✓ All endpoints verified successfully!${colors.reset}`,
    );
    process.exit(0);
  }
}

// Run the verification
verifyDeployment().catch((err) => {
  console.error(
    `${colors.red}Fatal error during verification:${colors.reset}`,
    err,
  );
  process.exit(1);
});
