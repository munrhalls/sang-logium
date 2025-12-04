"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MobileCategoriesDrawerWrapper from "./MobileCategoriesDrawerWrapper";
import MobileSearchDrawer from "./MobileSearchDrawer";

function MobileDrawersControllerInner() {
  const searchParams = useSearchParams();

  const isSearchOpen =
    searchParams.get("search") === "true" &&
    searchParams.get("menu") !== "true";
  const isMenuOpen =
    searchParams.get("menu") === "true" &&
    searchParams.get("search") !== "true";

  return (
    <>
      {/* Server component - always mounted, animation controlled by isOpen */}
      <MobileCategoriesDrawerWrapper isOpen={isMenuOpen} />
      {/* Client component - always mounted, animation controlled by isOpen */}
      <MobileSearchDrawer isOpen={isSearchOpen} />
    </>
  );
}

// Suspense boundary required for useSearchParams
export default function MobileDrawersController() {
  return (
    <Suspense fallback={null}>
      <MobileDrawersControllerInner />
    </Suspense>
  );
}
