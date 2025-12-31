"use client";

import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
import { SubcategoryList } from "./SubcategoryList";

export default function CategoriesNav({
  menuItems,
}: {
  menuItems: ALL_CATEGORIES_QUERYResult;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (!menuItems) return null;

  return (
    <nav className="hidden h-11 items-center justify-center bg-black lg:flex">
      <div className="mx-auto h-full max-w-7xl px-4">
        <ul className="flex h-full items-center gap-6">
          {menuItems.map((item) => {
            const href = item.slug ? `/products/${item.slug}` : "#";
            const isActive = activeCategory === item.title;

            const isHighlighted = item.isHighlighted ?? false;

            return (
              <li
                key={item._key}
                className="relative flex h-full items-center"
                onMouseEnter={() => setActiveCategory(item.title)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-yellow-600 ${isActive ? "text-yellow-400" : "text-white"} ${isHighlighted ? "font-black text-orange-600" : ""} `}
                >
                  <span>{item.title}</span>
                  <FaChevronDown
                    className={`ml-2 h-3 w-3 transition-transform ${isActive ? "rotate-180" : ""}`}
                  />
                </Link>

                {isActive && item.children && item.children.length > 0 && (
                  <div className="absolute left-0 top-full z-50 w-72 rounded-b-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5">
                    <div className="py-4">
                      <SubcategoryList
                        items={item.children}
                        parentPath={href}
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
