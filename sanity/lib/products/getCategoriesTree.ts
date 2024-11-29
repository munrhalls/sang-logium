import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getCategoriesTree = async () => {
  const GET_CATEGORIES_TREE = defineQuery(`
    *[_type == "category"] {
      title,
      slug,
      "subcategories": *[_type == "subcategory" && references(^._id)] {
        title,
        slug
      }
    }
  `);

  try {
    const categoriesTree = await sanityFetch({
      query: GET_CATEGORIES_TREE,
    });
    return categoriesTree.data || [];
  } catch (err) {
    console.error("Error fetching all categories: ", err);
    return [];
  }
};
