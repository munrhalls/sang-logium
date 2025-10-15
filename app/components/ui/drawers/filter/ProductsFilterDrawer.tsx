"use client";
import { useUIStore } from "@/store/store";
import { X } from "lucide-react";
import Filters from "../../filters/Filters";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FilterOptions } from "../../filters/FilterTypes";
export default function ProductsFilterDrawer({
  filterOptions = [],
}: {
  filterOptions: FilterOptions;
}) {
  const { isProductsFilterDrawerOpen, toggleProductsFilterDrawer } =
    useUIStore();
  const pathname = usePathname();
  useEffect(() => {
    if (isProductsFilterDrawerOpen) {
      toggleProductsFilterDrawer();
    }
  }, [pathname]);
  return (
    <div
      className={`fixed inset-y-0 left-0 w-full transform bg-blue-950 text-white shadow-xl sm:w-[85%] md:hidden ${
        isProductsFilterDrawerOpen ? "translate-x-0" : "-translate-x-full"
      } z-50 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-white">Filter Products</h2>
          <button
            onClick={toggleProductsFilterDrawer}
            className="rounded-full p-2 hover:bg-blue-900"
            aria-label="Close filter drawer"
          >
            <X className="h-6 w-6" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 text-white">
          <Filters filterOptions={filterOptions} />
        </div>
        <footer className="border-t p-4">
          <button
            onClick={toggleProductsFilterDrawer}
            className="w-full rounded-md bg-white py-2 font-medium text-blue-950"
          >
            Apply Filters
          </button>
        </footer>
      </div>
    </div>
  );
}
