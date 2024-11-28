"use client";
// components/DesktopCategoriesNav.tsx
import { useState } from "react";

import Link from "next/link";
import {
  FaHeadphones,
  FaMicrophone,
  FaMusic,
  FaToolbox,
  FaChevronDown,
} from "react-icons/fa";

const categories = [
  {
    name: "Headphones",
    icon: <FaHeadphones />,
    subcategories: [
      "Over-Ear",
      "In-Ear",
      "On-Ear",
      "Wireless",
      "Noise-Cancelling",
    ],
  },
  {
    name: "Studio Equipment",
    icon: <FaMicrophone />,
    subcategories: [
      "Microphones",
      "Audio Interfaces",
      "Studio Monitors",
      "Recording Bundles",
    ],
  },
  {
    name: "Accessories",
    icon: <FaToolbox />,
    subcategories: [
      "Cables",
      "Cases",
      "Stands",
      "Adapters",
      "Replacement Parts",
    ],
  },
  {
    name: "Hi-Fi Audio",
    icon: <FaMusic />,
    subcategories: ["Amplifiers", "DACs", "Speakers", "Turntables"],
  },
];

export default function DesktopCategoriesNav() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <nav className="hidden lg:block w-full bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex justify-center items-center h-12">
          {categories.map((category) => (
            <li
              key={category.name}
              className="relative"
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <button
                className={`flex items-center px-4 h-12 text-white hover:text-yellow-400 transition-colors ${
                  activeCategory === category.name ? "text-yellow-400" : ""
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <FaChevronDown className="ml-1 w-3 h-3" />
              </button>

              {/* Dropdown */}
              {activeCategory === category.name && (
                <div className="absolute top-12 left-0 w-48 bg-white shadow-lg rounded-b-lg overflow-hidden transition-all transform opacity-100 scale-100">
                  <div className="py-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        {sub}
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
