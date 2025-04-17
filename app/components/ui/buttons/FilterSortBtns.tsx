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

  return (
    <div className="md:hidden z-40 grid grid-cols-2 justify-items-center gap-2 p-2 ">
      <button
        onClick={toggleProductsFilterDrawer}
        className={`h-[24px] max-w-40 flex items-center justify-center gap-2  px-4 py-1 rounded-xl font-medium transition-colors bg-gray-100 text-gray-800 border border-gray-300`}
      >
        <SlidersHorizontal size={13} />
        Filter
      </button>

      <button
        onClick={toggleProductsSortDrawer}
        className={`h-[24px] max-w-40 flex items-center justify-center gap-2  px-4 py-1 rounded-xl font-medium transition-colors bg-gray-100 text-gray-800 border border-gray-300`}
      >
        <ArrowUpDown size={13} />
        Sort
      </button>
    </div>
  );
}
