import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
export type CategoryTree = {
  _id: string;
  name: string;
  icon: string | null;
  path: string;
  isLabel: boolean;
  children: CategoryTree[];
};

export const flatToTree = (
  categories: ALL_CATEGORIES_QUERYResult
): CategoryTree[] => {
  const categoriesTree: Record<string, CategoryTree> = {};
  const roots: CategoryTree[] = [];

  console.log(categories);

  categories.sort((a, b) => {
    if (!a.metadata?.depth) return -1;
    if (!b.metadata?.depth) return 1;
    if (a.metadata.depth !== b.metadata.depth) {
      return a.metadata.depth - b.metadata.depth;
    }
    return (b.metadata.label ? 1 : 0) - (a.metadata.label ? 1 : 0);
  });

  // const handleLabel = (category: ALL_CATEGORIES_QUERYResult[number]) => {};

  const handleCategory = (category: ALL_CATEGORIES_QUERYResult[number]) => {
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
      isLabel: category?.metadata?.label || false,
      icon: category.icon || null,
      children: [],
    } as CategoryTree;

    // Assign as child to parent or root
    if (depth === 1) {
      roots.push(categoriesTree[path]);
    } else if (categoriesTree[parentPath]) {
      categoriesTree[parentPath].children.push(categoriesTree[path]);
    }
  };

  categories.forEach((category) => {
    handleCategory(category);
  });
  return roots;
};
