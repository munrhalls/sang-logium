export default function normalizeFilters(
  filters: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    const normalizedKey = key.toLowerCase();
    result[normalizedKey] = value;
  });

  return result;
}
