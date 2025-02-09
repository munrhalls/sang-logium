import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
export type CategoryTree = {
  _id: string;
  name: string;
  icon: string | null;
  path: string;
  children: CategoryTree[];
};

export const flatToTree = (
  categories: ALL_CATEGORIES_QUERYResult
): CategoryTree[] => {
  const categoriesTree: Record<string, CategoryTree> = {};
  const roots: CategoryTree[] = [];

  categories.sort((a, b) => {
    if (!a.metadata?.depth) return -1;
    if (!b.metadata?.depth) return 1;
    return a.metadata.depth - b.metadata.depth;
  });

  categories.forEach((category) => {
    const { path } = category.metadata || {};
    if (!path) {
      console.error("Category missing path", category);
      return;
    }
    const parts = path.split("/");
    const depth = parts.length;
    const parentPath = parts.slice(0, -1).join("/");

    // Initialize map entry
    categoriesTree[path] = {
      _id: category._id,
      name: category.name || "",
      path: path,
      icon: category.icon || null,
      children: [],
    } as CategoryTree;

    // Assign as child to parent or root
    if (depth === 1) {
      roots.push(categoriesTree[path]);
    } else if (categoriesTree[parentPath]) {
      categoriesTree[parentPath].children.push(categoriesTree[path]);
    }
  });
  return roots;
};
