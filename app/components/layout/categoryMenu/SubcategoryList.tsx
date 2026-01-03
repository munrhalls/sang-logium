"use client";

import Link from "next/link";
import { CatalogueTree } from "@/data/catalogue";

interface SubcategoryListProps {
  items: CatalogueTree;
  parentPath: string;
}

export const SubcategoryList = ({
  items,
  parentPath,
}: SubcategoryListProps) => {
  if (!items || items.length === 0) return null;

  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const slugString = item.slug?.current;
        const isHeader = item.itemType === "header";

        const href =
          slugString && !isHeader ? `${parentPath}/${slugString}` : "#";

        const itemTitle = item.title || "Untitled";
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={item._key} className="block">
            <Link
              href={href}
              className={`block text-sm transition-colors duration-200 ${isHeader ? "mb-1 mt-3 cursor-default font-bold text-gray-900" : "text-gray-500 hover:text-black"} `}
              onClick={(e) => {
                if (isHeader) e.preventDefault();
              }}
            >
              {itemTitle}
            </Link>

            {hasChildren && (
              <div className="mt-1 border-l border-gray-100 pl-3">
                <SubcategoryList
                  items={item.children || []}
                  parentPath={href}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
