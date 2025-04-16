"use client";
import { useStore } from "@/store";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function FilterSortBtns() {
  const toggleProductsFilterDrawer = useStore(
    (state) => state.toggleProductsFilterDrawer
  );

  const toggleProductsSortDrawer = useStore(
    (state) => state.toggleProductsSortDrawer
  );

  const searchParams = useSearchParams();
  const hasActiveFilters = Array.from(searchParams.keys()).some(
    (key) => !key.includes("sort") && !key.includes("dir")
  );

  return (
    <div className="sticky bottom-0 md:hidden z-40 grid grid-cols-2 gap-2 p-3 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <button
        onClick={toggleProductsFilterDrawer}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-colors ${
          hasActiveFilters
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-800 border border-gray-300"
        }`}
      >
        <SlidersHorizontal size={18} />
        Filter
        {hasActiveFilters && (
          <span className="ml-1 bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
            Active
          </span>
        )}
      </button>

      <button
        onClick={toggleProductsSortDrawer}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-colors bg-gray-100 text-gray-800 border border-gray-300`}
      >
        <ArrowUpDown size={18} />
        Sort
      </button>
    </div>
  );
}
