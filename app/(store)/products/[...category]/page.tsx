import ProductsGrid from "@/app/components/features/products-view/ProductsGrid";
import CategoryBreadcrumbs from "@/app/components/ui/breadcrumbs/CategoryBreadcrumbs";
import CategoryTitleIcon from "@/app/components/ui/icons/CategoryTitleIcon";
import AppliedFilters from "@/app/components/ui/tag-elements/AppliedFilters";
import FilterSortBtns from "@/app/components/ui/buttons/FilterSortBtns";
import ProductsFilterSortDrawersWrapper from "@/app/components/ui/drawers/ProductsFilterSortDrawersWrapper";
import { getFiltersForCategoryPathAction } from "@/app/actions/getFiltersForCategoryPathAction";
import { getSortablesForCategoryPathAction } from "@/app/actions/getSortablesForCategoryPathAction";
import getSelectedFilters from "../helpers/getSelectedFilters";
import { getSelectedProducts } from "@/sanity/lib/products/getSelectedProducts";
import SidebarClient from "../SidebarClient";
import getSelectedSort from "../helpers/getSelectedSort";
import formatCategoryTitle from "../helpers/formatCategoryTitle";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { category: string[] };
  searchParams: { [key: string]: string | string[] };
}) {
  const path = (await params).category;
  const [root, leaf] = [path[0], path[path.length - 1]];
  const categoryTitle = formatCategoryTitle(leaf);
  const searchParamsResolved = await searchParams;
  const selectedFilters = getSelectedFilters(searchParamsResolved);
  const selectedSort = getSelectedSort(searchParamsResolved);
  // Get sort parameters
  const sortField =
    typeof searchParamsResolved.sort === "string"
      ? searchParamsResolved.sort
      : "";
  const sortDirection =
    typeof searchParamsResolved.dir === "string"
      ? searchParamsResolved.dir
      : "asc";

  // Fetch data in parallel
  const [products, filterOptions, sortOptions] = await Promise.all([
    getSelectedProducts(path, selectedFilters, selectedSort).catch((error) => {
      console.error("Failed to fetch products:", error);
      return [];
    }),
    getFiltersForCategoryPathAction(path).catch((error) => {
      console.error("Failed to fetch filters:", error);
      return [];
    }),
    getSortablesForCategoryPathAction(path.join("/")).catch((error) => {
      console.error("Failed to fetch sort options:", error);
      return [];
    }),
  ]);

  console.log("Filter options:", filterOptions);
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumbs & Category Title */}
      <div className="mb-6">
        <CategoryBreadcrumbs categoryParts={path} />
        <div className="flex justify-center items-center gap-4 mt-4 mb-8">
          <CategoryTitleIcon category={root} />
          <h1 className="text-5xl font-bold">{categoryTitle}</h1>
        </div>
      </div>

      {/* Applied Filters */}
      <AppliedFilters filterOptions={filterOptions} />

      {/* Mobile Filter/Sort Buttons */}
      <div className="md:hidden">
        <FilterSortBtns />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mt-4">
        {/* Desktop Filters - Hidden on Mobile */}
        <SidebarClient
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          sortField={sortField}
        />

        {/* Products Grid */}
        <div>
          <div className="mb-4 p-4 bg-white rounded-lg shadow">
            <p className="text-sm text-gray-500">
              Showing {products.length} product{products.length !== 1 && "s"}
              {sortField && ` sorted by ${sortField} (${sortDirection})`}
            </p>
          </div>

          <ProductsGrid products={products} />
        </div>
      </div>

      {/* Mobile Filter/Sort Drawers */}
      <ProductsFilterSortDrawersWrapper categoryPath={path} />
    </main>
  );
}
