"use client";
import { useUIStore } from "@/store/store";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
export default function FilterSortBtns() {
  const toggleProductsFilterDrawer = useUIStore(
    (state) => state.toggleProductsFilterDrawer
  );
  const toggleProductsSortDrawer = useUIStore(
    (state) => state.toggleProductsSortDrawer
  );
  return (
    <div className="z-40 flex flex-col items-center gap-1 2xs:flex-row md:hidden">
      <button
        onClick={toggleProductsFilterDrawer}
        className={`flex h-[24px] w-24 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-4 py-1 font-medium text-gray-800 transition-colors`}
      >
        <SlidersHorizontal size={13} />
        Filter
      </button>
      <button
        onClick={toggleProductsSortDrawer}
        className={`flex h-[24px] w-24 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-4 py-1 font-medium text-gray-800 transition-colors`}
      >
        <ArrowUpDown size={13} />
        Sort
      </button>
    </div>
  );
}
