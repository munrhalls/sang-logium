"use client";

import Link from "next/link";
import { FaRegCircle } from "react-icons/fa";
import { AdaptiveCategoryIcon } from "@/app/components/ui/AdaptiveCategoryIcon";
import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
import { CloseDrawerButton } from "./CloseDrawerButton";
import { useSearchParams } from "next/navigation";

type SubCategory = {
  header?: string;
  name?: string;
  _key: string;
  subcategories?: SubCategory[];
};

export default function MobileCategoriesDrawer({
  categories,
}: {
  categories: ALL_CATEGORIES_QUERYResult;
}) {
  const searchParams = useSearchParams();
  const isOpen =
    searchParams.get("menu") === "true" &&
    searchParams.get("search") !== "true";
  const handleClick = () => {};

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
            <FaRegCircle className="mr-2 h-2 w-2" />
            <span className="text-lg">{sub.name}</span>
          </Link>
        )}
        {sub.subcategories && sub.subcategories.length > 0 && (
          <ul className="rounded py-2 pl-3 backdrop-brightness-95">
            {sub.subcategories.map((child: SubCategory) => (
              <li key={child._key}>
                <Link
                  href={`${baseUrl}/${sub.name?.toLowerCase().replace(/\s+/g, "-")}/${child.name?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center justify-start px-4 py-2 text-gray-800 hover:bg-gray-100"
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
    <div className="grid gap-6 md:grid-cols-2">
      {categories.map((category) => {
        const categoryPath = `/products/${category.name?.toLowerCase().replace(/\s+/g, "-")}`;
        return (
          <div key={category._id} className="space-y-2">
            <Link
              href={categoryPath}
              className="flex items-center text-2xl font-semibold hover:text-gray-600"
            >
              {category.icon && (
                <span className="mr-3">
                  <AdaptiveCategoryIcon title={category.icon} />
                </span>
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
  return (
    <div
      className={`pointer-events-auto absolute inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-slate-50 text-black transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="border-b border-gray-200 p-2">
          <div className="flex items-center justify-end">
            <CloseDrawerButton />
          </div>
        </div>
        <h1 className="my-2 ml-4 text-center text-3xl">Categories</h1>
      </div>
      {}
      <div
        className="flex-1 overflow-y-auto scroll-smooth pb-6"
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="grid gap-6 bg-white">{categoriesTreeUI}</div>
          <p className="mt-8 flex items-center justify-center text-gray-500">
            End.
          </p>
        </div>
      </div>
    </div>
  );
}
