// import { flatToTree } from "@/lib/flatToTree";
// import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
// import Link from "next/link";
// import { getCategoryIcon } from "@/lib/getCategoryIcon";
// import { FaRegCircle } from "react-icons/fa";

// export default async function CategoriesDrawerList() {
//   return (
//     <div className="flex-1 overflow-y-auto scroll-smooth pb-6">
//       <div className="p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {orderedCategoriesTree.map((category) => (
//             <div key={category.name} className="space-y-2">
//               <Link
//                 href={`/category/${category?.name?.toLowerCase().replace(/\s+/g, "-")}`}
//                 className="flex items-center text-2xl font-semibold hover:text-gray-600"
//               >
//                 {category.icon && (
//                   <span className="mr-3">{getCategoryIcon(category.icon)}</span>
//                 )}
//                 <span
//                   className={`${category.name === "On Sale" ? "text-orange-500" : ""}`}
//                 >
//                   {category.name}
//                 </span>
//               </Link>

//               <div className="ml-6 space-y-1">
//                 {category?.children?.map((sub) => (
//                   <div key={category._id + sub.name}>
//                     <Link
//                       href={`/category/${category?.name
//                         ?.toLowerCase()
//                         .replace(/\s+/g, "-")}/${sub?.name
//                         ?.toLowerCase()
//                         .replace(/\s+/g, "-")}`}
//                       className="mt-2 flex items-center text-gray-600 hover:text-black"
//                     >
//                       <FaRegCircle className="mr-2 w-2 h-2" />
//                       <span className="text-lg">{sub?.name}</span>
//                     </Link>
//                     {sub.children && (
//                       <ul className="pl-3 py-2 backdrop-brightness-95 rounded">
//                         {sub.children.map((child) => (
//                           <li
//                             key={`${category?.name?.toLowerCase()}-${sub?.name?.toLowerCase()}-${child?.name?.toLowerCase()}`}
//                           >
//                             <Link
//                               href={`/category/${category?.name
//                                 ?.toLowerCase()
//                                 .replace(/\s+/g, "-")}/${sub?.name
//                                 ?.toLowerCase()
//                                 .replace(/\s+/g, "-")}/${child?.name
//                                 ?.toLowerCase()
//                                 .replace(/\s+/g, "-")}`}
//                               className="flex justify-start items-center px-4 py-2  text-gray-800 hover:bg-gray-100"
//                             >
//                               <FaRegCircle className="mr-2" />
//                               <span className="text-md">{child.name}</span>
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//         <p className="mt-8 flex justify-center items-center text-gray-500">
//           End.
//         </p>
//       </div>
//     </div>
//   );
// }
