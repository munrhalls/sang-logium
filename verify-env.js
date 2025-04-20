// Minimal environment variables verification
import dotenv from 'dotenv';

// Try to load environment variables from .env.production
try {
  dotenv.config({ path: '.env.production' });
} catch (err) {
  // Silently continue if file doesn't exist
}

// Check for essential environment variables
const essentialVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET'
];

const missing = [];

for (const varName of essentialVars) {
  if (!process.env[varName]) {
    missing.push(varName);
  }
}

if (missing.length > 0) {
  console.error('\x1b[31mError: Missing essential environment variables:\x1b[0m', missing.join(', '));
  console.log('\x1b[33mThese variables must be set in .env.production or in Netlify environment settings.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32mEssential environment variables are set.\x1b[0m');
}