import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getProductBySlug(slug: string) {
  const PRODUCT_BY_ID_QUERY = defineQuery(`
            *[
                type == 'product'
                && slug.current == $slug
            ] | order(name asc) [0]
        `);

  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_ID_QUERY,
      params: {
        slug: `{slug}`,
      },
    });
    return product.data || [];
  } catch (err) {
    console.error("Fetching product by ID failed: ", err);
    return null;
  }
}
