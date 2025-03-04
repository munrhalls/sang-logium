"use server";

import { getSortablesForCategoryPath } from "@/sanity/lib/products/sort/getSortablesForCategoryPath";
import parseUrlToCategoryPath from "@/lib/parseUrlToCategoryPath";
export async function getSortablesForCategoryPathAction(path) {
  try {
    const parsedPath = parseUrlToCategoryPath(path);
    console.log(parsedPath, "parsedPath");
    const sortables = await getSortablesForCategoryPath(parsedPath);

    return sortables;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
