"use client";
import { useUIStore } from "../../../../store/store";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
export default function MobileSearchDrawer() {
  const isSearchDrawerOpen = useUIStore((state) => state.isSearchDrawerOpen);
  const toggleSearchDrawer = useUIStore((state) => state.toggleSearchDrawer);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <div
      className={`pointer-events-auto absolute inset-0 z-50 h-full w-full overflow-hidden bg-slate-50 text-black transition-transform duration-300 ${
        isSearchDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <div className="border-b border-gray-200 p-2">
          <div className="flex items-center justify-end">
            <button
              onClick={toggleSearchDrawer}
              className="flex items-center justify-center gap-1 text-black"
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
            className="w-full rounded bg-gray-800 p-2 text-white"
          />
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              className="rounded border border-gray-800 px-3 py-2"
            >
              SEARCH
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
