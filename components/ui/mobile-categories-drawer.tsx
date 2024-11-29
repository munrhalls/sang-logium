"use client";

import { useStore } from "../../store";
import { useEffect, useState } from "react";

import Link from "next/link";

import { Category } from "@/sanity.types";

import { FaTimes } from "react-icons/fa";
import {
  FaHeadphones,
  FaMicrophone,
  FaMusic,
  FaChevronDown,
  FaRegCircle,
} from "react-icons/fa";

export default function MobileCategoriesDrawer({
  categories,
}: {
  categories: Category[];
}) {
  const isCategoriesDrawerOpen = useStore(
    (state) => state.isCategoriesDrawerOpen
  );
  const toggleCategoriesDrawer = useStore(
    (state) => state.toggleCategoriesDrawer
  );

  const [isMounted, setIsMounted] = useState(false);

  // for hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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

  return (
    <div
      className={`z-50 pointer-events-auto fixed top-[60px] left-0 bottom-[60px] bg-white text-black transition-transform duration-300 flex flex-col ${
        isCategoriesDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ width: "90%" }}
    >
      {/* Fixed header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-end items-center">
          <button
            onClick={toggleCategoriesDrawer}
            className="flex gap-1 items-center justify-center text-black"
          >
            <span>Close</span>

            <FaTimes size={10} />
          </button>
        </div>
      </div>
      <h1 className="text-4xl text-center my-4 ml-4">Categories</h1>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div key={category.title} className="space-y-2">
                <Link
                  href={`/category/${category?.title?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center text-2xl font-semibold hover:text-gray-600"
                >
                  <span className="mr-3">{getIcon(category.icon)}</span>
                  <span>{category.title}</span>
                </Link>

                <div className="ml-6 space-y-1">
                  {category?.subcategories?.map((sub) => (
                    <Link
                      key={sub}
                      href={`/category/${category?.title
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}/${sub
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="flex items-center text-xl text-gray-600 hover:text-black"
                    >
                      <FaRegCircle className="mr-2 w-2 h-2" />
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
