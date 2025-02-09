"use client";

import { useStore } from "@/store";
import { X } from "lucide-react";

export default function ProductsFilterDrawer() {
  const { isProductsFilterDrawerOpen, toggleProductsFilterDrawer } = useStore();

  return (
    <div
      className={`absolute inset-y-0 left-0 w-full sm:w-96 bg-slate-900  shadow-xl transform ${
        isProductsFilterDrawerOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="h-full flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button onClick={toggleProductsFilterDrawer}>
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Filter content goes here */}
        </div>
      </div>
    </div>
  );
}
