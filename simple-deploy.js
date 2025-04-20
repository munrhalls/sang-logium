// simple-deploy.js - Straightforward deployment script
import { execSync } from 'child_process';

// Colors for terminal output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

console.log(`\n${colors.blue}Starting Sang-Logium deployment...${colors.reset}\n`);

try {
  // Step 1: Build the application
  console.log(`${colors.yellow}Building the application...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${colors.green}Build completed successfully.${colors.reset}\n`);

  // Step 2: Deploy to production
  console.log(`${colors.yellow}Deploying to production...${colors.reset}`);
  execSync('netlify deploy --prod', { stdio: 'inherit' });
  console.log(`${colors.green}Deployment completed successfully!${colors.reset}\n`);

  console.log(`${colors.green}The application is now live!${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Deployment failed:${colors.reset}`, error.message);
  process.exit(1);
}