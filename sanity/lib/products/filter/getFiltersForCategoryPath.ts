import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../live";
import {
  FilterOptions,
  FilterOptionObject,
} from "@/app/components/ui/filters/FilterTypes";

export const getFiltersForCategoryPath = async (
  categoryPath: string[],
): Promise<FilterOptions> => {
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
        `No filter document found for category: ${topLevelCategory}`,
      );
      return [];
    }

    // Get all available filters
    const allFilters = filtersData.data.filters || [];

    // Check if we have a specific mapping for this path
    const specificMapping =
      filtersData.data.mappings && filtersData.data.mappings[0];

    let filteredFilters: FilterOptionObject[];

    if (specificMapping) {
      // Return only the filters that are in the mapping and have non-null names
      filteredFilters = allFilters
        .filter(
          (filter) =>
            filter.name && // Check that name exists and is truthy
            (specificMapping.filters ?? []).includes(filter.name),
        )
        .map((filter) => ({
          // Make sure all fields match the FilterOptionObject interface
          name: filter.name || "Unknown", // Use fallback name if somehow null
          type: filter.type || null,
          options: filter.options || null,
          defaultValue: filter.defaultValue || null,
          min: filter.min !== undefined ? filter.min : null,
          max: filter.max !== undefined ? filter.max : null,
          isMinOnly: filter.isMinOnly || null,
          step: filter.step !== undefined ? filter.step : null,
        }));
    } else {
      // If no specific mapping is found, return all filters with non-null names
      filteredFilters = allFilters
        .filter((filter) => filter.name) // Filter out those with null/undefined names
        .map((filter) => ({
          name: filter.name || "Unknown", // Fallback name
          type: filter.type || null,
          options: filter.options || null,
          defaultValue: filter.defaultValue || null,
          min: filter.min !== undefined ? filter.min : null,
          max: filter.max !== undefined ? filter.max : null,
          isMinOnly: filter.isMinOnly || null,
          step: filter.step !== undefined ? filter.step : null,
        }));
    }

    return filteredFilters;
  } catch (err) {
    console.error("Error fetching filters for category path:", err);
    return [];
  }
};
