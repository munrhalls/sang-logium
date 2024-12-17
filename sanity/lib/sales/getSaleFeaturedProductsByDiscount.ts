import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getSaleFeaturedProductsByDiscount = async (
  discountAmount: number
) => {
  const query = defineQuery(`
      *[_type == "sale" && isActive == true && discountAmount == $discountAmount][0] {
        "featuredProducts": featuredProducts[]-> {
          _id,
          name,
          price,
          image
        }
      }
    `);

  return sanityFetch({
    query,
    params: { discountAmount },
  });
};
