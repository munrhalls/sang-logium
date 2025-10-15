"use client";
import { useUIStore } from "../../../../store/store";
import { ReactElement } from "react";
import { FaTimes } from "react-icons/fa";
export default function MobileCategoriesDrawer({
  categoriesTreeUI,
}: {
  categoriesTreeUI: ReactElement;
}) {
  const isCategoriesDrawerOpen = useUIStore(
    (state) => state.isCategoriesDrawerOpen
  );
  const toggleCategoriesDrawer = useUIStore(
    (state) => state.toggleCategoriesDrawer
  );
  const handleClick = () => {
    toggleCategoriesDrawer();
  };
  return (
    <div
      className={`pointer-events-auto absolute inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-slate-50 text-black transition-transform duration-300 ${
        isCategoriesDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="border-b border-gray-200 p-2">
          <div className="flex items-center justify-end">
            <button
              onClick={toggleCategoriesDrawer}
              className="flex items-center justify-center gap-1 text-black"
            >
              <span>CLOSE</span>
              <FaTimes size={14} />
            </button>
          </div>
        </div>
        <h1 className="my-2 ml-4 text-center text-3xl">Categories</h1>
      </div>
      {}
      <div
        className="flex-1 overflow-y-auto scroll-smooth pb-6"
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="grid gap-6 bg-white">{categoriesTreeUI}</div>
          <p className="mt-8 flex items-center justify-center text-gray-500">
            End.
          </p>
        </div>
      </div>
    </div>
  );
}
