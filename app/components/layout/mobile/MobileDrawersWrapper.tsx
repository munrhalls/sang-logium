import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import MobileCategoriesDrawer from "./MobileCategoriesDrawer";
import MobileSearchDrawer from "./MobileSearchDrawer";

export default async function MobileDrawersWrapper() {
  const categories = await getAllCategories();

  return (
    <>
      <MobileCategoriesDrawer categories={categories} />
      <MobileSearchDrawer />
    </>
  );
}
