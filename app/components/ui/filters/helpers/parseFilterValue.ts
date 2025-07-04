export default function parseFilterValue(
  paramValue: string | number | boolean | null | undefined,
  filterType: string,
) {
  if (paramValue === null || paramValue === undefined) {
    if (filterType === "multiselect") return [];
    if (filterType === "checkbox" || filterType === "boolean") return false;
    if (filterType === "range") return { min: undefined, max: undefined };
    if (filterType === "radio") return null;
    return null;
  }

  try {
    switch (filterType) {
      case "range":
        return { min: undefined, max: undefined };
      case "multiselect":
        try {
          return (
            JSON.parse(
              typeof paramValue === "string" ? paramValue : String(paramValue),
            ) || []
          );
        } catch {
          return [paramValue];
        }
      case "checkbox":
      case "boolean":
        return paramValue === "true" || paramValue === true;
      case "radio":
        return paramValue;
      default:
        return paramValue;
    }
  } catch (error) {
    console.error(`Error parsing ${filterType} value:`, error);
    if (filterType === "multiselect") return [];
    if (filterType === "range") return { min: undefined, max: undefined };
    if (filterType === "checkbox" || filterType === "boolean") return false;
    if (filterType === "radio") return null;
    return null;
  }
}
