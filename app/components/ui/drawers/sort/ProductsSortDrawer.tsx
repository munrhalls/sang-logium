"use client";
import { useUIStore } from "@/store/store";
import { X } from "lucide-react";
import SortClient from "../../sortables/SortClient";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SortOption } from "../../sortables/SortTypes";
export default function ProductsSortDrawer({
  sortOptions = [],
}: {
  sortOptions: SortOption[];
}) {
  const { isProductsSortDrawerOpen, toggleProductsSortDrawer } = useUIStore();
  const pathname = usePathname();
  useEffect(() => {
    if (isProductsSortDrawerOpen) {
      toggleProductsSortDrawer();
    }
  }, [pathname]);
  return (
    <div
      className={`fixed inset-y-0 right-0 w-full transform bg-blue-950 text-white shadow-xl sm:w-[85%] md:hidden ${
        isProductsSortDrawerOpen ? "translate-x-0" : "translate-x-full"
      } z-50 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-white">Sort Products</h2>
          <button
            onClick={toggleProductsSortDrawer}
            className="rounded-full p-2 hover:bg-blue-900"
            aria-label="Close sort drawer"
          >
            <X className="h-6 w-6" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 text-white">
          <SortClient
            initialSortOptions={sortOptions}
            currentSort={sortOptions.length > 0 ? sortOptions[0].name : ""}
          />
        </div>
        <footer className="border-t p-4">
          <button
            onClick={toggleProductsSortDrawer}
            className="w-full rounded-md bg-white py-2 font-medium text-blue-950"
          >
            Apply Sort
          </button>
        </footer>
      </div>
    </div>
  );
}
