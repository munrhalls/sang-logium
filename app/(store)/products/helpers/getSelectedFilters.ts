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

export default function getSelectedFilters(searchParamsInput: {
  [key: string]: string | string[];
}): [FilterItem[], FilterItem[], FilterItem[], { [key: string]: boolean }] {
  const regularFilters: FilterItem[] = [];
  const overviewFilters: FilterItem[] = [];
  const specificationsFilters: FilterItem[] = [];

  // Process regular filters first
  for (const field in searchParamsInput) {
    const value = searchParamsInput[field];
    if (!value) continue;

    // Skip min/max suffix fields, they'll be handled with their base field
    if (field.endsWith('_min') || field.endsWith('_max')) continue;

    const normalizedField = field.toLowerCase();

    // Handle overview filters
    if (overviewFiltersMap[normalizedField]) {
      // Handle arrays of values
      const parsedValue = parseFilterValue(value);
      overviewFilters.push({ 
        field: normalizedField, 
        value: parsedValue,
        filterType: 'overview'
      });
      continue;
    }

    // Handle specification filters
    if (specificationsFiltersMap[normalizedField]) {
      const parsedValue = parseFilterValue(value);
      specificationsFilters.push({ 
        field: normalizedField, 
        value: parsedValue,
        filterType: 'specification'
      });
      continue;
    }

    // Handle range filters
    if (rangeFiltersMap[normalizedField]) {
      // For range filters, check for _min and _max suffixes
      const minValue = searchParamsInput[`${normalizedField}_min`];
      const maxValue = searchParamsInput[`${normalizedField}_max`];

      const rangeValue: { min?: number; max?: number } = {};
      
      if (minValue) {
        rangeValue.min = parseInt(minValue as string, 10);
      }
      
      if (maxValue) {
        rangeValue.max = parseInt(maxValue as string, 10);
      }

      // Only add if we have at least one bound
      if (rangeValue.min !== undefined || rangeValue.max !== undefined) {
        regularFilters.push({ 
          field: normalizedField, 
          value: rangeValue,
          filterType: 'range'
        });
      }
      continue;
    }
    
    // Specifically check for _min and _max suffixes to handle range filter parts
    if (normalizedField.endsWith('_min') || normalizedField.endsWith('_max')) {
      const baseField = normalizedField.split('_')[0];
      
      // Skip if we don't know this is a range filter
      if (!rangeFiltersMap[baseField]) continue;
      
      // Already handled through the base field
      continue;
    }

    // Handle regular filters
    if (regularFiltersMap[normalizedField]) {
      const parsedValue = parseFilterValue(value);
      regularFilters.push({ 
        field: normalizedField, 
        value: parsedValue,
        filterType: 'regular'
      });
      continue;
    }

    // If we got here and it's not a special field, add it as a regular filter
    if (!normalizedField.includes('sort') && !normalizedField.includes('dir')) {
      regularFilters.push({ 
        field: normalizedField, 
        value: parseFilterValue(value),
        filterType: 'regular'
      });
    }
  }

  return [regularFilters, overviewFilters, specificationsFilters, rangeFiltersMap];
}

// Helper function to parse filter values
function parseFilterValue(value: string | string[]): FilterValue {
  if (Array.isArray(value)) {
    return value;
  }

  // Try to parse as JSON (for multiselect filters)
  try {
    return JSON.parse(value);
  } catch (e) {
    // Not JSON, return as is
    return value;
  }
}
