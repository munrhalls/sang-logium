"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import FilterItem from "./FilterItem";
import parseFilterValue from "./helpers/parseFilterValue";

export default function FiltersClient({ initialFilters, currentFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleFilterChange(name, value, type) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === undefined || value === "") {
      params.delete(name);
    } else if (type === "multiselect") {
      params.set(name, JSON.stringify(value));
    } else if (type === "range") {
      params.set(name, String(value));
    } else if (type === "checkbox") {
      params.set(name, String(value));
    } else {
      params.set(name, String(value));
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (!Array.isArray(initialFilters) || initialFilters.length === 0) {
    return <div className="filters">No filters available</div>;
  }

  return (
    <div className="filters p-4">
      <h3 className="text-lg font-bold mb-4">Filters</h3>
      {initialFilters.map((filter, index) => {
        if (!filter || !filter.name || !filter.type) {
          console.error("Invalid filter configuration:", filter);
          return null;
        }

        const paramValue = searchParams.get(filter.name);
        const currentValue = parseFilterValue(paramValue, filter.type);

        return (
          <FilterItem
            key={`${filter.name}-${index}`}
            filter={filter}
            value={currentValue}
            onChange={(value) =>
              handleFilterChange(filter.name, value, filter.type)
            }
          />
        );
      })}
    </div>
  );
}
