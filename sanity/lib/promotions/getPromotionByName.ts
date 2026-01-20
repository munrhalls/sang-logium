import { defineQuery } from "next-sanity";
import { client } from "../client";

export const getPromotionByName = async (name: string) => {
  const PROMOTION_BY_NAME_QUERY = defineQuery(`
    *[_type == "promotion" && internalTitle == $name][0] {
      "src": visual.asset->url,
      headline,
      description,
      discountPercent,
      actionLabel,
    }
  `);

  try {
    const promotion = await client.fetch(PROMOTION_BY_NAME_QUERY, { name });
    return promotion || null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
