"use client";
import { useUIStore } from "@/store";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
export default function FilterSortBtns() {
  const toggleProductsFilterDrawer = useUIStore(
    (state) => state.toggleProductsFilterDrawer,
  );
  const toggleProductsSortDrawer = useUIStore(
    (state) => state.toggleProductsSortDrawer,
  );
  return (
    <div className="md:hidden z-40 flex items-center flex-col 2xs:flex-row gap-1">
      <button
        onClick={toggleProductsFilterDrawer}
        className={`h-[24px] w-24 flex items-center justify-center gap-2  px-4 py-1 rounded-xl font-medium transition-colors bg-gray-100 text-gray-800 border border-gray-300`}
      >
        <SlidersHorizontal size={13} />
        Filter
      </button>
      <button
        onClick={toggleProductsSortDrawer}
        className={`h-[24px] w-24 flex items-center justify-center gap-2  px-4 py-1 rounded-xl font-medium transition-colors bg-gray-100 text-gray-800 border border-gray-300`}
      >
        <ArrowUpDown size={13} />
        Sort
      </button>
    </div>
  );
}
