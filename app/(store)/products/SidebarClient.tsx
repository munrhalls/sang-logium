"use client";

import { useState } from "react";
import Filters from "@/app/components/ui/filters/Filters";
import SortClient from "@/app/components/ui/sortables/SortClient";

export default function SidebarClient({
  filterOptions,
  sortOptions,
  sortField,
}) {
  const [activeView, setActiveView] = useState("filters");

  return (
    <div className="hidden md:block bg-blue-950 shadow-xl text-white rounded-lg p-4 mb-4">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveView("filters")}
          className={`flex-1 py-1 px-3 rounded ${activeView === "filters" ? "bg-blue-700 text-white" : "bg-white text-black"}`}
        >
          Filters
        </button>
        <button
          onClick={() => setActiveView("sort")}
          className={`flex-1 py-1 px-3 rounded ${activeView === "sort" ? "bg-blue-700 text-white" : "bg-white text-black"}`}
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
