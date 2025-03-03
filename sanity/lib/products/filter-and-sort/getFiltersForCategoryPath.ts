import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../live";

export const getFiltersForCategoryPath = async (categoryPath: string) => {
  const segments = categoryPath.split("/").filter(Boolean);
  const categoryName =
    segments.length > 1 ? segments[segments.length - 1] : segments[0];

  console.log(
    "GROQ FOR FILTERS category name, path:",
    categoryName,
    categoryPath
  );

  const FILTERS_BY_CATEGORY_QUERY = defineQuery(`
    *[_type == "categoryFilters" && title == $categoryName][0] {
      title,
      "filters": filters.filterItems[]{
        name,
        type,
        options,
        defaultValue,
        min,
        max,
        step
      }
    }
  `);

  try {
    const filtersData = await sanityFetch({
      query: FILTERS_BY_CATEGORY_QUERY,
      params: {
        categoryName,
        categoryPath,
      },
    });
    return filtersData.data?.filters || [];
  } catch (err) {
    console.error("Error fetching filters for category path:", err);
    return [];
  }
};
