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

  // Separate overviewField filters and regular filters
  const overviewFieldFilters: string[] = [];
  const regularFilters: FilterObject[] = [];

  filterObjects.forEach((filter) => {
    // Handle "in stock" filter
    if (filter.field.toLowerCase() === "in stock" && filter.value === "true") {
      regularFilters.push({
        field: "stock",
        operator: ">",
        value: 0,
      });
      return;
    }

    // Check if this is a wearing style or cup style filter
    const knownOverviewStyles = [
      "in-ear",
      "on-ear",
      "over-ear",
      "open-back",
      "closed-back",
      "design",
    ];
    const filterValue =
      typeof filter.value === "string" ? filter.value : String(filter.value);
    const filterField = filter.field.toLowerCase();

    if (
      knownOverviewStyles.includes(filterField.toLowerCase()) ||
      knownOverviewStyles.includes(filterValue.toLowerCase())
    ) {
      // Save this value to be handled specially in the GROQ query
      overviewFieldFilters.push(filterValue);
    } else {
      // Regular filter
      regularFilters.push(filter);
    }
  });

  // Start with the base filter condition
  let queryFilters = [
    `_type == 'product'`,
    `(categoryPath match $path + "/*" || categoryPath == $path)`,
  ];

  // Add additional filter conditions for regular filters
  if (regularFilters.length > 0) {
    regularFilters.forEach((filter) => {
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

  // Add overviewField filters if any exist - using simplified, verified GROQ syntax
  if (overviewFieldFilters.length > 0) {
    // Create a condition for each filter value
    const overviewConditions = overviewFieldFilters.map((value) => {
      // Escape any double quotes in the value
      const escapedValue = value.replace(/"/g, '\\"');
      return `count(overviewFields[value match "${escapedValue}"]) > 0`;
    });

    // Join conditions with OR operator
    queryFilters.push(`(${overviewConditions.join(" || ")})`);
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

  // Detailed logging
  if (overviewFieldFilters.length > 0) {
    console.log("Query contains overviewField filters:", overviewFieldFilters);
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
