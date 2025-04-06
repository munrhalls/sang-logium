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
  value: { min?: number; max?: number };
  filterType: "range";
}

export default function getSelectedFilters(searchParamsInput: {
  [key: string]: string | string[];
}): [FilterItem[], FilterItem[], FilterItem[], RangeFilterItem[]] {
  console.log(searchParamsInput);
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

    if (rangeFiltersMap[lowercaseField]) {
      const parsedValue = parseFilterValue(value);
      console.log("PARSED VALUE ", parsedValue);
      if (typeof parsedValue === "object" && parsedValue !== null) {
        rangeFilters.push({
          field: lowercaseField,
          value: parsedValue,
          filterType: "range",
        });
      } else {
        console.warn(
          `Expected object for range filter ${lowercaseField}, but got ${typeof parsedValue}`
        );
      }
    }
    if (regularFiltersMap[lowercaseField]) {
      console.log("IS IT HERE?", lowercaseField);
      const parsedValue = parseFilterValue(value);
      regularFilters.push({
        field: lowercaseField,
        value: parsedValue,
        filterType: "regular",
      });
      continue;
    }

    if (!lowercaseField.includes("sort") && !lowercaseField.includes("dir")) {
      regularFilters.push({
        field: lowercaseField,
        value: parseFilterValue(value),
        filterType: "regular",
      });
    }
  }

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
