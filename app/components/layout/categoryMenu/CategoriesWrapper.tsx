import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import CategoriesNav from "./CategoriesNav";

export default async function CategoriesWrapper() {
  const categories = await getAllCategories();
  console.log(categories, "CATEGORIES!!!!");
  // const categoriesTree = flatToTree(categories);
  // console.log(categoriesTree);

  // const CATEGORY_ORDER = [
  //   "Headphones",
  //   "Hi-Fi Audio",
  //   "Studio Equipment",
  //   "Accessories",
  //   "On Sale",
  // ];

  // const orderedCategoriesTree = categoriesTree.sort(
  //   (a, b) => CATEGORY_ORDER.indexOf(a.name!) - CATEGORY_ORDER.indexOf(b.name!)
  // );

  return <CategoriesNav categories={categories} />;
}
