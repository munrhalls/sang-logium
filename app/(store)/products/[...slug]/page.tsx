import getProductsByCategoryPath from "@/sanity/lib/products/getProductsByCategoryPath";
import ProductsGrid from "@/app/components/features/products-view/ProductsGrid";
import FilterSortBtns from "@/app/components/ui/buttons/FilterSortBtns";
import CategoryBreadcrumbs from "@/app/components/ui/breadcrumbs/CategoryBreadcrumbs";
import CategoryTitleIcon from "@/app/components/ui/icons/CategoryTitleIcon";
// import AppliedFilters from "@/app/components/ui/tag-elements/AppliedFilters";
import ProductsFilterSortDrawersWrapper from "@/app/components/ui/drawers/ProductsFilterSortDrawersWrapper";
import { firstLetterToUpperCase } from "@/lib/utils";
import Filters from "@/app/components/ui/filters/Filters";
import Sortables from "@/app/components/ui/sortables/Sortables";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slugs = (await params).slug;
  const path = slugs.join("/");
  const rootCategory = slugs[0];
  const leafCategory = slugs[slugs.length - 1];

  const products = await getProductsByCategoryPath(path);

  return (
    <div className="h-full isolate relative grid grid-rows-[auto_auto_1fr] lg:grid-rows-[3rem_1fr] lg:grid-cols-[5fr_12fr]">
      <div className=" text-white bg-blue-950 lg:hidden">
        <FilterSortBtns />
      </div>
      {/* <ProductsFilterSortDrawersWrapper /> */}
      <div className="hidden md:grid grid-cols-2 gap-4 row-start-1 col-start-1 row-span-2 w-full h-full bg-blue-800 text-white">
        <div className="p-4 flex flex-col gap-3 text-white">
          <h2 className="text-center text-xl font-black">FILTER BY</h2>
          <Filters />
        </div>
        <div className="p-4 flex flex-col gap-3 text-white">
          <h2 className="text-center text-xl font-black">SORT BY</h2>
          <Sortables />
        </div>
      </div>

      <CategoryBreadcrumbs slugs={slugs} />
      <div className="lg:col-start-2 lg:row-start-2 grid grid-rows-[auto_1fr]">
        <div className="mx-auto grid gap-2 grid-cols-[2rem_auto] place-items-center">
          <CategoryTitleIcon category={rootCategory} />

          <h1 className="text-4xl font-bold  text-center">
            {firstLetterToUpperCase(rootCategory)}{" "}
            {rootCategory !== leafCategory &&
              " / " + firstLetterToUpperCase(leafCategory)}
          </h1>
        </div>

        {/* <AppliedFilters /> */}
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}
