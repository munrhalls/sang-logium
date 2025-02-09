import { flatToTree } from "@/lib/flatToTree";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import MobileCategoriesDrawer from "./MobileCategoriesDrawer";
import Link from "next/link";
import { FaRegCircle } from "react-icons/fa";
import { getCategoryIcon } from "@/lib/getCategoryIcon";

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

  const categoriesTreeUI = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {orderedCategoriesTree.map((category) => (
        <div key={`${category._id}`} className="space-y-2">
          <Link
            href={`/products/${category.path}`}
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

          <div className="ml-6 space-y-1">
            {category?.children?.map((sub) => (
              <div key={`${sub._id}`}>
                <Link
                  href={`/products/${sub.path}`}
                  className="mt-2 flex items-center text-gray-600 hover:text-black"
                >
                  <FaRegCircle className="mr-2 w-2 h-2" />
                  <span className="text-lg">{sub?.name}</span>
                </Link>
                {sub.children && (
                  <ul className="pl-3 py-2 backdrop-brightness-95 rounded">
                    {sub.children.map((child) => (
                      <li key={`${child._id}`}>
                        <Link
                          href={`/products/${child.path}`}
                          className="flex justify-start items-center px-4 py-2  text-gray-800 hover:bg-gray-100"
                        >
                          <FaRegCircle className="mr-2" />
                          <span className="text-md">{child.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // console.dir(orderedCategoriesTree, { depth: null });
  // console.log(orderedCategoriesTree, "^orderedCategoriesTree");
  return <MobileCategoriesDrawer categoriesTreeUI={categoriesTreeUI} />;
}
