"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import { getFiltersForCategoryPathAction } from "@/app/actions/getFiltersForCategoryPathAction";
import PriceRangeFilter from "./PriceRangeFilter";
import FilterGroup from "./FilterGroup";
import FiltersSkeleton from "./FiltersSkeleton";
import parseParamsToFilters from "@/lib/parseParamsToFilters";
import useSWR from "swr";
import { useSWRConfig } from "swr";

export default function Filters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsedFilters = parseParamsToFilters(searchParams);
  const { mutate } = useSWRConfig();

  const { data: availableFilters, isLoading } = useSWR(
    ["filters", pathname],
    () => getFiltersForCategoryPathAction(pathname),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
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
      },
    }
  );

  const updateUrlParams = useCallback(
    (filterName, value) => {
      const updateParams = () => {
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

        setTimeout(() => {
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, 0);
      };

      mutate(["filters", pathname], updateParams, {
        optimisticData: (currentData) => {
          return currentData;
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: false,
      });
    },
    [pathname, router, searchParams, mutate]
  );

  if (isLoading) return <FiltersSkeleton />;
  if (!availableFilters?.length) return <p>No filters available</p>;

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
