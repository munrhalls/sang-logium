"use server";
import { getSortablesForCategoryPath } from "@/sanity/lib/products/sort/getSortablesForCategoryPath";
export async function getSortablesForCategoryPathAction(path: string) {
  try {
    const sortables = await getSortablesForCategoryPath(path);
    return sortables;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
