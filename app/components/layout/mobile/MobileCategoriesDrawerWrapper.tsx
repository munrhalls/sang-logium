import { flatToTree } from "@/lib/flatToTree";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import MobileCategoriesDrawer from "./MobileCategoriesDrawer";

export default async function MobileCategoriesDrawerWrapper() {
  const categories = await getAllCategories();

  if (!categories || categories.length === 0) {
    return (
      <div
        className={`h-full w-full overflow-hidden inset-0 lg:flex bg-gray-900 items-center justify-center `}
      >
        <p className="text-xl text-white">
          Connection issue. Could not load categories. Please refresh page. If
          that does not work - we are working on solving that issue as soon as
          possible. Please try again later.
        </p>
      </div>
    );
  }

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
