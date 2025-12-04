"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CloseDrawerButton } from "./CloseDrawerButton";
import CategoriesLoadingSkeleton from "./CategoriesLoadingSkeleton";
import MobileCategoriesDrawerWrapper from "./MobileCategoriesDrawerWrapper";

function MobileCategoriesDrawerShellInner() {
  const searchParams = useSearchParams();
  const isOpen =
    searchParams.get("menu") === "true" &&
    searchParams.get("search") !== "true";

  return (
    <div
      className={`pointer-events-auto absolute inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-slate-50 text-black transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Instant static shell */}
      <div>
        <div className="border-b border-gray-200 p-2">
          <div className="flex items-center justify-end">
            <CloseDrawerButton />
          </div>
        </div>
        <h1 className="my-2 ml-4 text-center text-3xl">Categories</h1>
      </div>

      {/* Async content with streaming */}
      <div className="flex-1 overflow-y-auto scroll-smooth pb-6">
        <Suspense fallback={<CategoriesLoadingSkeleton />}>
          <MobileCategoriesDrawerWrapper />
        </Suspense>
      </div>
    </div>
  );
}

export default function MobileCategoriesDrawerShell() {
  return (
    <Suspense fallback={null}>
      <MobileCategoriesDrawerShellInner />
    </Suspense>
  );
}
