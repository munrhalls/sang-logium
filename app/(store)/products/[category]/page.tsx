import ProductsGrid from "@/app/components/features/products-view/ProductsGrid";
import CategoryBreadcrumbs from "@/app/components/ui/breadcrumbs/CategoryBreadcrumbs";
import CategoryTitleIcon from "@/app/components/ui/icons/CategoryTitleIcon";
import Filters from "@/app/components/ui/filters/Filters";
import { getFiltersForCategoryPathAction } from "@/app/actions/getFiltersForCategoryPathAction";
import { getFilteredProductsByCategoryAction } from "@/app/actions/getFilteredProductsByCategoryAction";

export default async function ProductsPage({
  params,
}: {
  params: { category: string };
  searchParams: URLSearchParams;
}) {
  const path = (await params).category;
  const categoryParts = path.split("/");
  const rootCategory = categoryParts[0];
  const leafCategory = categoryParts[categoryParts.length - 1];

  const selectedFilters = new URLSearchParams();

  // Use Promise.allSettled to handle potential fetch failures gracefully
  const [productsResult, filtersResult] = await Promise.allSettled([
    getFilteredProductsByCategoryAction(path),
    getFiltersForCategoryPathAction(path),
  ]);

  // Extract data or use empty arrays as fallbacks
  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
  const filterOptions =
    filtersResult.status === "fulfilled" ? filtersResult.value : [];

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-4">
      <CategoryBreadcrumbs categoryParts={categoryParts} />
      <div className="flex items-center gap-4">
        <CategoryTitleIcon category={rootCategory} />
        <h1 className="text-2xl">{leafCategory}</h1>
      </div>
      <div>
        <Filters filterOptions={filterOptions} />
      </div>
      <ProductsGrid products={products} />
    </div>
  );
}
