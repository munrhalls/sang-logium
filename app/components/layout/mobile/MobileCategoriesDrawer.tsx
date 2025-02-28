"use client";

import { useStore } from "../../../../store";
import { ReactElement } from "react";
import { FaTimes } from "react-icons/fa";

export default function MobileCategoriesDrawer({
  categoriesTreeUI,
}: {
  categoriesTreeUI: ReactElement;
}) {
  const isCategoriesDrawerOpen = useStore(
    (state) => state.isCategoriesDrawerOpen
  );
  const toggleCategoriesDrawer = useStore(
    (state) => state.toggleCategoriesDrawer
  );

  const handleClick = () => {
    toggleCategoriesDrawer();
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden h-full w-full z-50 pointer-events-auto  bg-slate-50 text-black transition-transform duration-300 flex flex-col ${
        isCategoriesDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="p-2 border-b border-gray-200">
          <div className="flex justify-end items-center">
            <button
              onClick={toggleCategoriesDrawer}
              className="flex gap-1 items-center justify-center text-black"
            >
              <span>CLOSE</span>

              <FaTimes size={14} />
            </button>
          </div>
        </div>
        <h1 className="text-3xl text-center my-2 ml-4">Categories</h1>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto scroll-smooth pb-6"
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoriesTreeUI}
          </div>
          <p className="mt-8 flex justify-center items-center text-gray-500">
            End.
          </p>
        </div>
      </div>
    </div>
  );
}
