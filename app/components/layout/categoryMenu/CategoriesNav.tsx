"use client";
import Link from "next/link";
import { getCategoryIcon } from "@/lib/getCategoryIcon";
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
            <h3 className="px-4 py-2  font-black text-gray-500">
              {sub.header}
            </h3>
          )}
          {sub.name && (
            <Link
              href={`${baseUrl}/${sub.name?.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-300 hover:text-yellow-600 transition-all duration-100 rounded-md group min-w-0"
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
    <nav className="hidden h-11 lg:flex items-center justify-center bg-black ">
      <div className="h-full max-w-7xl mx-auto lg:px-1 xl:px-4 lg:flex items-center justify-center">
        <ul className="h-full flex items-center">
          {categories.map((category, index) => {
            return (
              <li
                key={category._id}
                className="relative h-full "
                onMouseEnter={() => setActiveCategory(category.name)}
                onMouseLeave={() => setActiveCategory(undefined)}
              >
                <Link
                  href={`/products/${category.name?.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`h-full flex justify-around items-center lg:px-1 xl:px-4 text-white hover:text-yellow-600 transition-colors
                ${activeCategory === category.name ? "text-yellow-400" : ""} ${index === 6 ? "text-orange-600 font-black" : ""}`}
                >
                  {category.icon && (
                    <span className="mr-2 ">
                      {getCategoryIcon(category.icon)}
                    </span>
                  )}
                  <span className="truncate text-sm md:text-sm xl:text-md 2xl:text-lg">
                    {category.name}
                  </span>
                  <FaChevronDown className="ml-2 w-3 h-3" />
                </Link>
                {activeCategory === category.name && category.subcategories && (
                  <div className="absolute z-50 left-0 w-72 bg-white shadow-lg rounded-b-lg">
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
