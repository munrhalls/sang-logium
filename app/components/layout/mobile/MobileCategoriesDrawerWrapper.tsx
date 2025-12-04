import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import MobileCategoriesDrawer from "./MobileCategoriesDrawer";
import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

export default async function MobileCategoriesDrawerWrapper() {
  const categories: ALL_CATEGORIES_QUERYResult = await getAllCategories();

  if (!categories || categories.length === 0) {
    return (
      <div
        className={`inset-0 h-full w-full items-center justify-center overflow-hidden bg-gray-900 lg:flex`}
      >
        <p className="text-xl text-white">
          Connection issue. Could not load categories. Please refresh page. If
          that does not work - we are working on solving that issue as soon as
          possible. Please try again later.
        </p>
      </div>
    );
  }
  const sortedCategories = [...categories].sort((a, b) => {
    if (a?.order === undefined || b?.order === undefined) return 0;
    return a?.order - b?.order;
  });

  return <MobileCategoriesDrawer categories={sortedCategories} />;
}
