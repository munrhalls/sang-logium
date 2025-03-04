import ProductsFilterDrawer from "@/app/components/ui/drawers/filter/ProductsFilterDrawer";
import ProductsSortDrawer from "@/app/components/ui/drawers/sort/ProductsSortDrawer";
// import { getFilters } from "@/sanity/lib/products/filter/getFilters";

export default async function ProductsFilterSortDrawersWrapper() {
  // const filters = await getFilters();
  return (
    <>
      <ProductsFilterDrawer />
      <ProductsSortDrawer />
    </>
  );
}
