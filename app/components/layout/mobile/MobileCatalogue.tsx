"use client";

import Link from "next/link";
import { FaRegCircle } from "react-icons/fa";
import { AdaptiveCategoryIcon } from "@/app/components/ui/AdaptiveCategoryIcon";
import { CatalogueTree, getCatalogue } from "@/data/catalogue";
import { useDrawer } from "@/app/hooks/nuqs/useDrawer";
import { FaTimes } from "react-icons/fa";

export default function MobileCatalogue() {
  const catalogue: CatalogueTree = getCatalogue();
  const { closeDrawer } = useDrawer();

  if (!catalogue || catalogue.length === 0) {
    return (
      <div className="p-4">
        Catalogue is temporarily down due to rare exception and will be back
        soon, please check back shortly!
      </div>
    );
  }

  const renderChildren = (
    children: CatalogueTree | undefined,
    baseUrl: string
  ): JSX.Element[] => {
    if (!children || children.length === 0) return [];

    return children.map((child) => {
      const childSlug = child.slug?.current || "";
      const childPath = `${baseUrl}/${childSlug}`;
      const isHeader = child.type === "header";
      const hasChildren = child.children && child.children.length > 0;

      return (
        <div key={child._key}>
          {isHeader ? (
            <h3 className="mt-6 text-sm font-black uppercase tracking-widest text-gray-400">
              {child.title}
            </h3>
          ) : (
            <Link
              href={childPath}
              className="mt-2 flex items-center text-gray-600 transition-colors hover:text-black"
            >
              <span className="text-lg">{child.title}</span>
            </Link>
          )}
          {hasChildren && (
            <ul className="ml-1 mt-1 space-y-1 pl-4">
              {child.children!.map((grandchild) => {
                const grandchildSlug = grandchild.slug?.current || "";
                const grandchildPath = `${baseUrl}/${grandchildSlug}`;

                return (
                  <li key={grandchild._key}>
                    <Link
                      href={grandchildPath}
                      className="flex items-center py-2 text-gray-500 transition-colors hover:text-black"
                    >
                      <FaRegCircle className="mr-2 h-2 w-2" />
                      <span className="text-md">{grandchild.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-20 flex items-center justify-center border-b bg-white p-4">
        <span className="text-xl font-black uppercase tracking-wide">
          Catalogue
        </span>
        <button className="-mr-2 ml-auto p-2" onClick={closeDrawer}>
          <FaTimes className="h-6 w-6" />
        </button>
      </div>

      {/* Scrollable Content Section */}
      <div className="p-4">
        <div className="grid gap-8">
          {catalogue.map((item) => {
            const slug = item.slug?.current || "";
            const categoryPath = `/products/${slug}`;
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item._key} className="space-y-3">
                <Link
                  href={categoryPath}
                  className="flex items-center text-2xl font-bold transition-colors hover:text-gray-600"
                >
                  {item.icon && (
                    <span className="mr-3 opacity-80">
                      <AdaptiveCategoryIcon title={item.icon} />
                    </span>
                  )}
                  <span
                    className={
                      item.title === "On Sale" ? "text-orange-500" : ""
                    }
                  >
                    {item.title}
                  </span>
                </Link>
                {hasChildren && (
                  <div className="ml-2">
                    {renderChildren(item.children!, categoryPath)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mb-8 mt-12 flex items-center justify-center text-xs font-medium uppercase tracking-widest text-gray-300">
          End.
        </p>
      </div>
    </div>
  );
}
