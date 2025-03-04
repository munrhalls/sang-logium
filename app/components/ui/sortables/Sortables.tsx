"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { getSortablesForCategoryPathAction } from "@/app/actions/getSortablesForCategoryPathAction";
import { useStore } from "@/store";

function SortablesSkeleton() {
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

export default function Sortables() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortOptions, setSortOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the current sort from URL query parameters instead of relying on store
  const currentSortName = searchParams.get("sort") || "";
  const currentSortDir = searchParams.get("dir") || "asc";

  // Get store for drawer state only - not for sort state
  const { toggleProductsSortDrawer } = useStore();

  // Create a function to update the URL with sort params
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

      // Update URL with new sort params
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    setLoading(true);
    getSortablesForCategoryPathAction(pathname)
      .then((data) => {
        console.log("Client received sort options:", data);
        setSortOptions(data || []);

        // If there's no sort in URL but we have options, set default
        if (!currentSortName && data?.length > 0) {
          const defaultSort =
            data.find((option) => option.isDefault) || data[0];
          if (defaultSort) {
            updateSort(defaultSort.name, defaultSort.defaultDirection || "asc");
          }
        }
      })
      .catch((err) => console.error("Client error loading sort options:", err))
      .finally(() => setLoading(false));
  }, [pathname, currentSortName, updateSort]);

  const handleSortSelect = (sortName, direction) => {
    updateSort(sortName, direction);
    // Optional: close drawer on mobile after selection
    if (window.innerWidth < 768) {
      toggleProductsSortDrawer();
    }
  };

  const toggleDirection = (sortName, currentDirection) => {
    const newDirection = currentDirection === "asc" ? "desc" : "asc";
    updateSort(sortName, newDirection);
  };

  if (loading) return <SortablesSkeleton />;
  if (!sortOptions.length) return <p>No sort options available</p>;

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
                  {currentSortName === option.name && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
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
                  {currentSortDir === "asc" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
