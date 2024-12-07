"use client";
import { useState } from "react";

import Link from "next/link";
import { getCategoryIcon } from "@/lib/getCategoryIcon";
import { Category } from "@/sanity.types";
import { flatToTree } from "@/lib/flatToTree";
import { FaChevronDown, FaRegCircle } from "react-icons/fa";
// const categories = [
//   {
//     name: "Headphones",
//     icon: <FaHeadphones />,
//     subcategories: [
//       "Over-Ear",
//       "In-Ear",
//       "On-Ear",
//       "Wireless",
//       "Noise-Cancelling",
//     ],
//   },
//   {
//     name: "Studio Equipment",
//     icon: <FaMicrophone />,
//     subcategories: [
//       "Microphones",
//       "Audio Interfaces",
//       "Studio Monitors",
//       "Recording Bundles",
//     ],
//   },
//   {
//     name: "Accessories",
//     icon: <FaToolbox />,
//     subcategories: [
//       "Cables",
//       "Cases",
//       "Stands",
//       "Adapters",
//       "Replacement Parts",
//     ],
//   },
//   {
//     name: "Hi-Fi Audio",
//     icon: <FaMusic />,
//     subcategories: ["Amplifiers", "DACs", "Speakers", "Turntables"],
//   },
// ];

export default function DesktopCategoriesNav({
  categories,
}: {
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    undefined
  );

  if (!categories || categories.length === 0) {
    return (
      <div className="hidden lg:flex w-full bg-gray-900 items-center justify-center ">
        <p className="text-xl text-white">
          Oops! It appears we have a slight connection issue...could not load
          categories. Please try refreshing page.
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

  return (
    <nav className="hidden lg:block w-full bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex justify-center items-center h-12">
          {orderedCategoriesTree.map((category) => (
            <li
              key={category._id}
              className="relative"
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(undefined)}
            >
              <button
                className={`flex items-center px-4 h-12  text-white hover:text-yellow-400 transition-colors ${
                  activeCategory === category.name ? "text-yellow-400" : ""
                }`}
              >
                {category.icon && (
                  <span className="mr-1 text-md">
                    {getCategoryIcon(category.icon)}
                  </span>
                )}
                <span
                  className={`text-2xl ${category.name === "On Sale" ? "text-orange-500" : ""}`}
                >
                  {category.name}
                </span>

                <FaChevronDown className="ml-2 text-xl w-3 h-3" />
              </button>

              {/* Dropdown */}
              {activeCategory === category.name && (
                <div className="absolute top-12 left-0 w-48 bg-white shadow-lg rounded-b-lg overflow-hidden transition-all duration-700 ease-in-out transform opacity-100 scale-100">
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
                          <ul className="pl-6 backdrop-brightness-90">
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
