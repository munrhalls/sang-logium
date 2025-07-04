// backup-env.js - Cross-platform environment backup script
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ANSI colors for terminal output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

// Format timestamp in a filesystem-safe way
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

// Create backups directory if it doesn't exist
const backupDir = path.join(process.cwd(), "backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
  console.log(`${colors.green}Created backups directory${colors.reset}`);
}

// Files to backup
const filesToBackup = [
  ".env.production",
  ".env.local",
  "netlify.toml",
  "next.config.ts",
];

// Create timestamp-based backup folder
const deployBackupDir = path.join(backupDir, `deploy-backup-${timestamp}`);
fs.mkdirSync(deployBackupDir);
console.log(
  `${colors.green}Created backup directory: ${deployBackupDir}${colors.reset}`,
);

// Backup each file
let backupCount = 0;
filesToBackup.forEach((file) => {
  try {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      fs.writeFileSync(path.join(deployBackupDir, file), content);
      console.log(`${colors.green}✓${colors.reset} Backed up ${file}`);
      backupCount++;
    } else {
      console.log(
        `${colors.yellow}!${colors.reset} File ${file} not found, skipping backup`,
      );
    }
  } catch (err) {
    console.error(
      `${colors.red}✗${colors.reset} Error backing up ${file}:`,
      err.message,
    );
  }
});

// Create a deployment log with Git information (if available)
try {
  let gitStatus = "Not available";
  let gitBranch = "Not available";

  try {
    gitStatus = execSync("git log -1 --oneline", {
      stdio: ["pipe", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch (e) {
    // Git command failed, use default value
  }

  try {
    gitBranch = execSync("git branch --show-current", {
      stdio: ["pipe", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch (e) {
    // Git command failed, use default value
  }

  const logContent = `
Deployment Backup - ${new Date().toISOString()}
Git commit: ${gitStatus}
Git branch: ${gitBranch}
Files backed up: ${backupCount}/${filesToBackup.length}
`;

  fs.writeFileSync(path.join(deployBackupDir, "deploy-info.log"), logContent);
  console.log(`${colors.green}✓${colors.reset} Created deployment info log`);
} catch (err) {
  console.error(
    `${colors.red}✗${colors.reset} Error creating deployment log:`,
    err.message,
  );
}

console.log(
  `\n${colors.green}Backup complete${colors.reset}: ${backupCount} files backed up to ${path.relative(process.cwd(), deployBackupDir)}`,
);
