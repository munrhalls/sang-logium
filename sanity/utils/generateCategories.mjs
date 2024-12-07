import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
import client from "./getClient.mjs";

// TODO FOR IT TO WORK: 1. FILL PARENT/[CHILDREN] /// 2. CHOOSE ICON FOR PARENT AND CHILDREN

// Get the directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate categories dynamically
async function generateCategoryDocuments(parentName, childrenNames) {
  // Create slug helper
  const createSlug = (input) => {
    const slugified = input.toLowerCase().replace(/\s+/g, "-");
    return {
      _type: "slug",
      current: `${slugified}-${nanoid(6)}`,
    };
  };

  // Check if parent category exists
  const parentSlug = parentName.toLowerCase().replace(/\s+/g, "-");
  const existingParent = await client.fetch(
    `*[_type == "category" && slug.current match "${parentSlug}*"][0]`
  );

  let parentCategory;
  let parentPath;

  if (existingParent) {
    // Use existing category
    console.log(`Parent category found: ${existingParent.name}`);
    parentCategory = existingParent;
    parentPath = existingParent.metadata.path;
  } else {
    // Create new parent category
    console.log("Parent category not found. Creating new.");
    parentPath = parentSlug;
    parentCategory = {
      _type: "category",
      _id: `category-${parentSlug}`,
      name: parentName,
      icon: "wave", // TODO: ICON HERE
      slug: createSlug(parentName),
      metadata: {
        path: parentPath,
        depth: 1,
      },
    };
  }

  // Generate child categories
  const childCategories = childrenNames.map((name) => {
    const childSlug = name.toLowerCase().replace(/\s+/g, "-");
    const childPath = `${parentPath}/${childSlug}`;
    return {
      _type: "category",
      _id: `category-${childSlug}`,
      name,
      icon: "wave", // TODO: ICON HERE
      slug: createSlug(name),
      metadata: {
        path: childPath,
        depth: parentPath.split("/").length + 1,
      },
    };
  });

  // Combine parent and children
  const allCategories = existingParent
    ? childCategories
    : [parentCategory, ...childCategories];

  return allCategories;
}

// Generate and write to file / INPUT PARENT CATEGORY NAME AND CHILDREN CATEGORIES; REMEMBER TO CHOOSE ICON ABOVE
(async () => {
  const parentName = "Accessories";
  const childrenNames = [
    "Cables",
    "Cases",
    "Stands",
    "Adapters",
    "Replacement Parts",
  ];

  const categoryDocuments = await generateCategoryDocuments(
    parentName,
    childrenNames
  );

  const outputPath = path.join(__dirname, "categories.json");
  fs.writeFileSync(outputPath, JSON.stringify(categoryDocuments, null, 2));

  console.log(`Sanity category documents generated at ${outputPath}`);
})();
