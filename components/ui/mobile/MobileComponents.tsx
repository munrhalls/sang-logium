"use client";

import dynamic from "next/dynamic";
import { Category } from "@/sanity.types";

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

interface MobileComponentsProps {
  categories: Category[];
}

export default function MobileComponents({
  categories,
}: MobileComponentsProps) {
  return (
    <>
      <MobileCategoriesDrawer categories={categories} />
      <MobileSearchDrawer />
      <MobileFooter />
    </>
  );
}
