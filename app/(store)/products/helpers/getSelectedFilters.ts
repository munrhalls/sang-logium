interface FiltersMap {
  [key: string]: boolean;
}

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
const regularFiltersMap: FiltersMap = {
  brand: true,
  color: true,
  size: true,
  type: true,
};

const rangeFiltersMap: FiltersMap = {
  price: true,
  stock: true,
};

type FilterValue = string | string[] | { min?: number; max?: number };

interface FilterItem {
  field: string;
  value: FilterValue;
  filterType?: string;
}

interface RangeFilterItem {
  field: string;
  operator: string;
  value: FilterValue;
  filterType: "range";
}

export default function getSelectedFilters(searchParamsInput: {
  [key: string]: string | string[];
}): [FilterItem[], FilterItem[], FilterItem[], RangeFilterItem[]] {
  const regularFilters: FilterItem[] = [];
  const overviewFilters: FilterItem[] = [];
  const specificationsFilters: FilterItem[] = [];
  const rangeFilters: RangeFilterItem[] = [];

  for (const field in searchParamsInput) {
    const value = searchParamsInput[field];
    if (!value) continue;

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

    const lowercaseRangeField = lowercaseField.split("_")[0];

    if (rangeFiltersMap[lowercaseRangeField]) {
      console.log("lowercaseRangeField", lowercaseRangeField);
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
          `Invalid range filter: ${lowercaseField} with operator ${operator}`
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
