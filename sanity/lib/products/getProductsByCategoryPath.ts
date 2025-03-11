import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const getProductsByCategoryPath = async (path: string) => {
  const PRODUCTS_BY_CATEGORY_PATH_QUERY = await defineQuery(`
    *[_type == 'product' && categoryPath match $path + "/*" || categoryPath == $path] | order(name asc)
  `);

  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_PATH_QUERY,
      params: {
        path,
      },
    });
    return products.data || [];
  } catch (err) {
    console.error("Error fetching products by category: ", err);
    return [];
  }
};

export default getProductsByCategoryPath;
