import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
export interface CategoryTree {
  _id: string;
  name: string;
  icon: string | null;
  children: CategoryTree[];
}

export const flatToTree = (
  categories: ALL_CATEGORIES_QUERYResult
): CategoryTree[] => {
  const map: Record<string, CategoryTree> = {};
  const roots: CategoryTree[] = [];

  categories.sort((a, b) => {
    if (!a.metadata?.depth) return -1;
    if (!b.metadata?.depth) return 1;
    return a.metadata.depth - b.metadata.depth;
  });

  categories.forEach((cat) => {
    const { path } = cat.metadata || {};
    if (!path) {
      console.error("Category missing path", cat);
      return;
    }
    const parts = path.split("/");
    const depth = parts.length;
    const parentPath = parts.slice(0, -1).join("/");

    // Initialize map entry
    map[path] = {
      _id: cat._id,
      name: cat.name || "",
      icon: cat.icon || null,
      children: [],
    } as CategoryTree;

    // Assign as child to parent or root
    if (depth === 1) {
      roots.push(map[path]);
    } else if (map[parentPath]) {
      map[parentPath].children.push(map[path]);
    }
  });
  return roots;
};
