export default function parseParamsToFilters(searchParams) {
  const parsedFilters = {};

  for (const [key, value] of searchParams.entries()) {
    try {
      if (
        (value.startsWith("[") && value.endsWith("]")) ||
        (value.startsWith("{") && value.endsWith("}"))
      ) {
        parsedFilters[key] = JSON.parse(value);
      } else if (!isNaN(Number(value))) {
        parsedFilters[key] = Number(value);
      } else if (value === "true" || value === "false") {
        parsedFilters[key] = value === "true";
      } else {
        parsedFilters[key] = value;
      }
    } catch (e) {
      parsedFilters[key] = value;
    }
  }

  return parsedFilters;
}
