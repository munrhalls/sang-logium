"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FilterItem from "./FilterItem";
import parseFilterValue from "./helpers/parseFilterValue";
import normalizeFilters from "./helpers/normalizeFilters";
import { FilterOptions } from "./FilterTypes";

export default function Filters({ filterOptions }: { filterOptions: FilterOptions[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!Array.isArray(filterOptions) || filterOptions.length === 0) {
    return <div className="filters">No filters available</div>;
  }

  function handleFilterChange(name: string, value: any, type: string) {
    setIsTransitioning(true);
    const params = new URLSearchParams(searchParams.toString());

    if (type === "checkbox" && value === false) {
      params.delete(name);
    } else if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(name);
    } else if (type === "multiselect") {
      const valueToStore = Array.isArray(value) ? value : [value];
      params.set(name, JSON.stringify(valueToStore));
    } else if (type === "range") {
      if (value.min !== undefined) {
        params.set(`${name}_min`, String(value.min));
      } else {
        params.delete(`${name}_min`);
      }

      if (value.max !== undefined && value.max !== null) {
        params.set(`${name}_max`, String(value.max));
      } else {
        params.delete(`${name}_max`);
      }

      params.delete(name);
    } else {
      params.set(name, String(value).toLowerCase().trim());
    }

    // Reset pagination to page 1 whenever filters change
    params.set("page", "1");

    const filterObj = Object.fromEntries(params.entries());
    const normalized = normalizeFilters(filterObj);

    const normalizedParams = new URLSearchParams();
    Object.entries(normalized).forEach(([key, val]) => {
      normalizedParams.set(key, String(val));
    });
    
    // Ensure page=1 is preserved in normalized params
    if (!normalizedParams.has("page")) {
      normalizedParams.set("page", "1");
    }

    router.push(`${pathname}?${normalizedParams.toString()}`, {
      scroll: false,
    });

    setTimeout(() => setIsTransitioning(false), 600);
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  function handleReset() {
    setIsTransitioning(true);
    // Clear all filters and reset to page 1
    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setTimeout(() => setIsTransitioning(false), 600);
  }

  return (
    <div className="filters p-4 relative">
      {isTransitioning && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-md">
          <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
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
