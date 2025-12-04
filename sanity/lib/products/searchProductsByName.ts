import { defineQuery } from "next-sanity";
import { client } from "../client";

type Query = string | string[];

export const searchProductsByName = async (searchParam: Query) => {
  const SEARCH_FOR_PRODUCTS_QUERY = defineQuery(`*[
        _type == "product"
        && name match $searchParam
    ] | order(name asc)`);

  try {
    const products = await client.fetch(SEARCH_FOR_PRODUCTS_QUERY, {
      searchParam: `${searchParam}*`,
    });
    return products || [];
  } catch (err) {
    console.error("Products search resulted in error: ", err);
    return [];
  }
};
