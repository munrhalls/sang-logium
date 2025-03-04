"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useRef } from "react";
import { getFiltersForCategoryPathAction } from "@/app/actions/getFiltersForCategoryPathAction";
import PriceRangeFilter from "./PriceRangeFilter";
import FilterGroup from "./FilterGroup";

function FiltersSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div key={item}>
          <div className="h-5 w-24 bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((option) => (
              <div
                key={option}
                className="h-4 w-full bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function parseParams(searchParams) {
  const parsedFilters = {};

  for (const [key, value] of searchParams.entries()) {
    try {
      if (
        (value.startsWith("[") && value.endsWith("]")) ||
        (value.startsWith("{") && value.endsWith("}"))
      ) {
        parsedFilters[key] = JSON.parse(value);
      } else if (!isNaN(Number(value))) {
        parsedFilters[key] = Number(value);
      } else if (value === "true" || value === "false") {
        parsedFilters[key] = value === "true";
      } else {
        parsedFilters[key] = value;
      }
    } catch (e) {
      parsedFilters[key] = value;
    }
  }

  return parsedFilters;
}

export default function FilterManager() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const parsedFilters = parseParams(searchParams);

  const [availableFilters, setAvailableFilters] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadedRef = useRef(false);

  if (!loadedRef.current) {
    loadedRef.current = true;

    getFiltersForCategoryPathAction(pathname)
      .then((data) => {
        setAvailableFilters(data || []);

        const defaultValues = {};
        let needsUpdate = false;

        (data || []).forEach((filter) => {
          if (parsedFilters[filter.name] === undefined && filter.defaultValue) {
            defaultValues[filter.name] = filter.defaultValue;
            needsUpdate = true;
          }
        });

        if (needsUpdate) {
          const newParams = new URLSearchParams(searchParams);

          Object.entries(defaultValues).forEach(([key, value]) => {
            if (typeof value === "object") {
              newParams.set(key, JSON.stringify(value));
            } else {
              newParams.set(key, String(value));
            }
          });

          router.replace(`${pathname}?${newParams.toString()}`, {
            scroll: false,
          });
        }
      })
      .catch((err) => console.error("Error fetching filters:", err))
      .finally(() => setIsInitialLoading(false));
  }

  const updateUrlParams = useCallback(
    (filterName, value) => {
      setIsUpdating(true);

      const params = new URLSearchParams(searchParams);

      if (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.values(value).every((v) => !v))
      ) {
        params.delete(filterName);
      } else if (typeof value === "object") {
        params.set(filterName, JSON.stringify(value));
      } else {
        params.set(filterName, String(value));
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      setTimeout(() => setIsUpdating(false), 500);
    },
    [pathname, router, searchParams]
  );

  if (isInitialLoading) return <FiltersSkeleton />;
  if (!availableFilters.length) return <p>No filters available</p>;

  return (
    <div className="space-y-6 relative">
      <PriceRangeFilter
        value={parsedFilters.price || { min: undefined, max: undefined }}
        onChange={(value) => updateUrlParams("price", value)}
      />

      {availableFilters.map((filter) => (
        <FilterGroup
          key={filter.name}
          filter={filter}
          value={parsedFilters[filter.name]}
          onChange={(value) => updateUrlParams(filter.name, value)}
        />
      ))}
    </div>
  );
}
