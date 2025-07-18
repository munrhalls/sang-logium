import ProductsGrid from "@/app/components/features/products/ProductsGrid";
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
import Footer from "@/app/components/layout/footer/Footer";
import Pagination from "@/app/components/ui/pagination/Pagination";
import getSelectedPagination from "../helpers/getSelectedPagination";
type Params = Promise<{ category: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function ProductsPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const path = Array.isArray(params.category)
    ? params.category
    : [params.category];
  const [root, leaf] = [path[0], path[path.length - 1]];
  const categoryTitle = formatCategoryTitle(leaf);
  const searchParamsResolved = searchParams;
  const selectedFilters = getSelectedFilters(searchParamsResolved);
  const selectedSort = getSelectedSort(searchParamsResolved);
  const selectedPagination = getSelectedPagination(searchParamsResolved);
  const sortField =
    typeof searchParamsResolved.sort === "string"
      ? searchParamsResolved.sort
      : "";
  const sortDirection =
    typeof searchParamsResolved.dir === "string"
      ? searchParamsResolved.dir
      : "asc";
  const [productsResult, filterOptions, sortOptions] = await Promise.all([
    getSelectedProducts(
      path,
      selectedFilters,
      selectedSort,
      selectedPagination,
    ).catch((error) => {
      console.error("Failed to fetch products:", error);
      return { products: [], totalProductsCount: 0 };
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
  const { products, totalProductsCount } = productsResult;
  return (
    <>
      <main className="hidden md:block container mx-auto px-4 py-8">
        <div className="mb-6">
          <CategoryBreadcrumbs categoryParts={path} isMobile={false} />
          <div className="flex justify-center items-center gap-3 mt-8 mb-6  pb-12">
            <CategoryTitleIcon category={root} />
            <h1 className="text-5xl font-bold tracking-wide">
              {categoryTitle}
            </h1>
          </div>
          <div className="hidden md:flex  items-center justify-start md:ml-auto border-b border-gray-300">
            <Pagination totalProductsCount={totalProductsCount} />
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
      </main>
      <div className="md:hidden flex flex-col h-screen overflow-hidden">
        <div className="flex-none bg-white">
          <div className="container mx-auto px-1 py-1 flex">
            <div className="mb-1">
              <CategoryBreadcrumbs categoryParts={path} isMobile={true} />
              <div className="flex justify-start items-center m-1 gap-1">
                <CategoryTitleIcon category={root} />
                <h1 className="text-lg font-bold tracking-wide">
                  {categoryTitle}
                </h1>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <FilterSortBtns />
            </div>
          </div>
          <Pagination totalProductsCount={totalProductsCount} />
        </div>
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
      <Footer />
    </>
  );
}
