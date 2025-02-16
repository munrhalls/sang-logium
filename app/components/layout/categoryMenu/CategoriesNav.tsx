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
              className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              <FaRegCircle className="mr-2 text-sm" />
              <span>{sub.name}</span>
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
    <nav className="hidden lg:flex items-center justify-center bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center">
          {categories.map((category) => (
            <li
              key={category._id}
              className="relative"
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(undefined)}
            >
              <Link
                href={`/products/${category.name?.toLowerCase().replace(/\s+/g, "-")}`}
                className={`flex items-center p-4 text-white hover:text-yellow-400 transition-colors
                  ${activeCategory === category.name ? "text-yellow-400" : ""}`}
              >
                {category.icon && (
                  <span className="mr-2">{getCategoryIcon(category.icon)}</span>
                )}
                <span className="text-lg">{category.name}</span>
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
          ))}
        </ul>
      </div>
    </nav>
  );
}
