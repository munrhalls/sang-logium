import {
  FiltersMap,
  displayToRealMap,
  DisplayToRealMapType,
  FilterValue,
  FilterItem,
  RangeFilterItem,
} from "@/app/components/ui/filters/FilterTypes";

const overviewFiltersMap: FiltersMap = {
  design: true,
  connection: true,
  "equipment type": true,
  "speaker type": true,
  connectivity: true,
};
const specificationsFiltersMap: FiltersMap = {
  "driver size": true,
  "driver type": true,
  "frequency response": true,
  impedance: true,
  sensitivity: true,
  weight: true,
};
// Remove 'size' from regular filters to avoid pagination parameter collision
const regularFiltersMap: FiltersMap = {
  brand: true,
  color: true,
  type: true,
};

const rangeFiltersMap: FiltersMap = {
  price: true,
  stock: true,
  "stock amount": true,
};

export default function getSelectedFilters(searchParamsInput: {
  [key: string]: string | string[] | undefined;
}): [FilterItem[], FilterItem[], FilterItem[], RangeFilterItem[]] {
  console.log("searchParamsInput", searchParamsInput);
  const regularFilters: FilterItem[] = [];
  const overviewFilters: FilterItem[] = [];
  const specificationsFilters: FilterItem[] = [];
  const rangeFilters: RangeFilterItem[] = [];

  // Define pagination parameters to exclude from filters
  const paginationParams = ["page", "size", "pageSize"];

  for (const field in searchParamsInput) {
    const value = searchParamsInput[field];
    if (!value) continue;

    // Skip pagination parameters to avoid filter-pagination conflicts
    if (paginationParams.includes(field)) continue;

    const lowercaseField = field.toLowerCase();

    if (overviewFiltersMap[lowercaseField]) {
      const parsedValue = parseFilterValue(value);
      overviewFilters.push({
        field: lowercaseField,
        value: parsedValue,
        filterType: "overview",
      });
      continue;
    }

    if (specificationsFiltersMap[lowercaseField]) {
      const parsedValue = parseFilterValue(value);
      specificationsFilters.push({
        field: lowercaseField,
        value: parsedValue,
        filterType: "specification",
      });
      continue;
    }

    let lowercaseRangeField = lowercaseField.split("_")[0];

    if (rangeFiltersMap[lowercaseRangeField]) {
      if (lowercaseRangeField in displayToRealMap) {
        lowercaseRangeField =
          displayToRealMap[lowercaseRangeField as keyof DisplayToRealMapType];
      }

      const parsedValue = parseFilterValue(value);
      const dir = lowercaseField.split("_")[1];

      const operatorsMap: { [key: string]: string } = {
        min: ">=",
        max: "<=",
      };
      const operator = operatorsMap[dir] || null;
      if (operator && parsedValue) {
        rangeFilters.push({
          field: lowercaseRangeField,
          operator: operator,
          value: parsedValue,
          filterType: "range",
        });
      } else if (lowercaseField === "stock" && value === "true") {
        rangeFilters.push({
          field: lowercaseRangeField,
          operator: ">=",
          value: "1",
          filterType: "range",
        });
      } else {
        console.warn(
          `Invalid range filter: ${lowercaseField} with operator ${operator}`,
        );
      }
      continue;
    }

    if (regularFiltersMap[lowercaseField]) {
      const parsedValue = parseFilterValue(value);
      regularFilters.push({
        field: lowercaseField,
        value: parsedValue,
        filterType: "regular",
      });
      continue;
    }
  }
  console.log("regularFilters", regularFilters);
  console.log("overviewFilters", overviewFilters);
  console.log("specificationsFilters", specificationsFilters);
  console.log("rangeFilters", rangeFilters);
  return [regularFilters, overviewFilters, specificationsFilters, rangeFilters];
}

function parseFilterValue(value: string | string[]): FilterValue {
  if (Array.isArray(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (e) {
    console.error("@getSelectedFilters ", e);
    return value;
  }
}
