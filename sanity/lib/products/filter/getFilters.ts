import { defineQuery } from "next-sanity";
import { client } from "../../client";

export const getFilters = async () => {
  const FILTERS = defineQuery(`{
    "brands": array::unique(*[_type == "product"].brand->name)
  }`);

  try {
    const filters = await client.fetch(FILTERS);
    return filters || [];
  } catch (err) {
    console.error("Error fetching filters: ", err);
    return [];
  }
};
