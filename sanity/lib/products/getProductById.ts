import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductById = async (id: string) => {
  console.log("Received ID:", id);
  const PRODUCT_BY_ID_QUERY = defineQuery(`
            *[
                _type == 'product'
                && _id == $id
            ] | order(name asc) [0]
        `);

  try {
    console.log("Query params:", { $id: id }); // Add this

    const product = await sanityFetch({
      query: PRODUCT_BY_ID_QUERY,
      params: {
        id,
      },
    });
    return product.data || null;
  } catch (err) {
    console.error("Fetching product by ID failed: ", err);
    return null;
  }
};
