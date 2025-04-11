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
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveView("filters")}
          className={`flex-1 py-1 px-3 rounded ${activeView === "filters" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Filters
        </button>
        <button
          onClick={() => setActiveView("sort")}
          className={`flex-1 py-1 px-3 rounded ${activeView === "sort" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
