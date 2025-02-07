import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import MobileMenu from "./MobileMenu";
import MobileCategoriesDrawer from "./MobileCategoriesDrawer";

export default async function MobileWrapper() {
  const categories = await getAllCategories();

  return (
    <>
      {/* <MobileMenu /> */}
      <MobileCategoriesDrawer categories={categories} />
    </>
  );
}
