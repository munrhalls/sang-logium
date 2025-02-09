"use client";

import ProductsFilterDrawer from "@/app/components/ui/drawers/ProductsFilterDrawer";
import ProductsSortDrawer from "@/app/components/ui/drawers/ProductsSortDrawer";

export default function ProductsFilterSortDrawersWrapper() {
  return (
    <>
      <ProductsFilterDrawer />
      <ProductsSortDrawer />
    </>
  );
}
