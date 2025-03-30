import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getSelectedProducts = async (path, selectedFilters) => {
  // console.log(selectedFilters, "selectedFilters");
  console.log("path", path);

  const [regular, overview, specifications] = selectedFilters;
  const regularQuery =
    regular.length > 0
      ? regular
          .map((item) => {
            const values = JSON.parse(item.value);
            return `(${values.map((value) => `${item.field} == "${value}"`).join(" || ")})`;
          })
          .join(" && ")
      : "";
  console.log(regularQuery, "regularQuery");
  const overviewQuery =
    overview.length > 0
      ? overview
          .map((item) => {
            // Ensure values are parsed
            const values = JSON.parse(item.value);
            return `(${values
              .map(
                (value) => `count(overviewFields[value match "${value}"]) > 0` // Check any field that has this value
              )
              .join(" || ")})`; // Join conditions with OR
          })
          .join(" && ") // Combine all conditions with AND
      : "";

  const specificationsQuery =
    specifications.length > 0
      ? specifications
          .map((item) => {
            // Ensure values are parsed
            const values = JSON.parse(item.value);
            return `(${values
              .map(
                (value) => `count(specifications[value match "${value}"]) > 0` // Check any field that has this value
              )
              .join(" || ")})`; // Join conditions with OR
          })
          .join(" && ") // Combine all conditions with AND
      : "";

  let assembledQuery = `*[_type == "product"`;

  const pathString = path.join("/");
  const pathQuery = ` && (categoryPath == "${pathString}" || categoryPath match "${pathString}/*")`;
  assembledQuery += pathQuery;
  // Combine all filters
  const allFilters = [regularQuery, overviewQuery, specificationsQuery]
    .filter((query) => query !== "")
    .join(" && ");

  if (allFilters) {
    assembledQuery += ` && (${allFilters})`;
  }

  assembledQuery += `] | order(name asc)`;
  console.log(assembledQuery, "assembledQuery");

  const GET_PRODUCTS_BY_QUERY = defineQuery(assembledQuery);

  try {
    const products = await sanityFetch({
      query: GET_PRODUCTS_BY_QUERY,
    });
    return products.data || [];
  } catch (err) {
    console.error("Error fetching all products: ", err);
    return [];
  }
};
