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
const regularFiltersMap: FiltersMap = { brand: true, price: true };

export default function getSelectedFilters(searchParamsInput: {
  [key: string]: string | string[];
}) {
  console.log("searchParamsInput \n", searchParamsInput);
  const regularFilters = [];
  const overviewFilters = [];
  const specificationsFilters = [];

  for (const field in searchParamsInput) {
    const value = searchParamsInput[field];
    if (!value) continue;

    if (overviewFiltersMap[field]) {
      overviewFilters.push({ field, value });
    }

    if (specificationsFiltersMap[field]) {
      specificationsFilters.push({ field, value });
    }

    if (regularFiltersMap[field]) {
      regularFilters.push({ field, value });
    }
  }
  return [regularFilters, overviewFilters, specificationsFilters];
}
