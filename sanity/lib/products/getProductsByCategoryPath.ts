import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const getProductsByCategoryPath = async (slug: string) => {
  const PRODUCTS_BY_CATEGORY_PATH_QUERY = await defineQuery(`
    *[_type == 'product' && categoryPath match $slug + "/*" || categoryPath == $slug] | order(name asc)
  `);

  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_PATH_QUERY,
      params: {
        slug,
      },
    });
    return products.data || [];
  } catch (err) {
    console.error("Error fetching products by category: ", err);
    return [];
  }
};

export default getProductsByCategoryPath;
