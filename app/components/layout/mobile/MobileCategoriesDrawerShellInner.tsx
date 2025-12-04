"use client";

import { useSearchParams } from "next/navigation";
import { CloseDrawerButton } from "./CloseDrawerButton";

export default function MobileCategoriesDrawerShellInner({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <div>
        <div className="border-b border-gray-200 p-2">
          <div className="flex items-center justify-end">
            <CloseDrawerButton />
          </div>
        </div>
        <h1 className="my-2 ml-4 text-center text-3xl">Categories</h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth pb-6">
        {/* TODO This is BAD, ASYNC RSC CANNOT BE IMPORTED TO CLIENT COMP */}
        {/* DELETE IT ENTIRELY FROM HERE */}
        {/* INSTEAD - IT SHOULD BE A CHILD OF THIS SHELL */}
        {/* The shell and the shell inner must be separated, too */}
        {/* <Suspense fallback={<CategoriesLoadingSkeleton />}>
          <MobileCategoriesDrawerWrapper />
        </Suspense> */}
        {children}
      </div>
    </div>
  );
}
