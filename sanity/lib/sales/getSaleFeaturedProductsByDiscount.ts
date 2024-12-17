import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getHeroProductsByDiscount = async (discountPercentage: number) => {
  const query = defineQuery(`
      *[_type == "sale" && isActive == true && discountPercentage == $discountPercentage][0] {
        "heroProducts": featuredProducts[]-> {
          _id,
          name,
          price,
          "salePrice": price * (1 - ^.discountPercentage/100)
        }
      }
    `);

  return sanityFetch({
    query,
    params: { discountPercentage },
  });
};
