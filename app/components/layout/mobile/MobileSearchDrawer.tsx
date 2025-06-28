"use client";

import { useUIStore } from "../../../../store";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function MobileSearchDrawer() {
  const isSearchDrawerOpen = useStore((state) => state.isSearchDrawerOpen);
  const toggleSearchDrawer = useStore((state) => state.toggleSearchDrawer);

  const [isMounted, setIsMounted] = useState(false);

  // for hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`z-50 absolute inset-0 overflow-hidden h-full w-full pointer-events-auto  bg-slate-50 text-black transition-transform duration-300 ${
        isSearchDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <div className="p-2 border-b border-gray-200">
          <div className="flex justify-end items-center">
            <button
              onClick={toggleSearchDrawer}
              className="flex gap-1 items-center justify-center text-black"
            >
              <span>CLOSE</span>

              <FaTimes size={14} />
            </button>
          </div>
        </div>

        <form action="/search" className="mt-4">
          <input
            type="text"
            name="query"
            placeholder="Look for products by name..."
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <div className="flex justify-center mt-4 ">
            <button
              type="submit"
              className="border-gray-800 border rounded px-3 py-2"
            >
              SEARCH
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
