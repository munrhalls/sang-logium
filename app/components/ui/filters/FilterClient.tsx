"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import FilterItem from "./FilterItem";
import parseFilterValue from "./helpers/parseFilterValue";

export default function FiltersClient({ initialFilters, currentFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!Array.isArray(initialFilters) || initialFilters.length === 0) {
    return <div className="filters">No filters available</div>;
  }

  function handleFilterChange(name, value, type) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(name);
    } else if (type === "multiselect") {
      params.set(name, JSON.stringify(value));
    } else {
      params.set(name, String(value));
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    // Form is already submitted programmatically when filters change
    // This prevents default form submission when Enter is pressed
  }

  function handleReset() {
    router.push(pathname, { scroll: false });
  }

  return (
    <div className="filters p-4">
      <h3 className="text-lg font-bold mb-4">Filters</h3>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {initialFilters.map((filter, index) => {
          if (!filter || !filter.name || !filter.type) return null;

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

        {initialFilters.length > 0 && (
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
