"use client";

import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
import dynamic from "next/dynamic";

const MobileCategoriesDrawer = dynamic(
  () => import("./MobileCategoriesDrawer"),
  {
    loading: () => null,
    ssr: false,
  }
);

const MobileSearchDrawer = dynamic(() => import("./MobileSearchDrawer"), {
  loading: () => null,
  ssr: false,
});

const MobileFooter = dynamic(() => import("./MobileFooter"), {
  loading: () => null,
});

export default function MobileComponents({
  categories,
}: {
  categories: ALL_CATEGORIES_QUERYResult;
}) {
  return (
    <>
      <MobileCategoriesDrawer categories={categories} />
      <MobileSearchDrawer />
      <MobileFooter />
    </>
  );
}
