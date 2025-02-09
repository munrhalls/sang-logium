import getProductsByCategoryPath from "@/sanity/lib/products/getProductsByCategoryPath";
// import ProductsGrid from "@/app/components/features/products/ProductsGrid";
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
    <div className=" bg-gray-100">
      <div className="bg-slate-900 text-white">
        <FilterSortBtns />
      </div>
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <ProductsFilterSortDrawersWrapper />
        </div>
        <CategoryBreadcrumbs slugs={slugs} />
        <div className="flex justify-center items-center">
          <CategoryTitleIcon category={rootCategory} />
          <h1 className="text-4xl font-bold mb-6 text-center">
            {leafCategory}
          </h1>
          <AppliedFilters />
          {/* <ProductsGrid products={products} /> */}
        </div>
      </div>
    </div>
  );
}
