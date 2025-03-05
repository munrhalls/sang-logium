"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import parseFilterValue from "./helpers/parseFilterValue";

export default function FiltersClient({ initialFilters, currentFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle filter change
  function handleFilterChange(name, value) {
    const params = new URLSearchParams(searchParams);

    if (value === null || value === undefined || value === "") {
      params.delete(name);
    } else if (typeof value === "object") {
      params.set(name, JSON.stringify(value));
    } else {
      params.set(name, String(value));
    }

    // Update URL (single source of truth)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="filters">
      <h3>Filters</h3>
      {initialFilters.map((filter) => (
        <FilterItem
          key={filter.name}
          filter={filter}
          value={parseFilterValue(currentFilters[filter.name])}
          onChange={(value) => handleFilterChange(filter.name, value)}
        />
      ))}
    </div>
  );
}

// Simple helper component
function FilterItem({ filter, value, onChange }) {
  // Render appropriate input based on filter type
  if (filter.type === "checkbox") {
    return (
      <div>
        <label>
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
          />
          {filter.label}
        </label>
      </div>
    );
  }
  // Add other filter types as needed
}
