import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

// Get the directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Generate documents for Studio Equipment categories
function generateCategoryDocuments() {
  // Main Studio Equipment category (top-level)
  const studioEquipmentCategory = {
    _type: "category",
    _id: "studio-equipment",
    name: "Studio Equipment",
    icon: "microphone",
    slug: createSlug("studio-equipment"),
    // No parentCategory for top-level category
  };

  // Subcategories with parent reference
  const subcategories = [
    "Microphones",
    "Audio Interfaces",
    "Studio Monitors",
    "Recording Bundles",
  ].map((name) => ({
    _type: "category",
    _id: `category-${createSlug(name).current}`,
    name: name,
    icon: "microphone",
    slug: createSlug(name),
    parentCategory: {
      _type: "reference",
      _ref: "studio-equipment",
    },
  }));

  return [studioEquipmentCategory, ...subcategories];
}

// Helper to create slug (simplified version of Sanity's slug creation)
function createSlug(input) {
  const slugified = input.toLowerCase().replace(/\s+/g, "-");
  return {
    _type: "slug",
    current: `${slugified}-${nanoid(6)}`,
  };
}
// Generate and export the documents
const categoryDocuments = generateCategoryDocuments();

// Write to file for Sanity CLI import

const outputPath = path.join(__dirname, "studio-equipment-categories.json");
fs.writeFileSync(outputPath, JSON.stringify(categoryDocuments, null, 2));

console.log(`Sanity category documents generated at ${outputPath}`);

export default categoryDocuments;
