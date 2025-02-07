import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const getProductsByExhibitionSlug = async (slug: string) => {
  const PRODUCTS_BY_EXHIBITION_SLUG = await defineQuery(`
        *[_type == "product" && (
          _id in *[_type == "exhibition" && slug.current == $slug].products[]._ref
          ||
          categoryPath in *[_type == "exhibition" && slug.current == $slug].category->metadata.path
        )] | order(name asc)
       `);

  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_EXHIBITION_SLUG,
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

export default getProductsByExhibitionSlug;
