# Simple Deployment Instructions

This document provides straightforward instructions for deploying the Sang-Logium e-commerce application.

## Prerequisites

1. Make sure you have the Netlify CLI installed:
   ```
   npm install -g netlify-cli
   ```

2. Ensure you're logged in to Netlify:
   ```
   netlify login
   ```

## Deployment Steps

### Option 1: Simple Deploy Command (Recommended)

```bash
# On Mac/Linux:
npm run deploy:ship

# On Windows:
npm run deploy:windows
```

This will build the application and deploy it to production in one step.

### Option 2: Manual Steps

If you prefer to run the steps individually:

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to production:
   ```
   netlify deploy --prod
   ```

## Troubleshooting

If the deployment fails, check the following:

1. Ensure your `.env.production` file contains the essential environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`

2. Make sure the Netlify site is properly linked to your repository:
   ```
   netlify link
   ```

3. For specific Netlify deployment errors, refer to the Netlify logs.