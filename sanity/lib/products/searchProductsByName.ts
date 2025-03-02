import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

type Query = string | string[];

export const searchProductsByName = async (searchParam: Query) => {
  const SEARCH_FOR_PRODUCTS_QUERY = defineQuery(`*[
        _type == "product"
        && name match $searchParam
    ] | order(name asc)`);

  try {
    const products = await sanityFetch({
      query: SEARCH_FOR_PRODUCTS_QUERY,
      params: {
        searchParam: `${searchParam}*`,
      },
    });
    return products.data || [];
  } catch (err) {
    console.error("Products search resulted in error: ", err);
    return [];
  }
};
