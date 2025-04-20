#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Sang-Logium deployment process...${NC}"

# Step 1: Create environment backup
echo -e "${YELLOW}Creating environment backup...${NC}"
npm run backup
if [ $? -ne 0 ]; then
  echo -e "${RED}Backup failed. Aborting deployment.${NC}"
  exit 1
fi
echo -e "${GREEN}Backup completed successfully.${NC}"

# Step 2: Verify environment variables
echo -e "${YELLOW}Verifying environment variables...${NC}"
node verify-env.js
if [ $? -ne 0 ]; then
  echo -e "${RED}Environment verification failed. Aborting deployment.${NC}"
  exit 1
fi
echo -e "${GREEN}Environment verification passed.${NC}"

# Step 3: Run tests
echo -e "${YELLOW}Running tests...${NC}"
npm run test:ci
if [ $? -ne 0 ]; then
  echo -e "${RED}Tests failed. Aborting deployment.${NC}"
  exit 1
fi
echo -e "${GREEN}Tests passed.${NC}"

# Step 4: Run linting
echo -e "${YELLOW}Running linting...${NC}"
npm run lint-strict
if [ $? -ne 0 ]; then
  echo -e "${RED}Linting failed. Aborting deployment.${NC}"
  exit 1
fi
echo -e "${GREEN}Linting passed.${NC}"

# Step 5: Generate Sanity types
echo -e "${YELLOW}Generating Sanity types...${NC}"
npm run typegen
if [ $? -ne 0 ]; then
  echo -e "${RED}Type generation failed. Aborting deployment.${NC}"
  exit 1
fi
echo -e "${GREEN}Type generation completed.${NC}"

# Step 6: Build application
echo -e "${YELLOW}Building application...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Aborting deployment.${NC}"
  exit 1
fi
echo -e "${GREEN}Build completed successfully.${NC}"

# Step 7: Deploy to staging
echo -e "${YELLOW}Deploying to staging...${NC}"
npm run deploy:staging
if [ $? -ne 0 ]; then
  echo -e "${RED}Staging deployment failed. Aborting production deployment.${NC}"
  exit 1
fi
echo -e "${GREEN}Staging deployment successful.${NC}"

# Step 8: Prompt for production deployment
read -p "Do you want to proceed with production deployment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Step 9: Deploy to production
  echo -e "${YELLOW}Deploying to production...${NC}"
  npm run deploy
  if [ $? -ne 0 ]; then
    echo -e "${RED}Production deployment failed.${NC}"
    exit 1
  fi
  echo -e "${GREEN}Production deployment successful!${NC}"
  
  # Step 10: Verify deployment
  echo -e "${YELLOW}Verifying deployment...${NC}"
  npm run verify
  if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment verification failed. Consider rolling back.${NC}"
    echo -e "${YELLOW}Run 'netlify sites:rollback' to rollback to the previous version.${NC}"
    exit 1
  fi
  echo -e "${GREEN}Deployment verification passed.${NC}"
  
  echo -e "${GREEN}Deployment process completed successfully!${NC}"
else
  echo -e "${YELLOW}Production deployment aborted.${NC}"
  exit 0
fi