import ProductsFilterDrawer from "@/app/components/ui/drawers/filter/ProductsFilterDrawer";
import ProductsSortDrawer from "@/app/components/ui/drawers/sort/ProductsSortDrawer";
import { getFiltersForCategoryPath } from "@/sanity/lib/products/filter/getFiltersForCategoryPath";
import { getSortablesForCategoryPath } from "@/sanity/lib/products/sort/getSortablesForCategoryPath";

export default async function ProductsFilterSortDrawersWrapper({
  categoryPath,
}: {
  categoryPath: string[];
}) {
  // Get filter and sort options based on category path
  const filterOptions = await getFiltersForCategoryPath(categoryPath || []);
  const sortOptions = await getSortablesForCategoryPath(
    categoryPath ? categoryPath.join("/") : ""
  );

  return (
    <>
      <ProductsFilterDrawer filterOptions={filterOptions} />
      <ProductsSortDrawer sortOptions={sortOptions} />
    </>
  );
}
