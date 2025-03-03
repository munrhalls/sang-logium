"use client";

import { useStore } from "@/store";
import { X } from "lucide-react";
import Filters from "./Filters";
// color rgb(29 78 216 / var(--tw-bg-opacity, 1))

export default function ProductsFilterDrawer() {
  const { isProductsFilterDrawerOpen, toggleProductsFilterDrawer } = useStore();

  return (
    <div
      className={`absolute inset-y-0 left-0  w-full sm:w-96 bg-blue-950  shadow-xl text-white  transform ${
        isProductsFilterDrawerOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-250 ease-in-out z-50 lg:static lg:translate-x-0 lg:w-40 lg:h-full lg:row-start-1 lg:row-span-2`}
    >
      <div className="h-full flex flex-col">
        <header className="p-4 border-b flex justify-between lg:justify-center items-center">
          <h2 className="text-xl font-semibold text-white text-center">
            Filter
          </h2>
          <button
            onClick={toggleProductsFilterDrawer}
            className="block lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 text-white">
          <Filters />
        </div>
      </div>
    </div>
  );
}
