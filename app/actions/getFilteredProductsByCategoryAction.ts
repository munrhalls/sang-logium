"use server";
import { sanityFetch } from "@/sanity/lib/live";
import groq from "groq";

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

  // Use groq template literals for better syntax highlighting and validation
  const query = groq`*[_type == "product" && "${categoryPath}" in categoryPath[]
    ${searchParams.has("priceRange") ? `&& price <= ${parseInt(searchParams.get("priceRange"), 10)}` : ""}
    ${searchParams.has("brand") ? `&& brand in $brands` : ""}
    ${searchParams.has("inStock") && searchParams.get("inStock") === "true" ? `&& stock > 0` : ""}
    ${searchParams.has("design") ? `&& $design in specifications[].value` : ""}
    ${searchParams.has("connection") ? `&& $connection in specifications[].value` : ""}
  ] | order(name asc)`;

  const params = {};
  if (searchParams.has("brand")) {
    try {
      params.brands = JSON.parse(searchParams.get("brand"));
    } catch {
      params.brands = [searchParams.get("brand")];
    }
  }

  if (searchParams.has("design")) params.design = searchParams.get("design");
  if (searchParams.has("connection"))
    params.connection = searchParams.get("connection");
  try {
    const products = await sanityFetch({ query, params });
    return products.data || [];
  } catch {
    return [];
  }
}
