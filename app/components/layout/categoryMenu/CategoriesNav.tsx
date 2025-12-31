"use client";

import Link from "next/link";
import { FaChevronDown, FaRegCircle } from "react-icons/fa";
import { useState } from "react";
import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
import { SubcategoryList } from "./SubcategoryList";

type MenuItem = NonNullable<ALL_CATEGORIES_QUERYResult>[0];

const MenuHeader = ({ title }: { title: string | null }) => (
  <h3 className="px-4 py-2 font-black text-gray-500">{title}</h3>
);

const MenuLink = ({
  title,
  href,
  onClick,
}: {
  title: string | null;
  href: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="group flex min-w-0 items-center rounded-md px-4 py-2 text-gray-800 transition-all duration-100 hover:bg-gray-300 hover:text-yellow-600"
  >
    <FaRegCircle className="mr-2 text-sm" />
    <span className="block overflow-hidden whitespace-nowrap">{title}</span>
  </Link>
);

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
