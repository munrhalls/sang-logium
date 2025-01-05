import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getCommercialsByFeature = async (feature: string) => {
  const GET_COMMERCIALS_BY_FEATURE_QUERY =
    defineQuery(`*[_type == "commercial" && feature == $feature] {
    title,
    "image": image.asset->url,
    text,
    "discount": sale->discount,
    "products": products[]-> {
      name,
      price,
      "image": image.asset->url,
      "slug": slug.current
    }
   }`);

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
