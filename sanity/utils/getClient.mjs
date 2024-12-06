import dotenv from "dotenv";
import { createClient } from "@sanity/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Sanity client configuration
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
});

export default client;
