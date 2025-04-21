import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../live";

export const getFiltersForCategoryPath = async (categoryPath: string[]) => {
  if (categoryPath[0] === "products" && categoryPath.length > 1) {
    categoryPath.shift();
  } else if (categoryPath[0] === "products") {
    categoryPath = ["all"];
  }

  const cleanPath = categoryPath.join("/");

  const topLevelCategory = categoryPath[0];

  const FILTERS_BY_CATEGORY_QUERY = defineQuery(`
    *[_type == "categoryFilters" && title == $topLevelCategory][0] {
      title,
      "filters": filters.filterItems[]{
        name,
        type,
        options,
        defaultValue,
        min,
        max,
        isMinOnly,
        step
      },
      "mappings": categoryMappings[path == $cleanPath]
    }
  `);

  try {
    const filtersData = await sanityFetch({
      query: FILTERS_BY_CATEGORY_QUERY,
      params: {
        topLevelCategory,
        cleanPath,
      },
    });

    if (!filtersData.data) {
      console.warn(
        `No filter document found for category: ${topLevelCategory}`
      );
      return [];
    }

    // Get all available filters
    const allFilters = filtersData.data.filters || [];

    // Check if we have a specific mapping for this path
    const specificMapping =
      filtersData.data.mappings && filtersData.data.mappings[0];

    if (specificMapping) {
      // Return only the filters that are in the mapping
      return allFilters.filter(
        (filter) =>
          filter.name !== null &&
          (specificMapping.filters ?? []).includes(filter.name)
      );
    }

    // If no specific mapping is found, return all filters (top-level behavior)
    return allFilters;
  } catch (err) {
    console.error("Error fetching filters for category path:", err);
    return [];
  }
};
