// TODOs - reorg all towards virtual file system taxonomy
// TODO 1 delete settings doc in studio, upload new one
// TODO 2 delete all categories
// TODO 3 delete all categories fetching code in lib/products
// TODO 4 run virtual taxonomy seed script
// TODO Core concept: virtual taxonomy catalogue (virtual file system) lives in the recurisve catalogueitemType schema; which is object, so it lives in 'settings' container; and then, products wire up to slots inside catalogue - a product can wire up to many places; products fetching via groq, it filters via path comparision - a slot clicked, will give all descendants that start with it in terms of path; descendant slots contain product wirings - those will be returned;

import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import CategoriesNav from "./CategoriesNav";

export default async function CategoriesWrapper() {
  const menuItems = await getAllCategories();
  console.log("CATEGORIES", menuItems);

  return <CategoriesNav menuItems={menuItems} />;
}
