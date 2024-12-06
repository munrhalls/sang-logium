const fs = require("fs");
import sanity from "@sanity/cli";

// Replace with your actual Sanity project ID
const projectId = "YOUR_PROJECT_ID";

// Replace with your actual Sanity dataset (e.g., 'production')
const dataset = "YOUR_DATASET";

// Path to your products data file
const dataFilePath = "../sang-logium-data/productsData.json";

async function addProductsToSanity() {
  try {
    // Read product data from JSON file
    const productsData = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

    // Sanity client configuration
    const client = sanity({
      api: {
        projectId,
        dataset,
      },
    });

    if (!client) throw Error("no client");
    // Iterate through product data and create documents
    for (const product of productsData) {
      const {
        name,
        slug,
        image,
        description,
        price,
        category,
        subcategory,
        stock,
      } = product;

      // Create a Sanity document object based on your schema
      const document = {
        _type: "product",
        name,
        slug,
        image: {
          _type: "image",
          asset: {
            // Assuming image assets are already uploaded to Sanity
            _ref: image, // Replace with actual image asset reference
          },
        },
        description,
        price,
        category: {
          _ref: category, // Replace with actual category reference
        },
        subcategory: {
          ref: {
            _ref: subcategory, // Replace with actual subcategory reference
          },
        },
        stock,
      };

      // Add validation checks for required fields (optional, but recommended)
      const validationErrors = [];
      if (!name) {
        validationErrors.push("Name is required");
      }
      if (!slug) {
        validationErrors.push("Slug is required");
      }
      if (!category) {
        validationErrors.push("Category is required");
      }
      if (!subcategory) {
        validationErrors.push("Subcategory is required");
      }

      if (validationErrors.length > 0) {
        console.error(`Validation errors for product "${name}":`);
        console.error(validationErrors.join("\n"));
        continue; // Skip adding product with validation errors
      }

      // Create the document in Sanity
      const createdDocument = await client.create(document);
      console.log(
        `Product "${name}" (ID: ${createdDocument._id}) added successfully!`
      );
    }
  } catch (error) {
    console.error("Error adding products to Sanity:", error);
  }
}

addProductsToSanity();
