import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import CategoriesNav from "./CategoriesNav";

export default async function CategoriesWrapper() {
  const categories = await getAllCategories();

  categories.sort((a, b) => {
    if (a?.order === undefined || b?.order === undefined) return 0;
    return a?.order - b?.order;
  });

  return <CategoriesNav categories={categories} />;
}
