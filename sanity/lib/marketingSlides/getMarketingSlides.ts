import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getMarketingSlides = async (name: string) => {
  const GET_MARKETING_SLIDES_BY_NAME_QUERY =
    defineQuery(`*[_type == "marketingSlide"] {
    slides[] {
      backgroundImage,
      content[] {
        _type == 'reference' => @-> {
          _type == "product" => {
            "product": {name, price, image}
          },
          _type == 'sale' => {
            "sale": {discountAmount}
          }
        },
      }
    }
  }`);

  try {
    const marketingSlides = await sanityFetch({
      query: GET_MARKETING_SLIDES_BY_NAME_QUERY,
      params: { name },
    });
    return marketingSlides.data || [];
  } catch (err) {
    console.error("Error fetching all marketing slides: ", err);

    return [];
  }
};
