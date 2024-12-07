import fs from "fs";
import path from "path";
import _ from "lodash";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(
  __dirname,
  "../../../../sang-logium-data/products.json"
);
const outputFilePath = path.join(__dirname, "./sanityProducts.json");

const transformProduct = (product) => {
  return {
    _type: "product",
    name: product.title,
    slug: {
      _type: "slug",
      current: product.slug,
    },
    brand: product.brand,
    description: product.description,
    price: parseFloat(product.price.replace("$", "")),
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
      asset: {
        _type: "reference",
        _ref: url,
      },
    })),
    specifications: _.map(product.specifications, (value, key) => ({
      _type: "spec",
      key: key,
      value: value,
    })),
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
