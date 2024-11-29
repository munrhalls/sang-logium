"use client";
import { useState } from "react";

import Link from "next/link";

import { Category } from "@/sanity.types";

import {
  FaHeadphones,
  FaMicrophone,
  FaMusic,
  FaChevronDown,
} from "react-icons/fa";
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
          categories. please refresh page.
        </p>
      </div>
    );
  }

  const getIcon = (title: string | undefined) => {
    switch (title) {
      case "headphones":
        return <FaHeadphones />;
      case "microphone":
        return <FaMicrophone />;
      default:
        return <FaMusic />;
    }
  };
  console.log("Category structure:", JSON.stringify(categories, null, 2));

  return (
    <nav className="hidden lg:block w-full bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex justify-center items-center h-12">
          {categories.map((category) => (
            <li
              key={category._id}
              className="relative"
              onMouseEnter={() => setActiveCategory(category.title)}
              onMouseLeave={() => setActiveCategory(undefined)}
            >
              <button
                className={`flex items-center px-4 h-12 text-white hover:text-yellow-400 transition-colors ${
                  activeCategory === category.title ? "text-yellow-400" : ""
                }`}
              >
                <span className="mr-1"> {getIcon(category.icon)}</span>
                <span>{category.title}</span>

                <FaChevronDown className="ml-1 w-3 h-3" />
              </button>

              {/* Dropdown */}
              {activeCategory === category.title && (
                <div className="absolute top-12 left-0 w-48 bg-white shadow-lg rounded-b-lg overflow-hidden transition-all duration-700 ease-in-out transform opacity-100 scale-100">
                  <div className="py-2">
                    {category?.subcategories?.map((sub, i) => (
                      <Link
                        key={`${category._id}-${i}-${sub.name}`}
                        href={`/category/${category?.title?.toLowerCase()}/${sub?.name?.toLowerCase()}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        {sub?.name}
                      </Link>
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
