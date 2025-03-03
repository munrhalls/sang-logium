import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import MobileCategoriesDrawer from "./MobileCategoriesDrawer";
import Link from "next/link";
import { FaRegCircle } from "react-icons/fa";
import { getCategoryIcon } from "@/lib/getCategoryIcon";
import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

type SubCategory = {
  header?: string;
  name?: string;
  _key: string;
  subcategories?: SubCategory[];
};

export default async function MobileCategoriesDrawerWrapper() {
  const categories: ALL_CATEGORIES_QUERYResult = await getAllCategories();

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

  const sortedCategories = [...categories].sort((a, b) => {
    if (a?.order === undefined || b?.order === undefined) return 0;
    return a?.order - b?.order;
  });

  const renderSubcategories = (
    subcategories: SubCategory[],
    baseUrl: string
  ) => {
    return subcategories.map((sub) => (
      <div key={sub._key}>
        {sub.header && (
          <h3 className="font-bold text-gray-500">{sub.header}</h3>
        )}
        {sub.name && (
          <Link
            href={`${baseUrl}/${sub.name?.toLowerCase().replace(/\s+/g, "-")}`}
            className="mt-2 flex items-center text-gray-600 hover:text-black"
          >
            <FaRegCircle className="mr-2 w-2 h-2" />
            <span className="text-lg">{sub.name}</span>
          </Link>
        )}
        {sub.subcategories && sub.subcategories.length > 0 && (
          <ul className="pl-3 py-2 backdrop-brightness-95 rounded">
            {sub.subcategories.map((child: SubCategory) => (
              <li key={child._key}>
                <Link
                  href={`${baseUrl}/${sub.name?.toLowerCase().replace(/\s+/g, "-")}/${child.name?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex justify-start items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <FaRegCircle className="mr-2" />
                  <span className="text-md">{child.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  const categoriesTreeUI = (
    <div className="grid md:grid-cols-2 gap-6">
      {sortedCategories.map((category) => {
        const categoryPath = `/products/${category.name?.toLowerCase().replace(/\s+/g, "-")}`;

        return (
          <div key={category._id} className="space-y-2">
            <Link
              href={categoryPath}
              className="flex items-center text-2xl font-semibold hover:text-gray-600"
            >
              {category.icon && (
                <span className="mr-3">{getCategoryIcon(category.icon)}</span>
              )}
              <span
                className={`${category.name === "On Sale" ? "text-orange-500" : ""}`}
              >
                {category.name}
              </span>
            </Link>

            {category.subcategories && category.subcategories.length > 0 && (
              <div className="ml-6 space-y-1">
                {renderSubcategories(category.subcategories, categoryPath)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return <MobileCategoriesDrawer categoriesTreeUI={categoriesTreeUI} />;
}
