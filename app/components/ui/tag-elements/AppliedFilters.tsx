"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { X, ArrowDown, ArrowUp } from "lucide-react";

export default function AppliedFilters({ filterOptions = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Update search params

  const updateSearchParams = (key, value = null) => {
    const current = new URLSearchParams(searchParams.toString());

    // Handle range filter special case
    if (key.includes("_min") || key.includes("_max")) {
      current.delete(key);
    } else if (key.includes("price") || key.includes("stock")) {
      // For range filters, delete both min and max
      const baseKey = key.split("_")[0];
      current.delete(`${baseKey}_min`);
      current.delete(`${baseKey}_max`);
    } else if (value === null) {
      current.delete(key);
    } else {
      current.set(key, value);
    }

    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    const current = new URLSearchParams(searchParams.toString());
    const currentSort = current.get("sort");
    const currentDir = current.get("dir") || "asc";

    if (currentSort) {
      current.set("dir", currentDir === "asc" ? "desc" : "asc");
      router.replace(`${pathname}?${current.toString()}`, { scroll: false });
    }
  };

  // Get filter display names from filter options
  const getFilterDisplayName = (key) => {
    // First normalize the key (it might have _min or _max suffix)
    const baseKey = key.includes("_") ? key.split("_")[0] : key;

    // Find the filter option with this name
    const filter = filterOptions.find(
      (opt) => opt.name && opt.name.toLowerCase() === baseKey.toLowerCase()
    );

    if (filter) {
      return filter.name;
    }

    // Otherwise humanize the key
    return baseKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .replace(/_/g, " ");
  };

  // Format filter value for display
  const formatFilterValue = (key, value) => {
    if (key === "price") {
      return `${value}`;
    }

    if (key.includes("_min")) {
      return `Min: ${key.includes("price") ? "$" : ""}${value}`;
    }

    if (key.includes("_max")) {
      return `Max: ${key.includes("price") ? "$" : ""}${value}`;
    }

    // Try to parse JSON for arrays
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }
      return String(parsed);
    } catch {
      // If parsing fails, return the value as-is
      return String(value);
    }
  };

  // Get all active filters from search params
  const activeFilters = Array.from(searchParams.entries())
    .filter(([key]) => !key.includes("page")) // Exclude pagination params
    .reduce(
      (acc, [key, value]) => {
        if (!value) return acc;

        // Handle sort separately
        if (key === "sort" || key === "dir") {
          if (key === "sort") {
            acc.sort = { name: value, dir: searchParams.get("dir") || "asc" };
          }
          return acc;
        }

        acc.filters.push({ key, value });
        return acc;
      },
      { filters: [], sort: null }
    );

  if (activeFilters.filters.length === 0 && !activeFilters.sort) {
    return null;
  }

  const formatActiveSortName = (name) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .replace(/_/g, " ");
  };

  return (
    <div className="py-3 px-4">
      {/* <h3 className="text-sm font-medium mb-2 text-gray-700">Active Filters</h3> */}
      <div className="flex flex-wrap gap-2">
        {activeFilters.filters.map(({ key, value }) => (
          <div
            key={key}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
          >
            <span className="font-medium mr-1">
              {getFilterDisplayName(key)}:
            </span>
            <span className="text-gray-700">
              {formatFilterValue(key, value)}
            </span>
            <button
              onClick={() => updateSearchParams(key)}
              className="ml-2 text-gray-500 hover:text-gray-800"
              aria-label={`Remove ${key} filter`}
            >
              <X size={18} />
            </button>
          </div>
        ))}

        {activeFilters.sort && (
          <div className="flex items-center bg-blue-100 rounded-full px-5 py-1 text-sm md:text-lg">
            <span className="font-medium mr-1">Sort:</span>
            <span className="text-gray-700">
              {formatActiveSortName(activeFilters.sort.name)}
            </span>
            <button
              onClick={toggleSortDirection}
              className="mx-2 md:mx-3 text-blue-600 hover:text-orange-500"
              aria-label="Toggle sort direction"
            >
              {activeFilters.sort.dir === "asc" ? (
                <ArrowUp size={18} />
              ) : (
                <ArrowDown size={18} />
              )}
            </button>
            <button
              onClick={() => {
                updateSearchParams("sort");
                updateSearchParams("dir");
              }}
              className="ml-1 text-gray-500 hover:text-gray-800"
              aria-label="Remove sort"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {(activeFilters.filters.length > 0 || activeFilters.sort) && (
          <button
            onClick={() => {
              const current = new URLSearchParams();
              router.replace(`${pathname}?${current.toString()}`, {
                scroll: false,
              });
            }}
            className="px-3 text-sm border rounded-full text-blue-600 hover:text-white hover:bg-blue-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
