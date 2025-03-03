import getProductsByCategoryPath from "@/sanity/lib/products/getProductsByCategoryPath";
import ProductsGrid from "@/app/components/features/products-view/ProductsGrid";
import FilterSortBtns from "@/app/components/ui/buttons/FilterSortBtns";
import CategoryBreadcrumbs from "@/app/components/ui/breadcrumbs/CategoryBreadcrumbs";
import CategoryTitleIcon from "@/app/components/ui/icons/CategoryTitleIcon";
// import AppliedFilters from "@/app/components/ui/tag-elements/AppliedFilters";
import ProductsFilterSortDrawersWrapper from "@/app/components/ui/drawers/ProductsFilterSortDrawersWrapper";
import { firstLetterToUpperCase } from "@/lib/utils";

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
    <div className="h-full isolate relative grid grid-rows-[auto_auto_1fr] lg:grid-rows-[3rem_1fr] lg:grid-cols-[1fr_1fr_10fr]">
      <div className=" text-white bg-blue-950 lg:hidden">
        <FilterSortBtns />
      </div>
      <ProductsFilterSortDrawersWrapper />
      <CategoryBreadcrumbs slugs={slugs} />
      <div className="lg:col-start-3 lg:row-start-2 grid grid-rows-[auto_1fr]">
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
