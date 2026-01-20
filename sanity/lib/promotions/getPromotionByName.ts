import { defineQuery } from "next-sanity";
import { client } from "../client";

export const getPromotionByName = async (name: string) => {
  const PROMOTION_BY_NAME_QUERY = defineQuery(`
    *[_type == "promotion" && internalTitle == $name][0]  {
      _id,
      headline[] { text, highlighted, color },
      description[] { text, highlighted, color },
      actionLabel[] { text, highlighted, color },
      discountPercent[] { text, highlighted, color },
      "image": {
        "src": visual.asset->url,
        "alt": visual.alt,
        "width": visual.asset->metadata.dimensions.width,
        "height": visual.asset->metadata.dimensions.height,
        "blurDataURL": visual.asset->metadata.lqip
      }
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
