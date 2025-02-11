"use client";

import { useStore } from "@/store";
import { X } from "lucide-react";

export default function ProductsSortDrawer() {
  const { isProductsSortDrawerOpen, toggleProductsSortDrawer } = useStore();

  return (
    <div
      className={`absolute inset-y-0 right-0 w-full bg-slate-900 sm:w-96 text-white shadow-xl transform ${
        isProductsSortDrawerOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-250 ease-in-out z-50`}
    >
      <div className="h-full flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Sort</h2>
          <button onClick={toggleProductsSortDrawer}>
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Sort options go here */}
        </div>
      </div>
    </div>
  );
}
