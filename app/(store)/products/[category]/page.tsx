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
  // return (
  //   <div className="h-full isolate relative grid grid-rows-[auto_auto_1fr] lg:grid-rows-[3rem_1fr] lg:grid-cols-[5fr_12fr]">
  //     <div className=" text-white bg-blue-950 lg:hidden">
  //       <FilterSortBtns />
  //     </div>
  //     {/* <ProductsFilterSortDrawersWrapper /> */}
  //     <div className="hidden md:grid grid-cols-2 gap-4 row-start-1 col-start-1 row-span-2 w-full h-full bg-blue-800 text-white">
  //       <div className="p-4 flex flex-col gap-3 text-white">
  //         <h2 className="text-center text-xl font-black">FILTER BY</h2>
  //         <Filters filterOptions={filterOptions} />
  //       </div>
  //       <div className="p-4 flex flex-col gap-3 text-white">
  //         <h2 className="text-center text-xl font-black">SORT BY</h2>
  //         <Sortables sortOptions={sortOptions} />
  //       </div>
  //     </div>

  //     <CategoryBreadcrumbs categoryParts={categoryParts} />
  //     <div className="lg:col-start-2 lg:row-start-2 grid grid-rows-[auto_1fr]">
  //       <div className="mx-auto grid gap-2 grid-cols-[2rem_auto] place-items-center">
  //         <CategoryTitleIcon category={rootCategory} />

  //         <h1 className="text-4xl font-bold  text-center">
  //           {firstLetterToUpperCase(rootCategory)}{" "}
  //           {rootCategory !== leafCategory &&
  //             " / " + firstLetterToUpperCase(leafCategory)}
  //         </h1>
  //       </div>

  //       {/* <AppliedFilters /> */}
  //       <ProductsGrid products={products} />
  //     </div>
  //   </div>
  // );

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
