// scripts/seedCategories.ts
// import { client } from "./sanity/lib/client";
import { createClient } from "next-sanity";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-03-01",
});

const categories = [
  {
    name: "Headphones",
    icon: "headphones",
    subcategories: [
      "Over-Ear",
      "In-Ear",
      "On-Ear",
      "Wireless",
      "Noise-Cancelling",
    ],
  },
  {
    name: "Studio Equipment",
    icon: "microphone",
    subcategories: [
      "Microphones",
      "Audio Interfaces",
      "Studio Monitors",
      "Recording Bundles",
    ],
  },
  {
    name: "Accessories",
    icon: "toolbox",
    subcategories: [
      "Cables",
      "Cases",
      "Stands",
      "Adapters",
      "Replacement Parts",
    ],
  },
  {
    name: "Hi-Fi Audio",
    icon: "music",
    subcategories: ["Amplifiers", "DACs", "Speakers", "Turntables"],
  },
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
        icon: category.icon,
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
