import ProductsGrid from "@/app/components/features/products-view/ProductsGrid";
import CategoryBreadcrumbs from "@/app/components/ui/breadcrumbs/CategoryBreadcrumbs";
import CategoryTitleIcon from "@/app/components/ui/icons/CategoryTitleIcon";
import Filters from "@/app/components/ui/filters/Filters";
import { getFiltersForCategoryPathAction } from "@/app/actions/getFiltersForCategoryPathAction";
import getFilterObjects from "../helpers/getFilterObjects";
import getProductsByCategoryPathAndSelectedFiltersAndSorting from "@/sanity/lib/products/getProductsByCategoryPathAndSelectedFiltersAndSorting";
export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { [key: string]: string | string[] };
}) {
  const path = (await params).category;
  const categoryParts = path.split("/");
  const rootCategory = categoryParts[0];
  const leafCategory = categoryParts[categoryParts.length - 1];

  // Convert searchParams to filter objects
  const filterObjects = getFilterObjects(searchParams);
  const defaultSorting = { field: "name", direction: "asc" };

  // Start both promises in parallel
  const productsPromise = getProductsByCategoryPathAndSelectedFiltersAndSorting(
    path,
    filterObjects
  );
  const filtersPromise = getFiltersForCategoryPathAction(path);

  // Wait for both promises to resolve
  const [products, filterOptions] = await Promise.all([
    productsPromise.catch((error) => {
      console.error("Failed to fetch products:", error);
      return [];
    }),
    filtersPromise.catch((error) => {
      console.error("Failed to fetch filters:", error);
      return [];
    }),
  ]);

  console.log(products, "products");
  console.log(filterOptions, "filterOptions");

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-4">
      <CategoryBreadcrumbs categoryParts={categoryParts} />
      <div className="flex items-center gap-4">
        <CategoryTitleIcon category={rootCategory} />
        <h1 className="text-2xl">{leafCategory}</h1>
      </div>
      <div>
        <Filters filterOptions={filterOptions} />
      </div>
      <ProductsGrid products={products} />
    </div>
  );
}
