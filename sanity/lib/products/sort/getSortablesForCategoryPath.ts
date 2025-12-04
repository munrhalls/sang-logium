import { defineQuery } from "next-sanity";
import { client } from "../../client";
import { SortOption } from "@/app/components/ui/sortables/SortTypes";

interface RawSortOption {
  name: string | null;
  displayName: string | null;
  type: "boolean" | "alphabetic" | "date" | "numeric" | null;
  field: string | null;
  defaultDirection: "asc" | "desc" | null;
}

export const getSortablesForCategoryPath = async (
  categoryPath: string
): Promise<SortOption[]> => {
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
    const sortablesData = await client.fetch(SORTABLES_BY_CATEGORY_QUERY, {
      topLevelCategory,
      cleanPath,
    });

    if (!sortablesData) {
      console.warn(
        `No sortables document found for category: ${topLevelCategory}`
      );
      return [];
    }

    const allSortOptions: RawSortOption[] = sortablesData.sortOptions || [];

    const processedOptions: SortOption[] = allSortOptions.map((option) => ({
      name: option.name || "",
      displayName: option.displayName ?? undefined,
      type: option.type ?? undefined,
      field: option.field ?? undefined,
      defaultDirection: option.defaultDirection ?? undefined,
    }));

    const specificMapping = sortablesData.mappings && sortablesData.mappings[0];

    if (specificMapping) {
      return processedOptions.filter((option) =>
        specificMapping.sortOptions?.includes(option.name)
      );
    }

    return processedOptions;
  } catch (err) {
    console.error("Error fetching sortables for category path:", err);
    return [];
  }
};
