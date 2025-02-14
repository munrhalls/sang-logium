import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

export type CategoryTree = {
  _id: string;
  name: string;
  icon: string | null;
  path: string;
  label: number | null;
  children: CategoryTree[];
};

const CATEGORY_ORDER = [
  "Headphones",
  "Hi-Fi Audio",
  "Studio Equipment",
  "Accessories",
  "On Sale",
];

export const flatToTree = (
  categories: ALL_CATEGORIES_QUERYResult
): CategoryTree[] => {
  const categoriesTree: Record<string, CategoryTree> = {};
  const roots: CategoryTree[] = [];

  const c = categories.filter((category) => category.metadata?.depth === 1);

  c.sort((a, b) => {
    if (!a.name || !b.name) return 0;
    return CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name);
  });

  const path = c[0].metadata?.path;
  const depth = c[0].metadata?.depth ?? null;

  const subs = categories.filter((c) => {
    if (!depth || !path) return false;
    console.log(depth, path);
    return (
      c.metadata?.depth === depth + 1 && c.metadata?.path?.startsWith(path)
    );
  });

  subs.sort((a, b) => {
    if (!a.metadata?.group) return -1;
    if (!b.metadata?.group) return 1;
    if (!a.metadata?.label) return -1;
    if (!b.metadata?.label) return 1;

    if (a.metadata.group !== b.metadata.group) {
      return a.metadata.group - b.metadata.group;
    }

    return a.metadata.label - b.metadata.label;
  });
  console.log(
    "subs",
    subs.map((sub) => sub.name)
  );

  categories.sort((a, b) => {
    if (!a.metadata?.depth) return -1;
    if (!b.metadata?.depth) return 1;
    if (!a.metadata?.group) return -1;
    if (!b.metadata?.group) return 1;
    if (!a.metadata?.label) return -1;
    if (!b.metadata?.label) return 1;

    if (a.metadata.depth !== b.metadata.depth) {
      return a.metadata.depth - b.metadata.depth;
    }

    if (a.metadata.group !== b.metadata.group) {
      return a.metadata.group - b.metadata.group;
    }

    return a.metadata.label - b.metadata.label;
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
      label: category?.metadata?.label || null,
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
