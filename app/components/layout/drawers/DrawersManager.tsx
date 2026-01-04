"use client";
import { cn } from "@/lib/utils/tailwind";
import { useDrawer } from "@/app/hooks/nuqs/useDrawer";

export default function DrawerManager() {
  const { drawer, isOpen, closeDrawer } = useDrawer();

  return (
    <div
      className={cn(
        "fixed right-0 top-0 z-50 h-screen w-3/4 bg-purple-600 shadow-lg transition-transform duration-300 ease-in-out lg:w-1/4",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <button onClick={closeDrawer} className="p-4">
        Close
      </button>
      <div className="p-4">Current Drawer: {drawer}</div>
    </div>
  );
}
