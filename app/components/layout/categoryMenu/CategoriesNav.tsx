"use client";
import Link from "next/link";
import { getCategoryIcon } from "@/app/components/ui/AdaptiveCategoryIcon";
import { FaChevronDown, FaRegCircle } from "react-icons/fa";
import { useState } from "react";
import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
type SubCategory = {
  header?: string;
  name?: string;
  _key: string;
  subcategories?: Array<{
    name?: string;
    _key: string;
  }>;
};
function SubcategoryList({
  items,
  baseUrl,
}: {
  items: NonNullable<SubCategory[]>;
  baseUrl: string;
}) {
  return (
    <div className="pl-4">
      {items.map((sub) => (
        <div key={sub._key}>
          {sub.header && (
            <h3 className="px-4 py-2 font-black text-gray-500">{sub.header}</h3>
          )}
          {sub.name && (
            <Link
              href={`${baseUrl}/${sub.name?.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex min-w-0 items-center rounded-md px-4 py-2 text-gray-800 transition-all duration-100 hover:bg-gray-300 hover:text-yellow-600"
            >
              <FaRegCircle className="mr-2 text-sm" />
              <span className="block overflow-hidden whitespace-nowrap">
                {sub.name}
              </span>
            </Link>
          )}
          {sub.subcategories && (
            <SubcategoryList
              items={sub.subcategories}
              baseUrl={`${baseUrl}/${sub.name?.toLowerCase().replace(/\s+/g, "-")}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
export default function CategoriesNav({
  categories,
}: {
  categories: ALL_CATEGORIES_QUERYResult;
}) {
  const [activeCategory, setActiveCategory] = useState<string>();
  return (
    <nav className="hidden h-11 items-center justify-center bg-black lg:flex">
      <div className="mx-auto h-full max-w-7xl items-center justify-center lg:flex lg:px-1 xl:px-4">
        <ul className="flex h-full items-center">
          {categories.map((category, index) => {
            return (
              <li
                key={category._id}
                className="relative h-full"
                onMouseEnter={() => setActiveCategory(category.name)}
                onMouseLeave={() => setActiveCategory(undefined)}
              >
                <Link
                  href={`/products/${category.name?.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`flex h-full items-center justify-around text-white transition-colors hover:text-yellow-600 lg:px-1 xl:px-4 ${activeCategory === category.name ? "text-yellow-400" : ""} ${index === 6 ? "font-black text-orange-600" : ""}`}
                >
                  {category.icon && (
                    <span className="mr-2">
                      {getCategoryIcon(category.icon)}
                    </span>
                  )}
                  <span className="xl:text-md truncate text-sm md:text-sm 2xl:text-lg">
                    {category.name}
                  </span>
                  <FaChevronDown className="ml-2 h-3 w-3" />
                </Link>
                {activeCategory === category.name && category.subcategories && (
                  <div className="absolute left-0 z-50 w-72 rounded-b-lg bg-white shadow-lg">
                    <div className="py-2">
                      <SubcategoryList
                        items={category.subcategories}
                        baseUrl={`/products/${category.name?.toLowerCase().replace(/\s+/g, "-")}`}
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
