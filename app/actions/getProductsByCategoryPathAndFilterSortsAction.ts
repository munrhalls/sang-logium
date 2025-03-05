"use server";

import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

export async function getProductsByCategoryPathAndFilterSortsAction(
  formData: FormData
) {
  const categoryPath = formData.get("categoryPath") as string;

  let queryString = `*[_type == "product" && "${categoryPath}" in categoryPath[]`;
  const queryParams: Record<string, any> = { categoryPath };

  for (const [key, value] of formData.entries()) {
    if (key === "categoryPath") continue;

    if (key === "priceRange" && value) {
      queryString += ` && price <= $priceRange`;
      queryParams.priceRange = parseInt(value.toString(), 10);
    }

    if (key === "brand" && value) {
      queryString += ` && brand in $brands`;
      try {
        queryParams.brands = JSON.parse(value.toString());
      } catch {
        queryParams.brands = [value.toString()];
      }
    }

    if (key === "inStock" && value === "true") {
      queryString += ` && stock > 0`;
    }
  }

  queryString += `] | order(name asc)`;

  const query = defineQuery(queryString);

  try {
    const products = await sanityFetch({
      query,
      params: queryParams,
    });
    return products.data || [];
  } catch (error) {
    return [];
  }
}
