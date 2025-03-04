"use server";

import { getFiltersForCategoryPath } from "@/sanity/lib/products/filter/getFiltersForCategoryPath";
import parseUrlToCategoryPath from "@/lib/parseUrlToCategoryPath";

export async function getFiltersForCategoryPathAction(path) {
  try {
    const parsedPath = parseUrlToCategoryPath(path);
    console.log(parsedPath, "parsedPath");
    const filters = await getFiltersForCategoryPath(parsedPath);
    return filters;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
