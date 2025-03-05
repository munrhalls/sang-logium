export default function parseFilterValue(paramValue, filterType) {
  if (paramValue === null || paramValue === undefined) {
    return null;
  }

  try {
    switch (filterType) {
      case "range":
        return parseInt(paramValue, 10) || 0;
      case "multiselect":
        return JSON.parse(paramValue) || [];
      case "checkbox":
        return paramValue === "true" || paramValue === true;
      default:
        return paramValue;
    }
  } catch (error) {
    console.error(`Error parsing ${filterType} value:`, error);
    if (filterType === "multiselect") return [];
    if (filterType === "range") return 0;
    if (filterType === "checkbox") return false;
    return null;
  }
}
