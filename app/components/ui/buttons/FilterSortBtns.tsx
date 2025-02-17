"use client";
import { useStore } from "@/store";

export default function FilterSortBtns() {
  const toggleProductsFilterDrawer = useStore(
    (state) => state.toggleProductsFilterDrawer
  );

  const toggleProductsSortDrawer = useStore(
    (state) => state.toggleProductsSortDrawer
  );

  return (
    <div className="h-8 grid grid-cols-2 place-content-center">
      <button onClick={toggleProductsFilterDrawer}>Filter</button>
      <button onClick={toggleProductsSortDrawer}>Sort</button>
    </div>
  );
}
