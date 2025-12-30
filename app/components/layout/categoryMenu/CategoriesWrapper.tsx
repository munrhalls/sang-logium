import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import CategoriesNav from "./CategoriesNav";

// lib/menu.ts

export function buildMenuTree(flatCategories: any[]) {
  const roots: any[] = [];
  const childrenMap = new Map<string, any[]>();

  // 1. Single pass to separate roots and map children
  flatCategories.forEach((cat) => {
    if (!cat.parentId) {
      roots.push(cat);
    } else {
      if (!childrenMap.has(cat.parentId)) {
        childrenMap.set(cat.parentId, []);
      }
      childrenMap.get(cat.parentId).push(cat);
    }
  });

  // 2. Build the nested structure
  return roots.map((root) => {
    const children = childrenMap.get(root.id) || [];

    // Group the children by their 'group' string
    const groups: Record<string, any[]> = {};

    children.forEach((child) => {
      // If group is null/empty, use "Others" or "Main"
      const groupName = child.group || "Main";
      if (!groups[groupName]) groups[groupName] = [];

      groups[groupName].push({
        title: child.title,
        slug: child.slug,
      });
    });

    // Convert object to array for rendering
    const groupArray = Object.entries(groups).map(([title, items]) => ({
      title,
      items,
    }));

    return {
      title: root.title,
      slug: root.slug,
      icon: root.icon,
      groups: groupArray,
    };
  });
}

export default async function CategoriesWrapper() {
  const categories = await getAllCategories();

  console.log("categories", categories);

  categories.sort((a, b) => {
    if (a?.order === undefined || b?.order === undefined) return 0;
    return a?.order - b?.order;
  });

  console.dir(categories, { depth: null });

  return <CategoriesNav categories={categories} />;
}
