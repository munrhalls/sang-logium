import { defineQuery } from "next-sanity";
import { client } from "../client";

export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = defineQuery(`
          *[
              _type == "category"
          ] | order(name desc)
      `);

  try {
    const categories = await client.fetch(ALL_CATEGORIES_QUERY);
    return categories || [];
  } catch (err) {
    console.error("Error fetching all categories: ", err);
    return [];
  }
};
