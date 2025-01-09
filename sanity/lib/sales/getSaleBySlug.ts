import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getSaleBySlug = async (slug: string) => {
  const GET_SALE_BY_SLUG_QUERY = defineQuery(`
    *[_type == "sale" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      discount,
      validFrom,
      validUntil,
      isActive,
      "products": products[]-> {
        _id,
        name,
        "slug": slug.current,
        price,
        description,
        "image": images[0].asset->url,
        "category": category->name
      }
    }
  `);

  try {
    const sale = await sanityFetch({
      query: GET_SALE_BY_SLUG_QUERY,
      params: { slug },
    });
    return sale.data || [];
  } catch (err) {
    console.error("Error fetching sale: ", err);
    return null;
  }
};
