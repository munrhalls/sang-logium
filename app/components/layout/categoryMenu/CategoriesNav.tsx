"use client";

import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import { SubcategoryList } from "./SubcategoryList";
import { CatalogueTree } from "@/data/catalogue";
import {
  Headphones,
  Speaker,
  Headset,
  Radio,
  Mic2,
  Cable,
  Tag,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  headphones: Headphones,
  speakers: Speaker,
  "personal-audio": Headset,
  "home-audio": Radio,
  "studio-equipment": Mic2,
  accessories: Cable,
  "on-sale": Tag,
};

export default function CategoriesNav({
  catalogue,
}: {
  catalogue: CatalogueTree;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleMouseLeave = () => setActiveCategory(null);

  return (
    <nav
      className="hidden h-11 items-center justify-center bg-black lg:flex"
      onMouseLeave={handleMouseLeave}
    >
      <div className="mx-auto h-full max-w-7xl items-center justify-center lg:flex lg:px-1 xl:px-4">
        <ul className="flex h-full items-center">
          {catalogue?.map((item) => {
            const slug = item.slug?.current || "";
            const title = item.title || "Untitled";
            const children = item.children || [];

            const isHeader = item.type === "header";
            const isHighlighted =
              (item as any).isHighlighted || slug === "on-sale";
            const isActive = activeCategory === title;
            const hasChildren = children.length > 0;
            const Icon = ICON_MAP[slug];

            const href = slug ? `/products/${slug}` : "#";

            const linkClasses = `
              flex h-full items-center justify-around
              lg:px-1 xl:px-4
              transition-colors hover:text-yellow-600
              ${isActive ? "text-yellow-400" : "text-white"}
              ${isHighlighted ? "font-black text-orange-600" : ""}
            `;

            const InnerContent = () => (
              <>
                {Icon && (
                  <span className="mr-2">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                )}

                <span className="xl:text-md truncate text-sm md:text-sm 2xl:text-lg">
                  {title}
                </span>
                {hasChildren && (
                  <FaChevronDown
                    className={`ml-2 h-3 w-3 transition-transform ${isActive ? "rotate-180" : ""}`}
                  />
                )}
              </>
            );

            return (
              <li
                key={item._key}
                className="relative h-full"
                onMouseEnter={() => setActiveCategory(title)}
              >
                {isHeader ? (
                  <span className={`${linkClasses} cursor-default`}>
                    <InnerContent />
                  </span>
                ) : (
                  <Link href={href} className={linkClasses}>
                    <InnerContent />
                  </Link>
                )}

                {/* DROPDOWN INJECTION */}
                {hasChildren && isActive && (
                  <div className="absolute left-0 top-full z-50 w-72 rounded-b-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5">
                    {/* div to prevent flickering */}
                    <div className="absolute -top-2 h-4 w-full" />
                    <div className="py-4">
                      <SubcategoryList
                        items={children}
                        parentPath={`/products/${slug}`}
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
