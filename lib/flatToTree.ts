import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

// Define group item type
interface GroupItem {
  label: string | null;
  children: CategoryWithMetadata[];
}

// Extended type for categories with metadata
type CategoryBase = ALL_CATEGORIES_QUERYResult[number];
interface CategoryWithMetadata extends CategoryBase {
  metadata?: {
    depth: number;
    path: string;
    group?: string;
  };
  groups?: Array<string | GroupItem> | any[];
}

export const flatToTree = function (
  list: CategoryWithMetadata[],
  depth = 1
) {
  const itemsAtDepth = list.filter((item) => item?.metadata?.depth === depth);

  const trees = itemsAtDepth.map((item) => {
    return transformToTree(item, list);
  });

  return trees;
};

const transformToTree = function (item: CategoryWithMetadata, list: CategoryWithMetadata[]) {
  const depth = item?.metadata?.depth;
  const path = item?.metadata?.path;
  if (!item.groups) item.groups = ["empty"];

  if (!depth || !path) return item;

  const children = list.filter(
    (child) =>
      child?.metadata?.path?.startsWith(path) &&
      child?.metadata?.depth === depth + 1
  );

  const transformedChildren = children.map((child) =>
    transformToTree(child, list)
  );

  const filledGroups = item.groups.map((group, index) => {
    if (index === 0) {
      const childrenGroup = transformedChildren.filter(
        (child) => !child?.metadata?.group
      );

      if (childrenGroup.length) {
        return {
          label: null,
          children: children.filter((child) => !child?.metadata?.group),
        };
      } else {
        return null;
      }
    }

    const childrenGroup = transformedChildren.filter(
      (child) => child?.metadata?.group === group
    );
    if (childrenGroup.length) {
      return {
        label: group,
        children: childrenGroup,
      };
    } else {
      return null;
    }
  });
  const filledGroupsOnly = filledGroups.filter((item) => item !== null);
  item.groups = filledGroupsOnly;

  return item;
};
