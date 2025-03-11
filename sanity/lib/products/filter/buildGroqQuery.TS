export default function buildGroqQuery(categoryPath, selectedFilters) {
  // Base query with category path
  let query = `*[_type == "product" && categories[].path == "${categoryPath}"]`;

  // Add filter conditions
  if (selectedFilters.length > 0) {
    const filterConditions = selectedFilters
      .map((filter) => `${filter.field} ${filter.operator} "${filter.value}"`)
      .join(" && ");

    query += ` && (${filterConditions})`;
  }

  return query;
}
