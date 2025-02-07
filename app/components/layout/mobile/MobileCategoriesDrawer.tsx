"use client";

import { useStore } from "../../../../store";
import { CategoryTree } from "@/lib/flatToTree";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaRegCircle, FaTimes } from "react-icons/fa";
import { getCategoryIcon } from "@/lib/getCategoryIcon";

export default function MobileCategoriesDrawer({
  categories,
}: {
  categories: CategoryTree[];
}) {
  const isCategoriesDrawerOpen = useStore(
    (state) => state.isCategoriesDrawerOpen
  );
  const toggleCategoriesDrawer = useStore(
    (state) => state.toggleCategoriesDrawer
  );
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
    toggleCategoriesDrawer();
  };

  const toPath = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className={`absolute inset-0 overflow-hidden h-full w-full z-50 pointer-events-auto  bg-slate-50 text-black transition-transform duration-300 flex flex-col ${
        isCategoriesDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="p-2 border-b border-gray-200">
          <div className="flex justify-end items-center">
            <button
              onClick={toggleCategoriesDrawer}
              className="flex gap-1 items-center justify-center text-black"
            >
              <span>CLOSE</span>

              <FaTimes size={14} />
            </button>
          </div>
        </div>
        <h1 className="text-3xl text-center my-2 ml-4">Categories</h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scroll-smooth pb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <Link
                  href={`/category/${toPath(category.name)}`}
                  onClick={() =>
                    handleClick(`/category/${toPath(category.name)}`)
                  }
                  className="flex items-center text-2xl font-semibold hover:text-gray-600"
                >
                  {category.icon && (
                    <span className="mr-3">
                      {getCategoryIcon(category.icon)}
                    </span>
                  )}
                  <span
                    className={`${category.name === "On Sale" ? "text-orange-500" : ""}`}
                  >
                    {category.name}
                  </span>
                </Link>

                <div className="ml-6 space-y-1">
                  {category?.children?.map((sub) => (
                    <div key={category._id + sub.name}>
                      <Link
                        href={`/category/${toPath(category.name)}/${toPath(sub.name)}`}
                        onClick={() =>
                          handleClick(
                            `/category/${toPath(category.name)}/${toPath(sub.name)}`
                          )
                        }
                        className="mt-2 flex items-center text-gray-600 hover:text-black"
                      >
                        <FaRegCircle className="mr-2 w-2 h-2" />
                        <span className="text-lg">{sub?.name}</span>
                      </Link>
                      {sub.children && (
                        <ul className="pl-3 py-2 backdrop-brightness-95 rounded">
                          {sub.children.map((child) => (
                            <li
                              key={`${category?.name?.toLowerCase()}-${sub?.name?.toLowerCase()}-${child?.name?.toLowerCase()}`}
                            >
                              <Link
                                href={`/category/${toPath(category.name)}/${toPath(sub.name)}/${toPath(child.name)}`}
                                onClick={() =>
                                  handleClick(
                                    `/category/${toPath(category.name)}/${toPath(sub.name)}/${toPath(child.name)}`
                                  )
                                }
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
          <p className="mt-8 flex justify-center items-center text-gray-500">
            End.
          </p>
        </div>
      </div>
    </div>
  );
}
