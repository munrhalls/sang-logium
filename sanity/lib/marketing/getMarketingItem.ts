import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getMarketingItem = async (name: string) => {
  const GET_MARKETING_ITEM_QUERY = defineQuery(`*[_type == "marketingItem"] {
    slides[] {
      "backgroundImage": backgroundImage.asset->url,
      content[] {
        ...select(
          _type == 'reference' && @->_type == "product" => { "product": @->{name, price, image} },
          _type == 'reference' && @->_type == "sale" => { "sale": @->{discountAmount} }
        )
      }
    }
  }`);

  try {
    const marketingItem = await sanityFetch({
      query: GET_MARKETING_ITEM_QUERY,
      params: { name },
    });

    return marketingItem.data || [];
  } catch (err) {
    console.error("Error fetching marketing item: ", err);
    return [];
  }
};
