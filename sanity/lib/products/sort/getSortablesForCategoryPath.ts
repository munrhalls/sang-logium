import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../live";

export const getSortablesForCategoryPath = async (categoryPath: string) => {
  // Handle full URL paths like "/products/headphones/wired"
  // Strip any leading paths like "/products/" to get just the category part
  const cleanPath = categoryPath.replace(/^\/products\//, "");

  // Get the top-level category (first segment)
  const topLevelCategory = cleanPath.split("/")[0];

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

    // Get all available sort options
    const allSortOptions = sortablesData.data.sortOptions || [];

    // Check if we have a specific mapping for this path
    const specificMapping =
      sortablesData.data.mappings && sortablesData.data.mappings[0];

    if (specificMapping) {
      // Return only the sort options that are in the mapping
      return allSortOptions.filter((option) =>
        specificMapping.sortOptions.includes(option.name)
      );
    }

    // If no specific mapping is found, return all sort options (top-level behavior)
    return allSortOptions;
  } catch (err) {
    console.error("Error fetching sortables for category path:", err);
    return [];
  }
};
