export default function parseFilterValue(paramValue, filterType) {
  if (paramValue === null || paramValue === undefined) {
    // Return appropriate defaults based on filter type
    if (filterType === "multiselect") return [];
    if (filterType === "checkbox" || filterType === "boolean") return false;
    if (filterType === "range") return { min: undefined, max: undefined };
    if (filterType === "radio") return null;
    return null;
  }

  try {
    switch (filterType) {
      case "range":
        // Handle special case for range which might be structured as multiple URL params
        // The actual values are retrieved directly in FilterItem component
        // using separate _min and _max URL parameters
        return { min: undefined, max: undefined };
      case "multiselect":
        try {
          return JSON.parse(paramValue) || [];
        } catch {
          // If it's not a JSON array, treat as a single value
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
