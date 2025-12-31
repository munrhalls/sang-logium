import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import CategoriesNav from "./CategoriesNav";
import { buildCategoryTree } from "@/lib/utils/formatting";

export default async function CategoriesWrapper() {
  const categories = await getAllCategories();

  // console.log("categories", categories);

  // categories.sort((a, b) => {
  //   if (a?.order === undefined || b?.order === undefined) return 0;
  //   return a?.order - b?.order;
  // });

  const categoryTree = buildCategoryTree(categories);

  console.log("categoryTree", categoryTree);

  // console.dir(categories, { depth: null });

  return <CategoriesNav categories={categoryTree} />;
}
