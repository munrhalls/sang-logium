import getProductsByCategoryPath from "@/sanity/lib/products/getProductsByCategoryPath";
import ProductsGrid from "@/app/components/features/products-view/ProductsGrid";
import FilterSortBtns from "@/app/components/ui/buttons/FilterSortBtns";
import CategoryBreadcrumbs from "@/app/components/ui/breadcrumbs/CategoryBreadcrumbs";
import CategoryTitleIcon from "@/app/components/ui/icons/CategoryTitleIcon";
import AppliedFilters from "@/app/components/ui/tag-elements/AppliedFilters";
import ProductsFilterSortDrawersWrapper from "@/app/components/ui/drawers/ProductsFilterSortDrawersWrapper";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slugs = (await params).slug;
  const path = slugs.join("/");
  const rootCategory = slugs[0];
  const leafCategory = slugs[slugs.length - 1];

  const products = await getProductsByCategoryPath(path);

  console.log(products, " ... products");

  return (
    <div className="h-full isolate relative grid grid-rows-[auto_auto_1fr] ">
      <div className=" text-white bg-blue-950">
        <FilterSortBtns />
      </div>
      <ProductsFilterSortDrawersWrapper />
      <CategoryBreadcrumbs slugs={slugs} />
      <div className="flex justify-center items-center">
        <CategoryTitleIcon category={rootCategory} />
        <h1 className="text-4xl font-bold mb-6 text-center">{leafCategory}</h1>
        {/* <AppliedFilters /> */}
      </div>
      {/* <ProductsGrid products={products} /> */}
    </div>
  );
}
