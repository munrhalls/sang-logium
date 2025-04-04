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
            const values = JSON.parse(item.value);
            return `(${values.map((value) => `${item.field} == "${value}"`).join(" || ")})`;
          })
          .join(" && ")
      : "";
  console.log(regularQuery, "regularQuery");
  const overviewQuery =
    overview.length > 0
      ? overview
          .map((item) => {
            // Ensure values are parsed
            const values = JSON.parse(item.value);
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
            // Ensure values are parsed
            const values = JSON.parse(item.value);
            return `(${values
              .map(
                (value) => `count(specifications[value match "${value}"]) > 0` // Check any field that has this value
              )
              .join(" || ")})`; // Join conditions with OR
          })
          .join(" && ") // Combine all conditions with AND
      : "";

  const rangeQuery =
    rangeFilters.length > 0
      ? rangeFilters
          .map((item) => {
            // Parse the range values and operator
            const { min, max, operator } = JSON.parse(item.value);

            // If operator is provided, use it for direct comparison
            if (operator && operator !== "range") {
              return `${item.field} ${operator} ${min}`;
            }

            // Handle range cases
            if (min !== null && max !== null) {
              return `(${item.field} >= ${min} && ${item.field} <= ${max})`;
            } else if (min !== null) {
              return `${item.field} >= ${min}`;
            } else if (max !== null) {
              return `${item.field} <= ${max}`;
            }
            return "";
          })
          .filter((query) => query !== "") // Remove empty queries
          .join(" && ")
      : "";

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
