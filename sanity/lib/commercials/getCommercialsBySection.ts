import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getCommercialsBySection = async (section: string) => {
  const GET_COMMERCIALS_BY_SECTION_QUERY =
    defineQuery(`*[_type == "commercial" && section == $section] {
    title,
    "image": image.asset->url,
    text,
    sale->,
     "products": products[]-> {
      title,
      price,
      "image": image.asset->url,
      slug
    }
   }`);

  try {
    const commercials = await sanityFetch({
      query: GET_COMMERCIALS_BY_SECTION_QUERY,
      params: { section },
    });

    return commercials.data || [];
  } catch (err) {
    console.error("Error fetching commercials by section: ", err);
    return [];
  }
};
