import fs from "fs";
import path from "path";
import client from "../getClient.mjs";
import axios from "axios";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(__dirname, "./sanityProducts.json");

const uploadImage = async (url) => {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL");
  }
  console.log(`Uploading image from URL: ${url}`);
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data, "binary");
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(url),
  });
  return asset._id;
};

const transformProduct = async (product) => {
  console.log(`Transforming product: ${product.name}`);

  const imageId = await uploadImage(product.image.asset._ref);
  const galleryIds = await Promise.all(
    product.gallery.map((img) => uploadImage(img.asset._ref))
  );

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
    name: product.name,
    slug: {
      _type: "slug",
      current: product.slug.current,
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
        _ref: imageId,
      },
    },
    gallery: galleryIds.map((id) => ({
      _type: "image",
      _key: uuidv4(), // Add unique key for each gallery item
      asset: {
        _type: "reference",
        _ref: id,
      },
    })),
    specifications: specifications,
    overviewFields: overviewFields,
    categoryPath: product.categoryPath,
  };
};

fs.readFile(inputFilePath, "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading the input file:", err);
    return;
  }

  const products = JSON.parse(data);

  try {
    for (const product of products) {
      const transformedProduct = await transformProduct(product);
      const response = await client.create(transformedProduct);
      console.log("Product created:", response);
    }
    console.log("All products have been uploaded successfully.");
  } catch (error) {
    console.error("Error uploading products:", error);
  }
});
