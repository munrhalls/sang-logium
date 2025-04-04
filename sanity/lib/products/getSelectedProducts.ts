import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getSelectedProducts = async (path, selectedFilters) => {
  console.log(selectedFilters, "selectedFilters");
  console.log("path", path);

  const [regular, overview, specifications, rangeFilters] = selectedFilters;
  const regularQuery =
    regular.length > 0
      ? regular
          .map((item) => {
            // Handle different value types
            let values = [];
            if (typeof item.value === 'string') {
              try {
                // Try to parse as JSON
                values = JSON.parse(item.value);
                // If the parsed result is not an array, make it one
                values = Array.isArray(values) ? values : [values];
              } catch (e) {
                // If parsing fails, use the string value as is
                values = [item.value];
              }
            } else if (Array.isArray(item.value)) {
              values = item.value;
            } else if (typeof item.value === 'object' && item.value !== null) {
              // Handle range objects
              if (item.field === 'price' || item.field === 'stock') {
                const { min, max } = item.value;
                let conditions = [];
                if (min !== undefined) conditions.push(`${item.field} >= ${min}`);
                if (max !== undefined) conditions.push(`${item.field} <= ${max}`);
                return conditions.length > 0 ? `(${conditions.join(" && ")})` : "";
              }
              return "";
            } else {
              values = [item.value];
            }
            
            return `(${values.map((value) => `${item.field} == "${value}"`).join(" || ")})`;
          })
          .filter(query => query !== "") // Remove any empty queries
          .join(" && ")
      : "";
  console.log(regularQuery, "regularQuery");
  const overviewQuery =
    overview.length > 0
      ? overview
          .map((item) => {
            // Handle different value types
            let values = [];
            if (typeof item.value === 'string') {
              try {
                // Try to parse as JSON
                values = JSON.parse(item.value);
                // If the parsed result is not an array, make it one
                values = Array.isArray(values) ? values : [values];
              } catch (e) {
                // If parsing fails, use the string value as is
                values = [item.value];
              }
            } else if (Array.isArray(item.value)) {
              values = item.value;
            } else {
              values = [item.value];
            }
            
            return `(${values
              .map(
                (value) => `count(overviewFields[value match "${value}"]) > 0` // Check any field that has this value
              )
              .join(" || ")})`; // Join conditions with OR
          })
          .join(" && ") // Combine all conditions with AND
      : "";

  const specificationsQuery =
    specifications.length > 0
      ? specifications
          .map((item) => {
            // Handle different value types
            let values = [];
            if (typeof item.value === 'string') {
              try {
                // Try to parse as JSON
                values = JSON.parse(item.value);
                // If the parsed result is not an array, make it one
                values = Array.isArray(values) ? values : [values];
              } catch (e) {
                // If parsing fails, use the string value as is
                values = [item.value];
              }
            } else if (Array.isArray(item.value)) {
              values = item.value;
            } else {
              values = [item.value];
            }
            
            return `(${values
              .map(
                (value) => `count(specifications[value match "${value}"]) > 0` // Check any field that has this value
              )
              .join(" || ")})`; // Join conditions with OR
          })
          .join(" && ") // Combine all conditions with AND
      : "";

  // We don't need rangeQuery because range filters are now handled in regularQuery
  const rangeQuery = "";

  let assembledQuery = `*[_type == "product"`;

  const pathString = path.join("/");
  const pathQuery = ` && (categoryPath == "${pathString}" || categoryPath match "${pathString}/*")`;
  assembledQuery += pathQuery;
  // Combine all filters
  const allFilters = [
    regularQuery,
    overviewQuery,
    specificationsQuery,
    rangeQuery,
  ]
    .filter((query) => query !== "")
    .join(" && ");

  if (allFilters) {
    assembledQuery += ` && (${allFilters})`;
  }

  assembledQuery += `] | order(name asc)`;
  console.log(assembledQuery, "assembledQuery");

  const GET_PRODUCTS_BY_QUERY = defineQuery(assembledQuery);

  try {
    const products = await sanityFetch({
      query: GET_PRODUCTS_BY_QUERY,
    });
    return products.data || [];
  } catch (err) {
    console.error("Error fetching all products: ", err);
    return [];
  }
};
