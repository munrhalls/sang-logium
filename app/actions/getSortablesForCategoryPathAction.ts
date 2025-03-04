"use server";

import { getSortablesForCategoryPath } from "@/sanity/lib/products/sort/getSortablesForCategoryPath";

export async function getSortablesForCategoryPathAction(path) {
  try {
    const sortables = await getSortablesForCategoryPath(path);
    console.log("path: ", path);

    console.log("getSortablesForCategoryPathAction sortables: ", sortables);
    console.log("Querying with params:", path);
    // After fetching data
    console.log("Raw sortables response:", sortables);
    return sortables;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
