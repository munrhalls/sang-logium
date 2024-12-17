import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getFeaturedProducts = async () => {
  const query = defineQuery(`
    *[_type == "sale" && isActive == true] {
      discountAmount,
      "featuredProducts": featuredProducts[]-> {
        _id,
        name,
        "slug": slug.current,
        price,
        discountAmount,
        image
      }
    }
  `);

  return sanityFetch({ query });
};
