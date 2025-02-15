import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

export const flatToTree = function (
  list: ALL_CATEGORIES_QUERYResult,
  depth = 1
) {
  const itemsAtDepth = list.filter(
    (item) =>
      item?.metadata?.depth === depth &&
      item.metadata.path?.startsWith("hi-fi-audio")
  );

  const trees = itemsAtDepth.map((item) => {
    return transformToTree(item, list);
  });

  return trees;
};

const transformToTree = function (item, list) {
  const depth = item?.metadata?.depth;
  const path = item?.metadata?.path;
  if (!item.groups) item.groups = ["empty"];

  const children = list.filter(
    (child) =>
      child?.metadata?.path.startsWith(path) &&
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
