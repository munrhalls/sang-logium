import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

interface FilterObject {
  field: string;
  operator: string;
  value: string | number | string[];
}

const getProductsByCategoryPathAndSelectedFiltersAndSorting = async (
  path: string,
  filterObjects: FilterObject[] = [],
  sorting?: { field: string; direction: "asc" | "desc" }
) => {
  // Function to ensure proper GROQ format for filter values
  const formatFilterValue = (value: any): string => {
    // Handle array values
    if (Array.isArray(value)) {
      return `[${value.map((v) => (typeof v === "string" ? `"${v.replace(/"/g, '\\"')}"` : v)).join(", ")}]`;
    }

    // Handle string values that look like JSON arrays
    if (
      typeof value === "string" &&
      value.startsWith("[") &&
      value.endsWith("]")
    ) {
      try {
        // Try to parse as JSON and reformat
        const parsedArray = JSON.parse(value);
        if (Array.isArray(parsedArray)) {
          return formatFilterValue(parsedArray);
        }
      } catch (e) {
        // Not valid JSON, treat as regular string
      }
    }

    // Handle boolean strings
    if (value === "true") return "true";
    if (value === "false") return "false";

    // Handle regular string/number values
    return typeof value === "string"
      ? `"${value.replace(/"/g, '\\"')}"`
      : `${value}`;
  };

  // Function to ensure proper field name format (handle spaces)
  const formatFieldName = (field: string): string => {
    return field.includes(" ") ? `"${field}"` : field;
  };

  // Handle special case for "in stock" filter
  const processedFilters = filterObjects.map((filter) => {
    if (filter.field.toLowerCase() === "in stock" && filter.value === "true") {
      return {
        field: "stock",
        operator: ">",
        value: 0,
      };
    }
    return filter;
  });

  // Start with the base filter condition
  let queryFilters = [
    `_type == 'product'`,
    `(categoryPath match $path + "/*" || categoryPath == $path)`,
  ];

  // Add additional filter conditions
  if (processedFilters && processedFilters.length > 0) {
    processedFilters.forEach((filter) => {
      const fieldName = formatFieldName(filter.field);

      // Always use 'in' operator for arrays
      if (
        filter.operator === "in" ||
        (typeof filter.value === "string" &&
          filter.value.startsWith("[") &&
          filter.value.endsWith("]")) ||
        Array.isArray(filter.value)
      ) {
        // Convert the value to proper array format
        const arrayValue = formatFilterValue(
          typeof filter.value === "string" &&
            filter.value.startsWith("[") &&
            filter.value.endsWith("]")
            ? JSON.parse(filter.value)
            : filter.value
        );

        queryFilters.push(`${fieldName} in ${arrayValue}`);
      } else {
        // Handle regular equality and other operators
        queryFilters.push(
          `${fieldName} ${filter.operator} ${formatFilterValue(filter.value)}`
        );
      }
    });
  }

  // Combine all filters with AND
  const filterQuery = queryFilters.join(" && ");

  // Build base query
  let fullQuery = `*[${filterQuery}]`;

  // Add sorting
  const sortField = sorting?.field ? formatFieldName(sorting.field) : "name";
  const sortDirection = sorting?.direction || "asc";
  fullQuery += ` | order(${sortField} ${sortDirection})`;

  console.log(fullQuery, "fullQuery");

  // Detailed logging to verify "in stock" handling
  const hasInStockFilter = filterObjects.some(
    (f) => f.field.toLowerCase() === "in stock" && f.value === "true"
  );
  if (hasInStockFilter) {
    console.log(
      "Query contains 'in stock' filter, converted to:",
      `Looking for products where stock > 0 in query: ${fullQuery}`
    );
  }

  const PRODUCTS_QUERY = await defineQuery(fullQuery);

  try {
    const products = await sanityFetch({
      query: PRODUCTS_QUERY,
      params: {
        path,
      },
    });
    return products.data || [];
  } catch (err) {
    console.error("Error fetching filtered products: ", err);
    return [];
  }
};

export default getProductsByCategoryPathAndSelectedFiltersAndSorting;
