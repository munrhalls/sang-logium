"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { getSortablesForCategoryPathAction } from "@/app/actions/getSortablesForCategoryPathAction";
import { useStore } from "@/store";
import SortablesSkeleton from "./SortablesSkeleton";
import useSWR from "swr";
import { useCallback } from "react";
import { ChevronDown, ChevronUp, OptionIcon } from "./CustomIcons";

export default function Sortables() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { toggleProductsSortDrawer } = useStore();

  const currentSortName = searchParams.get("sort") || "";
  const currentSortDir = searchParams.get("dir") || "asc";

  const loadedRef = useRef(false);

  const { data: sortOptions, isLoading } = useSWR(
    ["sortables", pathname],
    () => getSortablesForCategoryPathAction(pathname),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (!currentSortName && data?.length > 0) {
          const defaultSort =
            data.find((option) => option.isDefault) || data[0];

          if (defaultSort) {
            const params = new URLSearchParams(searchParams);
            params.set("sort", defaultSort.name);
            params.set("dir", defaultSort.defaultDirection || "asc");

            // Use setTimeout to ensure this happens outside of React's render cycle
            setTimeout(() => {
              router.push(`${pathname}?${params.toString()}`);
            }, 0);
          }
        }
      },
      onError: (err) => {
        console.error("Error loading sort options:", err);
      },
    }
  );

  const updateSort = useCallback(
    (sortName, direction) => {
      const params = new URLSearchParams(searchParams);

      if (sortName) {
        params.set("sort", sortName);
        params.set("dir", direction || "asc");
      } else {
        params.delete("sort");
        params.delete("dir");
      }

      setTimeout(() => {
        router.push(`${pathname}?${params.toString()}`);
      }, 0);
    },
    [pathname, router, searchParams]
  );

  const handleSortSelect = useCallback(
    (sortName, direction) => {
      updateSort(sortName, direction);

      if (window.innerWidth < 768) {
        toggleProductsSortDrawer();
      }
    },
    [updateSort, toggleProductsSortDrawer]
  );

  const toggleDirection = useCallback(
    (sortName, currentDirection) => {
      const newDirection = currentDirection === "asc" ? "desc" : "asc";
      updateSort(sortName, newDirection);
    },
    [updateSort]
  );

  if (isLoading) return <SortablesSkeleton />;
  if (!sortOptions?.length) return <p>No sort options available</p>;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-800 pb-4">
        <h3 className="text-lg font-medium mb-3">Sort By</h3>
        <div className="space-y-3">
          {sortOptions.map((option) => (
            <div
              key={option.name}
              className="flex items-center justify-between"
            >
              <label className="flex items-center space-x-2 cursor-pointer group">
                <span className="flex-grow text-sm">{option.displayName}</span>
                <div
                  className={`rounded-full relative w-5 h-5 flex items-center justify-center border ${
                    currentSortName === option.name
                      ? "border-blue-500 bg-[rgb(29,78,216)]"
                      : "border-gray-400 hover:border-blue-400"
                  }`}
                  onClick={() =>
                    handleSortSelect(
                      option.name,
                      option.defaultDirection || "asc"
                    )
                  }
                >
                  {currentSortName === option.name && <OptionIcon />}
                </div>
              </label>

              {currentSortName === option.name && (
                <button
                  onClick={() => toggleDirection(option.name, currentSortDir)}
                  className="ml-2 p-1 rounded hover:bg-blue-800"
                  aria-label={`Toggle sort direction: currently ${
                    currentSortDir === "asc" ? "ascending" : "descending"
                  }`}
                >
                  {currentSortDir === "asc" ? <ChevronUp /> : <ChevronDown />}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
