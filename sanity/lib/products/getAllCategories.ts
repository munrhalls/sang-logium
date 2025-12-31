import { defineQuery } from "next-sanity";
import { client } from "../client";

export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = defineQuery(`
    *[_type == "category"] | order(order asc, title asc) {
      "id": _id,
      "parentId": parent._ref,
      title,
      "slug": slug.current,
      icon,
      group,
      metadata {
        path
      }
    }
  `);

  try {
    const categories = await client.fetch(ALL_CATEGORIES_QUERY);
    return categories || [];
  } catch (err) {
    console.error("Error fetching all categories: ", err);
    return [];
  }
};
