"use server";
import { sanityFetch } from "@/sanity/lib/live";
// import buildGroqQuery from "@/sanity/lib/products/filter/buildGroqQuery";

export async function getFilteredProductsByCategoryAction(
  categoryPathOrParams
) {
  const categoryPath =
    typeof categoryPathOrParams === "string"
      ? categoryPathOrParams
      : categoryPathOrParams.get("category") || categoryPathOrParams.category;

  const searchParams =
    typeof categoryPathOrParams === "string"
      ? new URLSearchParams()
      : categoryPathOrParams;

  // Convert search params to filter objects
  const selectedFilters = [];

  if (searchParams.has("priceRange")) {
    selectedFilters.push({
      field: "price",
      operator: "<=",
      value: parseInt(searchParams.get("priceRange"), 10),
    });
  }

  if (searchParams.has("brand")) {
    try {
      const brands = JSON.parse(searchParams.get("brand"));
      selectedFilters.push({
        field: "brand",
        operator: "in",
        value: brands,
      });
    } catch {
      selectedFilters.push({
        field: "brand",
        operator: "==",
        value: searchParams.get("brand"),
      });
    }
  }

  if (searchParams.has("inStock") && searchParams.get("inStock") === "true") {
    selectedFilters.push({
      field: "stock",
      operator: ">",
      value: 0,
    });
  }

  if (searchParams.has("design")) {
    selectedFilters.push({
      field: "specifications[].value",
      operator: "in",
      value: searchParams.get("design"),
    });
  }

  if (searchParams.has("connection")) {
    selectedFilters.push({
      field: "specifications[].value",
      operator: "in",
      value: searchParams.get("connection"),
    });
  }

  // Build the query
  const query = buildGroqQuery(categoryPath, selectedFilters);

  try {
    const products = await sanityFetch({
      query,
      params: {}, // No params needed with direct value injection
    });
    return products.data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}
