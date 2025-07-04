// deploy.js - Cross-platform deployment script
import { execSync } from "child_process";
import readline from "readline";
import { promisify } from "util";

// ANSI colors for terminal output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

// Create readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = promisify(rl.question).bind(rl);

/**
 * Run a command and return its output
 * @param {string} command - Command to execute
 * @param {boolean} printOutput - Whether to print the command output
 * @returns {string} - Command output
 */
function runCommand(command, printOutput = true) {
  try {
    console.log(`${colors.yellow}> ${command}${colors.reset}`);
    const output = execSync(command, { encoding: "utf8" });
    if (printOutput && output.trim()) {
      console.log(output);
    }
    return { success: true, output };
  } catch (error) {
    console.error(
      `${colors.red}Error executing command:${colors.reset} ${command}`,
    );
    if (error.stdout) console.error(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    return { success: false, error };
  }
}

/**
 * Print a step header
 * @param {string} step - Step description
 */
function printStep(step) {
  console.log(`\n${colors.yellow}${step}${colors.reset}`);
  console.log("═".repeat(step.length + 5));
}

/**
 * Main deployment function
 */
async function deploy() {
  try {
    console.log(
      `\n${colors.yellow}Starting Sang-Logium deployment process...${colors.reset}\n`,
    );

    // Step 1: Create environment backup
    printStep("Step 1: Creating environment backup");
    const backupResult = runCommand("npm run backup");
    if (!backupResult.success) {
      console.error(
        `${colors.red}Backup failed. Aborting deployment.${colors.reset}`,
      );
      process.exit(1);
    }
    console.log(`${colors.green}Backup completed successfully.${colors.reset}`);

    // Step 2: Verify environment variables
    printStep("Step 2: Verifying environment variables");
    const envCheckResult = runCommand("node verify-env.js");
    if (!envCheckResult.success) {
      console.error(
        `${colors.red}Environment verification failed. Aborting deployment.${colors.reset}`,
      );
      process.exit(1);
    }
    console.log(
      `${colors.green}Environment verification passed.${colors.reset}`,
    );

    // Step 3: Run tests
    printStep("Step 3: Running tests");
    const testResult = runCommand("npm run test:ci");
    if (!testResult.success) {
      console.error(
        `${colors.red}Tests failed. Aborting deployment.${colors.reset}`,
      );
      process.exit(1);
    }
    console.log(`${colors.green}Tests passed.${colors.reset}`);

    // Step 4: Run linting
    printStep("Step 4: Running linting");
    const lintResult = runCommand("npm run lint-strict");
    if (!lintResult.success) {
      console.error(
        `${colors.red}Linting failed. Aborting deployment.${colors.reset}`,
      );
      process.exit(1);
    }
    console.log(`${colors.green}Linting passed.${colors.reset}`);

    // Step 5: Generate Sanity types
    printStep("Step 5: Generating Sanity types");
    const typegenResult = runCommand("npm run typegen");
    if (!typegenResult.success) {
      console.error(
        `${colors.red}Type generation failed. Aborting deployment.${colors.reset}`,
      );
      process.exit(1);
    }
    console.log(`${colors.green}Type generation completed.${colors.reset}`);

    // Step 6: Build application
    printStep("Step 6: Building application");
    const buildResult = runCommand("npm run build");
    if (!buildResult.success) {
      console.error(
        `${colors.red}Build failed. Aborting deployment.${colors.reset}`,
      );
      process.exit(1);
    }
    console.log(`${colors.green}Build completed successfully.${colors.reset}`);

    // Step 7: Deploy to staging
    printStep("Step 7: Deploying to staging");
    const stagingResult = runCommand("npm run deploy:staging");
    if (!stagingResult.success) {
      console.error(
        `${colors.red}Staging deployment failed. Aborting production deployment.${colors.reset}`,
      );
      process.exit(1);
    }
    console.log(`${colors.green}Staging deployment successful.${colors.reset}`);

    // Extract preview URL from Netlify output if available
    let previewUrl = "";
    try {
      const match = stagingResult.output.match(
        /Website Draft URL: (https:\/\/[^\s]+)/,
      );
      if (match && match[1]) {
        previewUrl = match[1];
        console.log(`${colors.green}Preview URL: ${previewUrl}${colors.reset}`);
      }
    } catch (e) {
      console.log(
        `${colors.yellow}Could not extract preview URL from Netlify output${colors.reset}`,
      );
    }

    // Step 8: Prompt for production deployment
    const answer = await question(
      `\n${colors.yellow}Do you want to proceed with production deployment? (y/n) ${colors.reset}`,
    );

    if (answer.toLowerCase() === "y") {
      // Step 9: Deploy to production
      printStep("Step 9: Deploying to production");
      const prodResult = runCommand("npm run deploy");
      if (!prodResult.success) {
        console.error(
          `${colors.red}Production deployment failed.${colors.reset}`,
        );
        process.exit(1);
      }
      console.log(
        `${colors.green}Production deployment successful!${colors.reset}`,
      );

      // Step 10: Verify deployment
      printStep("Step 10: Verifying deployment");
      const verifyResult = runCommand("npm run verify");
      if (!verifyResult.success) {
        console.error(
          `${colors.red}Deployment verification failed. Consider rolling back.${colors.reset}`,
        );
        console.log(
          `${colors.yellow}Run 'netlify sites:rollback' to rollback to the previous version.${colors.reset}`,
        );
        process.exit(1);
      }
      console.log(
        `${colors.green}Deployment verification passed.${colors.reset}`,
      );

      console.log(
        `\n${colors.green}Deployment process completed successfully!${colors.reset}`,
      );
    } else {
      console.log(
        `\n${colors.yellow}Production deployment aborted.${colors.reset}`,
      );
    }
  } catch (error) {
    console.error(
      `${colors.red}Unexpected error during deployment:${colors.reset}`,
      error,
    );
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the deployment process
deploy().catch((err) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, err);
  process.exit(1);
});
