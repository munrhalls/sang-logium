import getProductsByCategoryPath from "@/sanity/lib/products/getProductsByCategoryPath";
import ProductsClient from "@/app/components/features/products-view/ProductsClient";
import CategoryBreadcrumbs from "@/app/components/ui/breadcrumbs/CategoryBreadcrumbs";
import CategoryTitleIcon from "@/app/components/ui/icons/CategoryTitleIcon";
import FiltersClient from "@/app/components/ui/filters/FilterClient";
import SortablesClient from "@/app/components/ui/sortables/SortClient";
import { getFiltersForCategoryPathAction } from "@/app/actions/getFiltersForCategoryPathAction";
import { getSortablesForCategoryPathAction } from "@/app/actions/getSortablesForCategoryPathAction";
import { getFilteredProductsByCategoryAction } from "@/app/actions/getFilteredProductsByCategoryAction";
import { parseUrlToFilterConfig } from "@/sanity/lib/url/parseUrlToFilterConfig";
import { buildFilteredQuery } from "@/sanity/lib/products/buildFilteredQuery";
import { sanityFetch } from "@/sanity/lib/live";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: URLSearchParams;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const path = resolvedParams.category;

  const categoryParts = path.split("/");
  const rootCategory = categoryParts[0];
  const leafCategory = categoryParts[categoryParts.length - 1];

  const filterConfig = parseUrlToFilterConfig(resolvedSearchParams);
  const query = buildFilteredQuery(filterConfig);
  console.log("query", query);
  const initialProductsObj = await sanityFetch({
    query,
  });
  const initialProducts = initialProductsObj.data || [];
  console.log("initialProducts", initialProducts);
  // const initialProducts = await getFilteredProductsByCategoryAction(path);
  const filterOptions = await getFiltersForCategoryPathAction(path);
  const sortOptions = await getSortablesForCategoryPathAction(path);

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-4">
      <CategoryBreadcrumbs categoryParts={categoryParts} />
      <div>
        <CategoryTitleIcon category={rootCategory} />
        <h1></h1>
      </div>
      <div>
        <FiltersClient
          initialFilters={filterOptions}
          currentFilters={resolvedSearchParams}
          category={path}
        />
        <SortablesClient
          initialSortOptions={sortOptions}
          currentSort={resolvedSearchParams}
        />
      </div>
      <ProductsClient
        initialProducts={initialProducts}
        category={path}
        urlParams={resolvedSearchParams}
      />
    </div>
  );
}
