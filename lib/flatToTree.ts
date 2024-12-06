import { Category } from "@/sanity.types";

interface CategoryTree {
  _id: string;
  name: string;
  icon: string | null;
  children: CategoryTree[];
}

export const flatToTree = (categories: Category[]): CategoryTree[] => {
  const map: Record<string, CategoryTree> = {};
  const roots: CategoryTree[] = [];

  categories.forEach((cat) => {
    map[cat._id] = {
      ...cat,
      name: cat.name || "",
      icon: cat.icon || null,
      children: [],
    } as CategoryTree;
  });

  categories.forEach((cat) => {
    if (cat.parentCategory?._ref) {
      // Use optional chaining
      map[cat.parentCategory._ref].children.push(map[cat._id]);
    } else {
      roots.push(map[cat._id]);
    }
  });

  return roots;
};
