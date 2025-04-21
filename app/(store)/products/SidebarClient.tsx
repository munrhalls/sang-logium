"use client";

import { useState } from "react";
import Filters from "@/app/components/ui/filters/Filters";
import SortClient from "@/app/components/ui/sortables/SortClient";
import { SortOption } from "@/app/components/ui/sortables/SortTypes";
import {
  FilterOptions,
  FilterItem,
  RangeFilterItem,
} from "@/app/components/ui/filters/FilterTypes";

export default function SidebarClient({
  filterOptions,
  sortOptions,
  sortField,
}: {
  filterOptions: FilterOptions;
  sortOptions?: SortOption[];
  sortField?: string;
}) {
  const [activeView, setActiveView] = useState("filters");

  return (
    <div className="hidden md:block bg-blue-950 shadow-xl text-white rounded-lg p-4 mb-4">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveView("filters")}
          className={`flex-1 py-2 px-3 rounded tracking-wide uppercase text-sm  ${activeView === "filters" ? "bg-blue-700 text-white font-semibold" : "bg-white text-black font-light"}`}
        >
          Filters
        </button>
        <button
          onClick={() => setActiveView("sort")}
          className={`flex-1 py-2 px-3 rounded tracking-wide uppercase text-sm  ${activeView === "sort" ? "bg-blue-700 text-white font-semibold" : "bg-white text-black font-light"}`}
        >
          Sort
        </button>
      </div>

      {activeView === "filters" ? (
        <Filters filterOptions={filterOptions} />
      ) : (
        <SortClient initialSortOptions={sortOptions} currentSort={sortField} />
      )}
    </div>
  );
}
