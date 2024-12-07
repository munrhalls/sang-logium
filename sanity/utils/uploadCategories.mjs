import categoryDocuments from "./generateCategories.mjs";
import readline from "readline";
import client from "./getClient.mjs";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Log categories and prompt for confirmation
async function confirmUpload() {
  console.log("Categories to be uploaded:");
  categoryDocuments.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.name} (${doc._id})`);
    console.log(`   Path: ${doc.metadata?.path}`);
  });

  return new Promise((resolve) => {
    rl.question("Proceed with upload? (yes/no): ", (answer) => {
      resolve(answer.toLowerCase() === "yes");
      rl.close();
    });
  });
}

// Add metadata field
function computeMetadata(categories) {
  const map = {};

  // Create a map for quick lookup
  categories.forEach((cat) => {
    map[cat._id] = cat.slug.current;
  });

  // Add path and depth to each document
  categories.forEach((cat) => {
    const parentSlug = cat.parentCategory?._ref
      ? map[cat.parentCategory._ref]
      : null;
    const path = parentSlug
      ? `${parentSlug}/${cat.slug.current}`
      : cat.slug.current;
    const depth = path.split("/").length;

    // Add metadata
    cat.metadata = { path, depth };

    // Remove parentCategory as it's no longer needed
    delete cat.parentCategory;
  });

  return categories;
}

// Batch create categories
async function uploadCategories() {
  const updatedCategories = computeMetadata(categoryDocuments);
  const shouldProceed = await confirmUpload();

  if (!shouldProceed) {
    console.log("Upload cancelled.");
    return;
  }

  try {
    const transactions = updatedCategories.map((doc) => client.create(doc));

    const results = await Promise.all(transactions);
    console.log("Categories uploaded successfully:", results);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

uploadCategories();
