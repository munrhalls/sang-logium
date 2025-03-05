"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { getSortablesForCategoryPathAction } from "@/app/actions/getSortablesForCategoryPathAction";
import { useStore } from "@/store";

const ChevronUp = function () {
  return (
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
  );
};

const ChevronDown = function () {
  return (
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
  );
};

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
  const { toggleProductsSortDrawer } = useStore();

  const currentSortName = searchParams.get("sort") || "";
  const currentSortDir = searchParams.get("dir") || "asc";

  const loadedRef = useRef(false);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      setLoading(true);

      getSortablesForCategoryPathAction(pathname)
        .then((data) => {
          setSortOptions(data || []);

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
        })
        .catch((err) => console.error("Error loading sort options:", err))
        .finally(() => setLoading(false));
    }
  }, [pathname, router, searchParams, currentSortName]);

  const updateSort = (sortName, direction) => {
    const params = new URLSearchParams(searchParams);

    if (sortName) {
      params.set("sort", sortName);
      params.set("dir", direction || "asc");
    } else {
      params.delete("sort");
      params.delete("dir");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortSelect = (sortName, direction) => {
    updateSort(sortName, direction);

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
