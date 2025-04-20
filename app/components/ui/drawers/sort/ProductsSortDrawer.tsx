"use client";

import { useStore } from "@/store";
import { X } from "lucide-react";
import SortClient from "../../sortables/SortClient";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ProductsSortDrawer({ sortOptions = [] }) {
  const { isProductsSortDrawerOpen, toggleProductsSortDrawer } = useStore();
  const pathname = usePathname();
  
  // Close drawer when navigating to a new page
  useEffect(() => {
    if (isProductsSortDrawerOpen) {
      toggleProductsSortDrawer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className={`md:hidden fixed inset-y-0 right-0 w-full sm:w-[85%] bg-blue-950 shadow-xl text-white transform ${
        isProductsSortDrawerOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="h-full flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Sort Products</h2>
          <button
            onClick={toggleProductsSortDrawer}
            className="p-2 rounded-full hover:bg-blue-900"
            aria-label="Close sort drawer"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 text-white">
          <SortClient 
            initialSortOptions={sortOptions} 
            currentSort={sortOptions.length > 0 ? sortOptions[0].name : ''} 
          />
        </div>
        
        <footer className="p-4 border-t">
          <button 
            onClick={toggleProductsSortDrawer}
            className="w-full py-2 bg-white text-blue-950 rounded-md font-medium"
          >
            Apply Sort
          </button>
        </footer>
      </div>
    </div>
  );
}
