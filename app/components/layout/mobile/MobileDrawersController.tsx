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
      // TODO categories - this is async component and violates next.js rules -
      fix // TODO restructure to avoid violation // TODO that kind of async comp
      can be put into a client component but not imported when it is put as a
      child of such component, then it remains server component // TODO figure
      out how to restructure and if the above fact can be used to accomplish
      simpler architecture
      <MobileCategoriesDrawerWrapper isOpen={isMenuOpen} />
      <MobileSearchDrawer isOpen={isSearchOpen} />
    </>
  );
}

export default function MobileDrawersController() {
  return (
    <Suspense fallback={null}>
      <MobileDrawersControllerInner />
    </Suspense>
  );
}
