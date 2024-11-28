// scripts/seedCategories.ts
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: "2024-03-01",
});

const categories = [
  {
    name: "Headphones",
    iconName: "headphones",
    subcategories: [
      "Over-Ear",
      "In-Ear",
      "On-Ear",
      "Wireless",
      "Noise-Cancelling",
    ],
  },
  // ... other categories
];

async function seedCategories() {
  try {
    for (const category of categories) {
      const doc = {
        _type: "category",
        title: category.name,
        slug: {
          _type: "slug",
          current: category.name.toLowerCase().replace(/\s+/g, "-"),
        },
        icon: category.iconName,
        description: `${category.name} category`,
        subcategories: category.subcategories,
      };

      const result = await client.create(doc);
      console.log(`Created category: ${result.title}`);
    }
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}

seedCategories();
