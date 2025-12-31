"use client";

import Link from "next/link";
import { CategoryNode } from "@/lib/utils/formatting";
import { AdaptiveCategoryIcon } from "@/app/components/ui/AdaptiveCategoryIcon";
import { ChevronDown } from "lucide-react";

export default function CategoriesNav({
  categories,
}: {
  categories: CategoryNode[];
}) {
  return (
    <nav className="relative hidden h-16 items-center justify-center bg-black text-white lg:flex">
      <ul className="flex h-full items-center gap-8 px-4">
        {categories.map((root) => (
          <li key={root.id} className="group flex h-full items-center">
            {/* Top Level Link */}
            <Link
              href={`/products/${root.slug}`}
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider transition-colors hover:text-orange-500"
            >
              {root.icon && <AdaptiveCategoryIcon title={root.icon} />}
              <span>{root.title}</span>
              {root.groups && root.groups.length > 0 && (
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              )}
            </Link>

            {/* Mega Menu Dropdown */}
            {root.groups && root.groups.length > 0 && (
              <div className="absolute left-0 top-full z-50 hidden w-full border-t border-gray-800 bg-black shadow-xl group-hover:block">
                <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8 p-8">
                  {root.groups.map((group) => (
                    <div key={group.title} className="space-y-4">
                      <h3 className="border-b border-gray-700 pb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                        {group.title}
                      </h3>
                      <ul className="space-y-2">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={`/products/${item.path}`}
                              className="block text-sm text-gray-300 hover:text-white"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
