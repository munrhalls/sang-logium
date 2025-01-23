import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const GET_COMMERCIALS_BY_FEATURE_QUERY =
  defineQuery(`*[_type == "commercial" && feature == $feature] {
    _id,
  title,
  "image": image.asset->url,
  variant,
  displayOrder,
  text,
  "products": products[]-> {
    _id,
    name,
    price,
    "image": image.asset->url,
  },
  sale-> {
    discount,
    _id
  }
}`);

export const getCommercialsByFeature = async (feature: string) => {
  try {
    const commercials = await sanityFetch({
      query: GET_COMMERCIALS_BY_FEATURE_QUERY,
      params: { feature },
    });

    return commercials.data || [];
  } catch (err) {
    console.error("Error fetching commercials by feature: ", err);
    return [];
  }
};
