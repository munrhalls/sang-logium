import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(
  __dirname,
  "../../../sang-logium-data/products.json"
);
const outputFilePath = path.join(__dirname, "./sanityProducts.json");

const transformProduct = (product) => {
  console.log(`Transforming product: ${product.title} ...`);
  // Convert description to blockContent format with unique keys
  const description = product.description.map((block) => ({
    _type: "block",
    _key: uuidv4(), // Add unique key for the block
    style: block.style,
    children: block.children.map((child) => ({
      _type: "span",
      _key: uuidv4(), // Add unique key for the span
      text: child.text,
    })),
  }));

  // Transform specifications to match the new schema
  const specifications = product.specifications.map((spec) => ({
    _type: "spec",
    _key: uuidv4(), // Add unique key for each specification item
    title: spec.title,
    value: spec.value,
    information: spec.information,
  }));

  // Transform overviewFields to match the new schema
  const overviewFields = product.overviewFields.map((field) => ({
    _type: "overviewField",
    _key: uuidv4(), // Add unique key for each overview field
    title: field.title,
    value: field.value,
    information: field.information,
  }));

  return {
    _type: "product",
    name: product.title,
    slug: {
      _type: "slug",
      current: product.slug,
    },
    brand: product.brand,
    description: description,
    price: product.price,
    sku: product.sku,
    stock: product.stock,
    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: product.imageUrl,
      },
    },
    gallery: product.galleryUrls.map((url) => ({
      _type: "image",
      _key: uuidv4(), // Add unique key for each gallery item
      asset: {
        _type: "reference",
        _ref: url,
      },
    })),
    specifications: specifications,
    overviewFields: overviewFields,
    categoryPath: product.categoryPath,
  };
};

const transformProducts = (products) => {
  return products.map(transformProduct);
};

const transform = async () => {
  try {
    console.log(`Deleting existing file at: ${outputFilePath}`);
    // Delete existing sanityProducts.json file if it exists
    await fs.unlink(outputFilePath).catch((err) => {
      if (err.code !== "ENOENT") {
        throw err;
      }
    });

    console.log("Reading input file and transforming products...");
    // Read input file and transform products
    const data = await fs.readFile(inputFilePath, "utf8");
    const products = JSON.parse(data);
    const sanityProducts = transformProducts(products);

    console.log(`Writing transformed products to: ${outputFilePath}`);
    // Write transformed products to sanityProducts.json
    await fs.writeFile(
      outputFilePath,
      JSON.stringify(sanityProducts, null, 2),
      "utf8"
    );

    console.log("Sanity products JSON file has been created successfully.");
  } catch (err) {
    console.error("Error during transformation:", err);
  }
};

transform();
