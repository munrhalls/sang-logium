import categoryDocuments from "./generateCategories.mjs";
import readline from "readline";
import client from "./getClient.mjs";

// Sanity client configuration

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
    if (doc.parentCategory) {
      console.log(`   Parent: ${doc.parentCategory._ref}`);
    }
  });

  return new Promise((resolve) => {
    rl.question("Proceed with upload? (yes/no): ", (answer) => {
      resolve(answer.toLowerCase() === "yes");
      rl.close();
    });
  });
}

// Batch create categories
async function uploadCategories() {
  const shouldProceed = await confirmUpload();

  if (!shouldProceed) {
    console.log("Upload cancelled.");
    return;
  }

  try {
    const transactions = categoryDocuments.map((doc) => client.create(doc));

    const results = await Promise.all(transactions);
    console.log("Categories uploaded successfully:", results);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

uploadCategories();
