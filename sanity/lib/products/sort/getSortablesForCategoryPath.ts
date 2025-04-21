import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../live";

export const getSortablesForCategoryPath = async (categoryPath: string) => {
  const cleanPath = categoryPath.replace(/^\/products\//, "");

  let topLevelCategory;
  if (cleanPath === "products") {
    topLevelCategory = "all";
  } else {
    topLevelCategory = cleanPath.split("/")[0];
  }

  const SORTABLES_BY_CATEGORY_QUERY = defineQuery(`
    *[_type == "categorySortables" && title == $topLevelCategory][0] {
      title,
      "sortOptions": sortOptions[]{
        name,
        displayName,
        type,
        field,
        defaultDirection
      },
      "mappings": categoryMappings[path == $cleanPath]
    }
  `);

  try {
    const sortablesData = await sanityFetch({
      query: SORTABLES_BY_CATEGORY_QUERY,
      params: {
        topLevelCategory,
        cleanPath,
      },
    });

    if (!sortablesData.data) {
      console.warn(
        `No sortables document found for category: ${topLevelCategory}`
      );
      return [];
    }

    const allSortOptions = sortablesData.data.sortOptions || [];

    const processedOptions = allSortOptions.map((option) => ({
      ...option,
      name: option.name || "",
    }));

    const specificMapping =
      sortablesData.data.mappings && sortablesData.data.mappings[0];

    if (specificMapping) {
      return processedOptions.filter((option) =>
        specificMapping.sortOptions?.includes(option.name || "")
      );
    }

    return processedOptions;
  } catch (err) {
    console.error("Error fetching sortables for category path:", err);
    return [];
  }
};
