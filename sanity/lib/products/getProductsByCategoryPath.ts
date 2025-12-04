import { defineQuery } from "next-sanity";
import { client } from "../client";

const getProductsByCategoryPath = async (path: string) => {
  const PRODUCTS_BY_CATEGORY_PATH_QUERY = await defineQuery(`
    *[_type == 'product' && categoryPath match $path + "/*" || categoryPath == $path] | order(name asc)
  `);

  try {
    const products = await client.fetch(PRODUCTS_BY_CATEGORY_PATH_QUERY, {
      path,
    });
    return products || [];
  } catch (err) {
    console.error("Error fetching products by category: ", err);
    return [];
  }
};

export default getProductsByCategoryPath;
