export default function normalizeFilters(
  filters: Record<string, string | number | boolean | string[]>,
): Record<string, string | number | boolean | string[]> {
  const result: Record<string, string | number | boolean | string[]> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (key === "in stock") key = "stock";
    const normalizedKey = key.toLowerCase();
    result[normalizedKey] = value;
  });
  return result;
}
