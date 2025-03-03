"use server";

import { getFiltersForCategoryPath } from "@/sanity/lib/products/filter-and-sort/getFiltersForCategoryPath";

export async function getFiltersForCategoryPathAction(path) {
  try {
    const filters = await getFiltersForCategoryPath(path);
    console.log("path: ", path);

    console.log("getFiltersForCategoryPathAction filters: ", filters);
    return filters;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
