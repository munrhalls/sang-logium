export default function buildGroqQuery(categoryPath, selectedFilters) {
  let query = `*[_type == "product" && "${categoryPath}" in categories[].path]`;

  if (selectedFilters.length > 0) {
    const filterConditions = selectedFilters
      .map((filter) => {
        // Handle different operator types
        if (filter.operator === "in") {
          // For array-based conditions
          if (Array.isArray(filter.value)) {
            return `${filter.field} in [${filter.value.map((v) => `"${v}"`).join(", ")}]`;
          } else {
            return `"${filter.value}" in ${filter.field}`;
          }
        } else {
          // For standard operators
          return `${filter.field} ${filter.operator} ${
            typeof filter.value === "number"
              ? filter.value
              : `"${filter.value}"`
          }`;
        }
      })
      .join(" && ");

    query += ` && (${filterConditions})`;
  }

  return query + ` | order(name asc)`;
}
