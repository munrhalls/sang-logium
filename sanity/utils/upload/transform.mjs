import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(
  __dirname,
  "../../../../sang-logium-data/products.json"
);
const outputFilePath = path.join(__dirname, "./sanityProducts.json");

const transformProduct = (product) => {
  // Convert description to blockContent format with unique keys
  const description = [
    {
      _type: "block",
      _key: uuidv4(), // Add unique key for the block
      children: [
        {
          _type: "span",
          _key: uuidv4(), // Add unique key for the span
          text: product.description,
        },
      ],
    },
  ];

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
    price: product.price ? parseFloat(product.price.replace("$", "")) : null,
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

fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the input file:", err);
    return;
  }

  const products = JSON.parse(data);
  const sanityProducts = transformProducts(products);

  fs.writeFile(
    outputFilePath,
    JSON.stringify(sanityProducts, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing the output file:", err);
        return;
      }

      console.log("Sanity products JSON file has been created successfully.");
    }
  );
});
