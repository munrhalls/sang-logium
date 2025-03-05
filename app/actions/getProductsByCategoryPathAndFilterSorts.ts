"use server";

import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

export async function getFilteredProductsByCategoryAction(
  categoryPath: string,
  filterParams: Record<string, string>
) {
  // Start with base query
  let queryString = `*[_type == "product" && "${categoryPath}" in categoryPath[]`;
  const queryParams: Record<string, any> = { categoryPath };

  // Add filter conditions based on params
  if (filterParams.priceRange) {
    queryString += ` && price <= $priceRange`;
    queryParams.priceRange = parseInt(filterParams.priceRange, 10);
  }

  if (filterParams.brand) {
    // Handle array of brands from JSON string
    queryString += ` && brand in $brands`;
    queryParams.brands = JSON.parse(filterParams.brand);
  }

  if (filterParams.inStock) {
    queryString += ` && stock > 0`;
  }

  // Close query and add sorting
  queryString += `] | order(name asc)`;

  const query = defineQuery(queryString);

  try {
    const products = await sanityFetch({
      query,
      params: queryParams,
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
}
