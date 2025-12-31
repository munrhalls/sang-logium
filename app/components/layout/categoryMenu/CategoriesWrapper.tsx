import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import CategoriesNav from "./CategoriesNav";

export default async function CategoriesWrapper() {
  const menuItems = await getAllCategories();
  console.log("CATEGORIES", menuItems);

  return <CategoriesNav menuItems={menuItems} />;
}
