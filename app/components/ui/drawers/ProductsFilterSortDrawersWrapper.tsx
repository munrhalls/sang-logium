import ProductsFilterDrawer from "@/app/components/ui/drawers/ProductsFilterDrawer";
import ProductsSortDrawer from "@/app/components/ui/drawers/ProductsSortDrawer";
import { getFilters } from "@/sanity/lib/products/filter-and-sort/getFilters";

export default async function ProductsFilterSortDrawersWrapper() {
  const filters = await getFilters();
  console.log(filters, " ... filters");
  return (
    <>
      <ProductsFilterDrawer />
      <ProductsSortDrawer />
    </>
  );
}
