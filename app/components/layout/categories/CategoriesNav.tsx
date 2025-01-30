"use client";

import Link from "next/link";
import { getCategoryIcon } from "@/lib/getCategoryIcon";
import { CategoryTree } from "@/lib/flatToTree";
import { FaChevronDown, FaRegCircle } from "react-icons/fa";
import { useState } from "react";

export default function CategoriesNav({
  categories,
}: {
  categories: CategoryTree[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    undefined
  );
  return (
    <nav className="hidden lg:flex items-center justify-center z-50 w-full bg-gray-900">
      <div className="h-full max-w-7xl mx-auto px-4">
        <ul className="h-full flex justify-center items-center">
          {categories.map((category) => (
            <li
              key={category._id}
              className="h-full relative"
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(undefined)}
            >
              <Link
                href={`/category/${category.name}`}
                className={`h-full flex items-center py-2 px-4 text-white hover:text-yellow-400 transition-colors ${
                  activeCategory === category.name ? "text-yellow-400" : ""
                }`}
              >
                {category.icon && (
                  <span className="mr-1 text-md">
                    {getCategoryIcon(category.icon)}
                  </span>
                )}
                <span
                  className={`md:text-lg xl:text-lg ${category.name === "On Sale" ? "text-orange-500" : ""}`}
                >
                  {category.name}
                </span>

                <FaChevronDown className="ml-2 text-xl w-3 h-3" />
              </Link>

              {/* Dropdown */}
              {activeCategory === category.name && (
                <div className="absolute z-50 left-0 w-72 bg-white shadow-lg rounded-b-lg overflow-hidden transition-all duration-700 ease-in-out transform opacity-100 scale-100">
                  <div className="py-2">
                    {category?.children?.map((sub, i) => (
                      <div key={`${category._id}-${i}-${sub.name}`}>
                        <Link
                          href={`/category/${category?.name?.toLowerCase()}/${sub?.name?.toLowerCase()}`}
                          className="flex justify-start items-center px-4 py-2 text-xs text-gray-800 hover:bg-gray-100"
                        >
                          <FaRegCircle className="mr-2" />
                          <span className="text-xl"> {sub?.name}</span>
                        </Link>
                        {sub.children && (
                          <ul className="pl-6 my-2 backdrop-brightness-90">
                            {sub.children.map((child) => (
                              <li
                                key={`${category?.name?.toLowerCase()}-${sub?.name?.toLowerCase()}-${child?.name?.toLowerCase()}`}
                              >
                                <Link
                                  href={`/category/${category?.name?.toLowerCase()}/${sub?.name?.toLowerCase()}/${child?.name?.toLowerCase()}`}
                                  className="flex justify-start items-center px-4 py-2 text-xs text-gray-800 hover:bg-gray-100"
                                >
                                  <FaRegCircle className="mr-2" />

                                  <span className="text-xl">{child.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
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
