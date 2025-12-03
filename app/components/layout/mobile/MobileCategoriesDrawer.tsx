import { ReactElement } from "react";
import { CloseDrawerButton } from "./CloseDrawerButton";

export default function MobileCategoriesDrawer({
  categoriesTreeUI,
  isOpen,
}: {
  categoriesTreeUI: ReactElement;
  isOpen: boolean;
}) {
  const handleClick = () => {
    // Navigation handled by Link in categoriesTreeUI
  };
  return (
    <div
      className={`pointer-events-auto absolute inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-slate-50 text-black transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="border-b border-gray-200 p-2">
          <div className="flex items-center justify-end">
            <CloseDrawerButton />
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
