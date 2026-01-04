// TODO
// - make mobile catalogue
// - retain exact styling and catalogue-related behavior as the legacy mobile categories drawer
// - but strip out any code unrelated to catalogue itself, as all drawer behavior is now handled by the drawer manager
// - critically - this has to mimic the desktop catalogue component's structure and behavior as closely as possible - as that desktop component has been already transitioned from legacy code to new code that uses new structure of catalogue data

// Safest Build Sequence
// Create component skeleton — import statements and basic props, accept CatalogueTree
// Render top-level categories only — iterate items, display title with icon, build URLs using slug.current
// Add "On Sale" highlighting — check title === "On Sale" and apply orange class
// Add type-aware rendering — use item.type === "header" to render span vs Link
// Implement recursive children rendering — convert legacy renderSubcategories logic to work with children array
// Add "End." footer — copy the closing paragraph styling
// Test full nesting — verify categories, headers, and sub-items all render correctly
// Key safety measures:

// Build incrementally; test each level before adding the next
// Use optional chaining for slug.current and add fallback slug generation
// Test with all 7 catalogue categories to catch edge cases early

"use client";

import Link from "next/link";
import { FaRegCircle } from "react-icons/fa";
import { AdaptiveCategoryIcon } from "@/app/components/ui/AdaptiveCategoryIcon";
import { CatalogueTree } from "@/data/catalogue";
import { getCatalogue } from "@/data/catalogue";

export default function MobileCatalogue() {
  const catalogue: CatalogueTree = getCatalogue();
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
            <h3 className="font-bold text-gray-500">{child.title}</h3>
          ) : (
            <Link
              href={childPath}
              className="mt-2 flex items-center text-gray-600 hover:text-black"
            >
              <FaRegCircle className="mr-2 h-2 w-2" />
              <span className="text-lg">{child.title}</span>
            </Link>
          )}
          {hasChildren && (
            <ul className="rounded py-2 pl-3 backdrop-brightness-95">
              {child.children!.map((grandchild) => {
                const grandchildSlug = grandchild.slug?.current || "";
                const grandchildPath = `${baseUrl}/${grandchildSlug}`;

                return (
                  <li key={grandchild._key}>
                    <Link
                      href={grandchildPath}
                      className="flex items-center justify-start px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <FaRegCircle className="mr-2" />
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
    <div className="p-4">
      <div className="grid gap-6 bg-white">
        {catalogue.map((item) => {
          const slug = item.slug?.current || "";
          const categoryPath = `/products/${slug}`;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item._key} className="space-y-2">
              <Link
                href={categoryPath}
                className="flex items-center text-2xl font-semibold hover:text-gray-600"
              >
                {item.icon && (
                  <span className="mr-3">
                    <AdaptiveCategoryIcon title={item.icon} />
                  </span>
                )}
                <span
                  className={`${item.title === "On Sale" ? "text-orange-500" : ""}`}
                >
                  {item.title}
                </span>
              </Link>
              {hasChildren && (
                <div className="ml-6 space-y-1">
                  {renderChildren(item.children!, categoryPath)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-8 flex items-center justify-center text-gray-500">
        End.
      </p>
    </div>
  );
}
