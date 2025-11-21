"use server";
import { getFiltersForCategoryPath } from "@/sanity/lib/products/filter/getFiltersForCategoryPath";
import { getSortablesForCategoryPath } from "@/sanity/lib/products/sort/getSortablesForCategoryPath";

export async function getFiltersForCategoryPathAction(path: string[]) {
  try {
    const filters = await getFiltersForCategoryPath(path);
    return filters;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getSortablesForCategoryPathAction(path: string) {
  try {
    const sortables = await getSortablesForCategoryPath(path);
    return sortables;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
