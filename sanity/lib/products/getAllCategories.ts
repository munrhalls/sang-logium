import { defineQuery } from "next-sanity";
import { client } from "../client";

export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = defineQuery(`
    *[_type == "category"]{
    _id,
    title,
    slug,
    order,
    icon,
    metadata,
    parent,
    "parent": parent->{_id}
  }`);

  try {
    const categories = await client.fetch(ALL_CATEGORIES_QUERY);
    return categories || [];
  } catch (err) {
    console.error("Error fetching all categories: ", err);
    return [];
  }
};
