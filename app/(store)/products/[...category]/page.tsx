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
import formatSortName from "@/app/components/ui/sortables/helpers/formatSortName";
import formatSortDirection from "@/app/components/ui/sortables/helpers/formatSortDirection";

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

  const sortField =
    typeof searchParamsResolved.sort === "string"
      ? searchParamsResolved.sort
      : "";
  const sortDirection =
    typeof searchParamsResolved.dir === "string"
      ? searchParamsResolved.dir
      : "asc";

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
    <>
      {/* Desktop View */}
      <main className="hidden md:block container mx-auto px-4 py-8">
        <div className="mb-6">
          <CategoryBreadcrumbs categoryParts={path} />
          <div className="flex justify-center items-center gap-3 mt-8 mb-6 border-b border-gray-300 pb-12">
            <CategoryTitleIcon category={root} />
            <h1 className="text-5xl font-bold tracking-wide">
              {categoryTitle}
            </h1>
          </div>
        </div>

        <AppliedFilters filterOptions={filterOptions} />

        <div className="grid grid-cols-[280px_1fr] gap-6 mt-4">
          <SidebarClient
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            sortField={sortField}
          />

          <div>
            <div className="mb-1 p-1 bg-slate-200 rounded-lg shadow">
              <p className="text-md p-2 lg:text-xl text-gray-500">
                Showing {products.length} product{products.length !== 1 && "s"}
                {sortField &&
                  ` sorted by ${formatSortName(sortField)} (${formatSortDirection(sortDirection)})`}
              </p>

              <ProductsGrid products={products} />
            </div>
          </div>
        </div>

        <ProductsFilterSortDrawersWrapper categoryPath={path} />
      </main>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col h-screen overflow-hidden">
        {/* Header area - doesn't scroll */}
        <div className="flex-none bg-white">
          <div className="container mx-auto px-4 py-1">
            <div className="mb-1">
              <CategoryBreadcrumbs categoryParts={path} />
              <div className="flex justify-center items-center gap-1 mt-2 mb-1 pb-1">
                <CategoryTitleIcon category={root} />
                <h1 className="text-lg font-bold tracking-wide">
                  {categoryTitle}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 items-center bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
              <FilterSortBtns />
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-grow overflow-y-auto">
          <div className="container mx-auto px-4">
            <AppliedFilters filterOptions={filterOptions} />

            <div className="grid grid-cols-1 gap-6 mt-4">
              <SidebarClient
                filterOptions={filterOptions}
                sortOptions={sortOptions}
                sortField={sortField}
              />

              <div>
                <div className="mb-1 p-1 bg-slate-200 rounded-lg shadow">
                  <p className="text-md p-2 lg:text-xl text-gray-500">
                    Showing {products.length} product
                    {products.length !== 1 && "s"}
                    {sortField &&
                      ` sorted by ${formatSortName(sortField)} (${formatSortDirection(sortDirection)})`}
                  </p>

                  <ProductsGrid products={products} />
                </div>
              </div>
            </div>

            <ProductsFilterSortDrawersWrapper categoryPath={path} />
          </div>
        </div>
      </div>
    </>
  );
}
