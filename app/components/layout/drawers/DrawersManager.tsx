"use client";
import { cn } from "@/lib/utils/tailwind";
import { useDrawer } from "@/app/hooks/nuqs/useDrawer";
import MobileCatalogue from "@/app/components/layout/mobile/MobileCatalogue";
// TODO
// animation IN works properly but OUT needs to be fixed - currently just jumps out of view

export default function DrawerManager() {
  const { drawer, isOpen, closeDrawer } = useDrawer();

  return (
    <div
      className={cn(
        "fixed right-0 top-0 z-50 h-screen w-3/4 overflow-y-auto shadow-lg transition-transform duration-300 ease-in-out lg:w-1/4",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <button onClick={closeDrawer} className="p-4">
        Close
      </button>

      {drawer === "catalogue" && <MobileCatalogue />}
    </div>
  );
}
