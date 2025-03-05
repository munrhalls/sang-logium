import getProductsByCategoryPath from "@/sanity/lib/products/getProductsByCategoryPath";
import ProductsClient from "@/app/components/features/products-view/ProductsClient";
import FilterSortBtns from "@/app/components/ui/buttons/FilterSortBtns";
import CategoryBreadcrumbs from "@/app/components/ui/breadcrumbs/CategoryBreadcrumbs";
import CategoryTitleIcon from "@/app/components/ui/icons/CategoryTitleIcon";
import ProductsFilterSortDrawersWrapper from "@/app/components/ui/drawers/ProductsFilterSortDrawersWrapper";
import { firstLetterToUpperCase } from "@/lib/utils";
import FiltersClient from "@/app/components/ui/filters/FilterClient";
import SortablesClient from "@/app/components/ui/sortables/SortClient";
import { getFiltersForCategoryPathAction } from "@/app/actions/getFiltersForCategoryPathAction";
import { getSortablesForCategoryPathAction } from "@/app/actions/getSortablesForCategoryPathAction";

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

  const initialProducts = await getProductsByCategoryPath(path);
  const filterOptions = await getFiltersForCategoryPathAction(path);
  const sortOptions = await getSortablesForCategoryPathAction(path);
  console.log(filterOptions, "filterOptions");

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
