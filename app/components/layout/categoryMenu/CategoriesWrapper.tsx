import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import CategoriesNav from "./CategoriesNav";

// lib/menu.ts

export function buildCategoryTree(categories) {
  const categoryMap = new Map();
  const roots = [];

  categories.forEach((cat) => {
    cat.children = [];
    categoryMap.set(cat._id, cat);
  });

  categories.forEach((cat) => {
    if (cat.parent?._ref) {
      const parent = categoryMap.get(cat.parent._ref);
      if (parent) {
        parent.children.push(cat);
      } else {
        roots.push(cat);
      }
    } else {
      roots.push(cat);
    }
  });

  const sortAndPopulate = (nodes, parentPath = "", depth = 0) => {
    // Sort by Group first, then Order
    nodes.sort((a, b) => {
      const groupA = a.metadata?.group || "";
      const groupB = b.metadata?.group || "";
      if (groupA !== groupB) return groupA.localeCompare(groupB);
      return (a.order || 0) - (b.order || 0);
    });

    return nodes.map((node) => {
      const currentPath = parentPath
        ? `${parentPath}/${node.slug.current}`
        : node.slug.current;

      return {
        ...node,
        metadata: {
          ...node.metadata,
          path: currentPath,
          depth: depth,
        },
        children: sortAndPopulate(node.children, currentPath, depth + 1),
      };
    });
  };

  return sortAndPopulate(roots);
}

export default async function CategoriesWrapper() {
  const categories = await getAllCategories();

  // console.log("categories", categories);

  // categories.sort((a, b) => {
  //   if (a?.order === undefined || b?.order === undefined) return 0;
  //   return a?.order - b?.order;
  // });

  const categoryTree = buildCategoryTree(categories);

  console.dir("categoryTree", categoryTree, { depth: null });

  // console.dir(categories, { depth: null });

  return <CategoriesNav categories={categoryTree} />;
}
