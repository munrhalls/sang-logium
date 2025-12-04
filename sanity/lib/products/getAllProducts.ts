import { defineQuery } from "next-sanity";
import { client } from "../client";

export const getAllProducts = async () => {
  const ALL_PRODUCTS_QUERY = defineQuery(`
        *[
            _type == "product"
        ] | order(name asc)
    `);

  try {
    const products = await client.fetch(ALL_PRODUCTS_QUERY);
    return products || [];
  } catch (err) {
    console.error("Error fetching all products: ", err);
    return [];
  }
};
