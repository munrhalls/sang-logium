"use client";

import { useStore } from "../../store";
import { useEffect, useState } from "react";

export default function MobileSearchDrawer() {
  const isDrawerOpen = useStore((state) => state.isDrawerOpen);
  const toggleDrawer = useStore((state) => state.toggleDrawer);

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
      className={`z-50 pointer-events-auto fixed top-[60px] left-0 bottom-[60px] bg-white text-black transition-transform duration-300 ${
        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ width: "90%" }}
    >
      <div className="p-4">
        <div className="flex justify-end items-center mr-2">
          <button onClick={toggleDrawer} className="text-black">
            Close
          </button>
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
