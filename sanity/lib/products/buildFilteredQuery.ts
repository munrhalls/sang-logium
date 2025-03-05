// /sanity/lib/products/buildFilteredQuery.ts

import groq from "groq";
import { FilterConfig } from "../url/parseUrlToFilterConfig";

/**
 * Builds a GROQ query based on the provided filter configuration
 */
export function buildFilteredQuery(config: FilterConfig): string {
  // Base query
  let query = groq`*[_type == "product"`;

  // Build filter conditions
  const conditions: string[] = [];

  // Category filter
  if (config.categories && config.categories.length > 0) {
    const categoryFilter = `categories[]->slug.current in [${config.categories.map((c) => `"${c}"`).join(", ")}]`;
    conditions.push(categoryFilter);
  }

  // Price filter
  if (config.price) {
    if (config.price.min !== undefined) {
      conditions.push(`price >= ${config.price.min}`);
    }
    if (config.price.max !== undefined) {
      conditions.push(`price <= ${config.price.max}`);
    }
  }

  // Color filter
  if (config.colors && config.colors.length > 0) {
    const colorFilter = `"${config.colors.join('", "')}" match variants[].color`;
    conditions.push(colorFilter);
  }

  // Size filter
  if (config.sizes && config.sizes.length > 0) {
    const sizeFilter = `"${config.sizes.join('", "')}" match variants[].size`;
    conditions.push(sizeFilter);
  }

  // Add conditions to query
  if (conditions.length > 0) {
    query += ` && ${conditions.join(" && ")}`;
  }

  // Close the initial filter bracket
  query += `]`;

  // Add sorting
  if (config.sort) {
    const { field, direction } = config.sort;
    const safeField = sanitizeGroqField(field);
    query += ` | order(${safeField} ${direction})`;
  } else {
    // Default sorting
    query += ` | order(_createdAt desc)`;
  }

  // Add pagination
  const limit = config.limit || 12;
  const page = config.page || 1;
  const offset = (page - 1) * limit;

  query += `[${offset}...${offset + limit}]`;

  // Add projection
  query += ` {
    _id,
    _createdAt,
    name,
    "slug": slug.current,
    price,
    "mainImage": mainImage.asset->url,
    "categories": categories[]->{
      _id,
      name,
      "slug": slug.current
    },
    variants
  }`;

  return query;
}

/**
 * Sanitizes a field name for use in a GROQ query
 */
function sanitizeGroqField(field: string): string {
  // List of allowed sort fields
  const allowedFields = ["name", "price", "_createdAt", "title"];
  const normalizedField = field.toLowerCase();

  // Default to _createdAt if field is not allowed
  return allowedFields.includes(normalizedField)
    ? normalizedField
    : "_createdAt";
}
