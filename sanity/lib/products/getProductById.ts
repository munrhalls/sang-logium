import { defineQuery } from "next-sanity";
import { client } from "../client";

export const getProductById = async (id: string) => {
  const PRODUCT_BY_ID_QUERY = defineQuery(`
            *[
                _type == 'product'
                && _id == $id
            ] | order(name asc) [0]
        `);

  try {
    const product = await client.fetch(PRODUCT_BY_ID_QUERY, { id });
    return product || null;
  } catch (err) {
    console.error("Fetching product by ID failed: ", err);
    return null;
  }
};
