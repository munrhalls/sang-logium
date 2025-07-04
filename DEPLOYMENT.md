# Sang-Logium Deployment Checklist

This document outlines the safe procedure for deploying the Sang-Logium e-commerce application to production.

## Pre-Deployment Preparation

1. **Ensure you are on the correct branch**

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Verify environment variables**
   All required environment variables should be set in `.env.production`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_TOKEN`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (ensure it's the production key)
   - `CLERK_SECRET_KEY` (ensure it's the production key)
   - `NEXT_PUBLIC_BASE_URL`

4. **Run automated tests and linting**
   ```bash
   npm run test:ci
   npm run lint-strict
   ```

## Deployment Process

1. **Generate Sanity type definitions**

   ```bash
   npm run typegen
   ```

2. **Build the application**

   ```bash
   npm run build
   ```

3. **Deploy to staging (preview)**

   ```bash
   npm run deploy:staging
   ```

   Verify the preview URL works correctly:
   - Check homepage and navigation
   - Verify product listings and filtering
   - Test authentication flow
   - Verify shopping cart functionality
   - Test pagination system with filters

4. **Deploy to production**

   ```bash
   npm run deploy
   ```

   Or use the build and deploy command in one step:

   ```bash
   npm run build && npm run deploy
   ```

## Post-Deployment Verification

1. **Functional Tests**:
   - Verify homepage loads correctly at https://sang-logium.com
   - Confirm product listings and filtering work
   - Test authentication flow
   - Verify shopping cart functionality
   - Confirm checkout process
   - Test pagination system with filters

2. **Technical Verification**:
   - Check Sanity CMS connection (products and categories load)
   - Verify images load correctly from CDN
   - Confirm Clerk authentication functions properly
   - Test that pagination, sorting, and filtering work together

## Rollback Procedure (If Needed)

If issues are detected after deployment:

```bash
# Revert to previous deployment on Netlify
netlify sites:rollback

# Or manually trigger rollback from the Netlify dashboard
# Navigate to Deploys > Previous deploy > Publish deploy
```

## Security Notes

- Never commit sensitive API tokens to the repository
- Ensure you're using production keys for all services
- Consider moving sensitive environment variables to the Netlify dashboard instead of storing in `.env.production`

## Troubleshooting

Common issues and their solutions:

1. **Build fails due to TypeScript errors**:
   Run `npm run lint-strict` locally to identify and fix issues before deployment.

2. **Authentication not working in production**:
   Verify Clerk keys are set correctly and using production values, not test values.

3. **Images not loading**:
   Check CORS settings in Sanity dashboard and verify image domains in `next.config.ts`.

4. **Deployment failing with "out of memory" error**:
   Try running the build with increased memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`
