import { flatToTree } from "@/lib/flatToTree";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import MobileCategoriesDrawer from "./MobileCategoriesDrawer";

export default async function MobileCategoriesDrawerWrapper() {
  const categories = await getAllCategories();

  const categoriesTree = flatToTree(categories);
  const CATEGORY_ORDER = [
    "Headphones",
    "Hi-Fi Audio",
    "Studio Equipment",
    "Accessories",
    "On Sale",
  ];

  const orderedCategoriesTree = categoriesTree.sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.name!) - CATEGORY_ORDER.indexOf(b.name!)
  );

  return <MobileCategoriesDrawer categories={orderedCategoriesTree} />;
}
