"use client";

import { useStore } from "@/store";
import { X } from "lucide-react";
import Filters from "../../filters/Filters";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ProductsFilterDrawer({ filterOptions = [] }) {
  const { isProductsFilterDrawerOpen, toggleProductsFilterDrawer } = useStore();
  const pathname = usePathname();
  
  // Close drawer when navigating to a new page
  useEffect(() => {
    if (isProductsFilterDrawerOpen) {
      toggleProductsFilterDrawer();
    }
  }, [pathname]);

  return (
    <div
      className={`md:hidden fixed inset-y-0 left-0 w-full sm:w-[85%] bg-blue-950 shadow-xl text-white transform ${
        isProductsFilterDrawerOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="h-full flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Filter Products
          </h2>
          <button
            onClick={toggleProductsFilterDrawer}
            className="p-2 rounded-full hover:bg-blue-900"
            aria-label="Close filter drawer"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 text-white">
          <Filters filterOptions={filterOptions} />
        </div>
        
        <footer className="p-4 border-t">
          <button 
            onClick={toggleProductsFilterDrawer}
            className="w-full py-2 bg-white text-blue-950 rounded-md font-medium"
          >
            Apply Filters
          </button>
        </footer>
      </div>
    </div>
  );
}
