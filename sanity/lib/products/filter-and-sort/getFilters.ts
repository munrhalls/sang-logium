import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../live";

export const getFilters = async () => {
  const FILTERS = defineQuery(`{
    "brands": array::unique(*[_type == "product"].brand->name)
  }`);

  try {
    const filters = await sanityFetch({
      query: FILTERS,
    });
    return filters.data || [];
  } catch (err) {
    console.error("Error fetching filters: ", err);
    return [];
  }
};
