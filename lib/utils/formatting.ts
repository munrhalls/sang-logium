import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function firstLetterToUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export interface CategoryNode {
  id: string;
  title: string;
  slug: string;
  path: string;
  icon?: string;
  parentId?: string;
  group?: string;
  groups?: { title: string; items: CategoryNode[] }[];
}

export function buildCategoryTree(flatDocs: any[]): CategoryNode[] {
  const roots: CategoryNode[] = [];
  const childrenMap = new Map<string, any[]>();

  flatDocs.forEach((doc) => {
    const node: CategoryNode = {
      id: doc._id,
      parentId: doc.parent?._ref,
      title: doc.title,
      slug: doc.slug.current,
      path: doc.metadata?.path || doc.slug.current,
      icon: doc.icon,
      group: doc.group,
    };

    if (!node.parentId) {
      roots.push(node);
    } else {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, []);
      }
      childrenMap.get(node.parentId)!.push(node);
    }
  });

  return roots.map((root) => {
    const directChildren = childrenMap.get(root.id) || [];
    const groupedChildren: Record<string, CategoryNode[]> = {};

    directChildren.forEach((child) => {
      const groupName = child.group || "General";
      if (!groupedChildren[groupName]) groupedChildren[groupName] = [];
      groupedChildren[groupName].push(child);
    });

    const groups = Object.entries(groupedChildren).map(([title, items]) => ({
      title,
      items: items.sort((a, b) => a.title.localeCompare(b.title)),
    }));

    return { ...root, groups };
  });
}
