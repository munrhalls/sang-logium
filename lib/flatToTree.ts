import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
interface GroupItem {
  label: string | null;
  children: CategoryWithMetadata[];
}
type CategoryBase = ALL_CATEGORIES_QUERYResult[number];
interface CategoryWithMetadata extends CategoryBase {
  metadata?: {
    depth: number;
    path: string;
    group?: string;
  };
  groups?: string[] | GroupItem[];
}
export const flatToTree = function (list: CategoryWithMetadata[], depth = 1) {
  const itemsAtDepth = list.filter((item) => item?.metadata?.depth === depth);
  const trees = itemsAtDepth.map((item) => {
    return transformToTree(item, list);
  });
  return trees;
};
const transformToTree = function (
  item: CategoryWithMetadata,
  list: CategoryWithMetadata[],
) {
  const depth = item?.metadata?.depth;
  const path = item?.metadata?.path;
  if (!item.groups) {
    item.groups = ["empty"];
  }
  const initialGroups = item.groups as string[];
  if (!depth || !path) return item;
  const children = list.filter(
    (child) =>
      child?.metadata?.path?.startsWith(path) &&
      child?.metadata?.depth === depth + 1,
  );
  const transformedChildren = children.map((child) =>
    transformToTree(child, list),
  );
  const filledGroups = initialGroups.map((group: string, index: number) => {
    if (index === 0) {
      const childrenGroup = transformedChildren.filter(
        (child) => !child?.metadata?.group,
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
      (child) => child?.metadata?.group === group,
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
  const filledGroupsOnly = filledGroups.filter(
    (groupItem: GroupItem | null) => groupItem !== null,
  );
  item.groups = filledGroupsOnly;
  return item;
};
