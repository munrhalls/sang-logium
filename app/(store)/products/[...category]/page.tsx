import ProductsGrid from "@/app/components/features/products-view/ProductsGrid";
import CategoryBreadcrumbs from "@/app/components/ui/breadcrumbs/CategoryBreadcrumbs";
import CategoryTitleIcon from "@/app/components/ui/icons/CategoryTitleIcon";
import Filters from "@/app/components/ui/filters/Filters";
import { getFiltersForCategoryPathAction } from "@/app/actions/getFiltersForCategoryPathAction";
import getSelectedFilters from "../helpers/getSelectedFilters";
import { getSelectedProducts } from "@/sanity/lib/products/getSelectedProducts";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { [key: string]: string | string[] };
}) {
  const path: string[] = (await params).category;
  const searchParamsResolved = await searchParams;
  const [root, leaf] = [path[0], path[path.length - 1]];
  const selectedFilters = getSelectedFilters(searchParamsResolved);

  const productsPromise = getSelectedProducts(path, selectedFilters);
  const filtersPromise = getFiltersForCategoryPathAction(path);

  const [products, filterOptions] = await Promise.all([
    productsPromise.catch((error) => {
      console.error("Failed to fetch products:", error);
      return [];
    }),
    filtersPromise.catch((error) => {
      console.error("Failed to fetch filters:", error);
      return [];
    }),
  ]);

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-4">
      <CategoryBreadcrumbs categoryParts={path} />
      <div className="flex items-center gap-4">
        <CategoryTitleIcon category={root} />
        <h1 className="text-2xl">{leaf}</h1>
      </div>
      <div>
        <Filters filterOptions={filterOptions} />
      </div>
      <ProductsGrid products={products} />
    </div>
  );
}
