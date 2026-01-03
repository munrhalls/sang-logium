"use client";

import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import { SubcategoryList } from "./SubcategoryList";
import { CatalogueTree } from "@/data/catalogue";

export default function CategoriesNav({
  catalogue,
}: {
  catalogue: CatalogueTree;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleMouseEnter = (title: string) => setActiveCategory(title);
  const handleMouseLeave = () => setActiveCategory(null);

  return (
    <nav
      className="hidden h-11 items-center justify-center bg-black lg:flex"
      onMouseLeave={handleMouseLeave}
    >
      <div className="mx-auto h-full max-w-7xl px-4">
        <ul className="flex h-full items-center gap-6">
          {catalogue?.map((item) => {
            const slugString = item.slug?.current;

            const isHeader = item.itemType === "header";

            const href = slugString && !isHeader ? `/shop/${slugString}` : "#";

            const itemTitle = item.title || "Untitled";
            const isActive = activeCategory === itemTitle;

            const childrenList = item.children || [];
            const hasChildren = childrenList.length > 0;

            return (
              <li
                key={item._key}
                className="group relative flex h-full items-center"
                onMouseEnter={() => handleMouseEnter(itemTitle)}
              >
                <Link
                  href={href}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-gray-300 hover:text-white"} `}
                  onClick={(e) => {
                    if (isHeader) e.preventDefault();
                  }}
                >
                  <span>{itemTitle}</span>

                  {hasChildren && (
                    <FaChevronDown
                      className={`h-2.5 w-2.5 transition-transform duration-200 ${
                        isActive ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {hasChildren && isActive && (
                  <div className="absolute left-0 top-full z-50 w-64 pt-2">
                    <div className="absolute -top-2 h-4 w-full" />

                    <div className="rounded-lg bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5">
                      <SubcategoryList
                        items={childrenList}
                        parentPath={`/shop/${slugString || ""}`}
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

// "use client";

// import Link from "next/link";
// import { FaChevronDown } from "react-icons/fa";
// import { useState } from "react";
// import { SubcategoryList } from "./SubcategoryList";
// import { CatalogueTree } from "@/data/catalogue";

// export default function CategoriesNav({
//   catalogue,
// }: {
//   catalogue: CatalogueTree;
// }) {
//   const [activeCategory, setActiveCategory] = useState<string | null>(null);

//   return (
//     <nav className="hidden h-11 items-center justify-center bg-black lg:flex">
//       <div className="mx-auto h-full max-w-7xl px-4">
//         <ul className="flex h-full items-center gap-6">
//           {catalogue.map((item) => {
//             const href = item.slug ? `/products/${item.slug}` : "#";
//             const isActive = activeCategory === item.title;

//             const isHighlighted = item.isHighlighted ?? false;

//             return (
//               <li
//                 key={item._key}
//                 className="relative flex h-full items-center"
//                 onMouseEnter={() => setActiveCategory(item.title)}
//                 onMouseLeave={() => setActiveCategory(null)}
//               >
//                 <Link
//                   href={href}
//                   className={`flex items-center text-sm font-medium transition-colors hover:text-yellow-600 ${isActive ? "text-yellow-400" : "text-white"} ${isHighlighted ? "font-black text-orange-600" : ""} `}
//                 >
//                   <span>{item.title}</span>
//                   <FaChevronDown
//                     className={`ml-2 h-3 w-3 transition-transform ${isActive ? "rotate-180" : ""}`}
//                   />
//                 </Link>

//                 {isActive && item.children && item.children.length > 0 && (
//                   <div className="absolute left-0 top-full z-50 w-72 rounded-b-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5">
//                     <div className="py-4">
//                       <SubcategoryList
//                         items={item.children}
//                         parentPath={href}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </nav>
//   );
// }
