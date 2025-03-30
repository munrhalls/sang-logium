"use server";

import { getFiltersForCategoryPath } from "@/sanity/lib/products/filter/getFiltersForCategoryPath";

export async function getFiltersForCategoryPathAction(path: string[]) {
  try {
    const filters = await getFiltersForCategoryPath(path);
    return filters;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
