"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterItem from "./FilterItem";
import parseFilterValue from "./helpers/parseFilterValue";
import normalizeFilters from "./helpers/normalizeFilters";

export default function Filters({ filterOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!Array.isArray(filterOptions) || filterOptions.length === 0) {
    return <div className="filters">No filters available</div>;
  }

  function handleFilterChange(name, value, type) {
    const params = new URLSearchParams(searchParams.toString());

    if (type === "checkbox" && value === false) {
      params.delete(name);
    } else if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(name);
    } else if (type === "multiselect") {
      // Ensure value is an array before stringifying
      const valueToStore = Array.isArray(value) ? value : [value];
      params.set(name, JSON.stringify(valueToStore));
    } else if (type === "range") {
      // For range type, expect value to be an object with min and max properties
      if (value.min !== undefined) {
        console.log("name", name);
        params.set(`${name}_min`, String(value.min));
      } else {
        params.delete(`${name}_min`);
      }

      console.log("RANGE", name, value, type);
      if (value.max !== undefined) {
        params.set(`${name}_max`, String(value.max));
      } else {
        params.delete(`${name}_max`);
      }

      params.delete(name);
    } else {
      console.log("checkbox", name, value);
      params.set(name, String(value).toLowerCase().trim());
    }

    const filterObj = Object.fromEntries(params.entries());
    const normalized = normalizeFilters(filterObj);

    const normalizedParams = new URLSearchParams();
    Object.entries(normalized).forEach(([key, val]) => {
      normalizedParams.set(key, String(val));
    });

    router.push(`${pathname}?${normalizedParams.toString()}`, {
      scroll: false,
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
  }

  function handleReset() {
    router.push(pathname, { scroll: false });
  }

  return (
    <div className="filters p-4">
      <h3 className="text-lg font-bold mb-4">Filters</h3>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {filterOptions.map((filter, index) => {
          if (!filter || !filter.name || !filter.type) return null;
          const normalizedName = filter.name.toLowerCase();
          const paramValue = searchParams.get(normalizedName);
          const currentValue = parseFilterValue(paramValue, filter.type);
          return (
            <FilterItem
              key={`${filter.name}-${index}`}
              filter={filter}
              value={currentValue}
              onChange={(value) =>
                handleFilterChange(normalizedName, value, filter.type)
              }
            />
          );
        })}

        {filterOptions.length > 0 && (
          <div className="mt-4">
            <button
              type="reset"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              Clear All
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
