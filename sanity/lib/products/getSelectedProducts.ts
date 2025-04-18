import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getSelectedProducts = async (
  path,
  selectedFilters,
  selectedSort
) => {
  const [regular, overview, specifications, rangeFilters] = selectedFilters;
  console.log("selectedSort", selectedSort);

  console.log("selectedFilters", selectedFilters);
  // Debug logging
  console.log(
    "getSelectedProducts received filters:",
    JSON.stringify(rangeFilters, null, 2)
  );

  const regularQuery =
    regular.length > 0
      ? regular
          .map((item) => {
            // Handle different value types
            let values = [];
            if (typeof item.value === "string") {
              try {
                // Try to parse as JSON
                values = JSON.parse(item.value);
                // If the parsed result is not an array, make it one
                values = Array.isArray(values) ? values : [values];
              } catch (e) {
                // If parsing fails, use the string value as is
                values = [item.value];
              }
            } else if (Array.isArray(item.value)) {
              values = item.value;
            } else {
              values = [item.value];
            }

            return `(${values.map((value) => `${item.field} == "${value}"`).join(" || ")})`;
          })
          .filter((query) => query !== "") // Remove any empty queries
          .join(" && ")
      : "";
  const overviewQuery =
    overview.length > 0
      ? overview
          .map((item) => {
            // Handle different value types
            let values = [];
            if (typeof item.value === "string") {
              try {
                // Try to parse as JSON
                values = JSON.parse(item.value);
                // If the parsed result is not an array, make it one
                values = Array.isArray(values) ? values : [values];
              } catch (e) {
                // If parsing fails, use the string value as is
                values = [item.value];
              }
            } else if (Array.isArray(item.value)) {
              values = item.value;
            } else {
              values = [item.value];
            }

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
            // Handle different value types
            let values = [];
            if (typeof item.value === "string") {
              try {
                // Try to parse as JSON
                values = JSON.parse(item.value);
                // If the parsed result is not an array, make it one
                values = Array.isArray(values) ? values : [values];
              } catch (e) {
                // If parsing fails, use the string value as is
                values = [item.value];
              }
            } else if (Array.isArray(item.value)) {
              values = item.value;
            } else {
              values = [item.value];
            }

            return `(${values
              .map(
                (value) => `count(specifications[value match "${value}"]) > 0` // Check any field that has this value
              )
              .join(" || ")})`; // Join conditions with OR
          })
          .join(" && ") // Combine all conditions with AND
      : "";
  console.log("Range filters:", rangeFilters);
  const rangeQuery =
    rangeFilters && rangeFilters.length > 0
      ? rangeFilters
          .map((item) => {
            let query = "";
            query += `${item.field} ${item.operator} ${item.value}`;
            return query;
          })
          .filter((query) => query !== "") // Filter out empty strings
          .join(" && ") // Join with proper operator
      : "";

  let assembledQuery = `*[_type == "product"`;

  const pathString = path.join("/");
  let pathQuery = "";

  if (pathString === "products") {
    // All products case - no path filtering needed
    pathQuery = "";
  } else {
    // Category filtering
    pathQuery = ` && (categoryPath == "${pathString}" || categoryPath match "${pathString}/*")`;
  }

  assembledQuery += pathQuery;

  // Combine all filters
  const allFilters = [
    regularQuery,
    overviewQuery,
    specificationsQuery,
    rangeQuery,
  ]
    .filter((query) => query !== "")
    .join(" && ");

  if (allFilters) {
    assembledQuery += ` && (${allFilters})`;
  }

  if (selectedSort && selectedSort.field && selectedSort.field !== "default") {
    if (selectedSort.field === "bassPerformance") {
      assembledQuery += `] {
        ...,
        "sortValue": coalesce(
          specifications[title match "Frequency Response" || title match "frequency response"][0].value,
          "100Hz"
        )
      } | order(sortValue ${selectedSort.direction})`;
    } else if (selectedSort.field === "detailClarity") {
      assembledQuery += `] {
        ...,
        "freqResponse": coalesce(
          specifications[title match "Frequency Response" || title match "frequency response"][0].value,
          ""
        ),
        "sortingOrder": count(specifications[title match "Frequency Response" && value match "*kHz*"])
      } | order(sortingOrder ${selectedSort.direction})`;
    } else if (selectedSort.field === "frequencyRange") {
      assembledQuery += `] {
        ...,
        "hasFreq": defined(specifications[title match "Frequency Response"][0]),
        "hasDash": specifications[title match "Frequency Response"][0].value match "*-*",
        "hasRange": hasFreq && hasDash,
        "sortingOrder": count(specifications[title match "Frequency Response" && value match "*-*"])
      } | order(sortingOrder ${selectedSort.direction})`;
    } else if (selectedSort.field === "sensitivity") {
      assembledQuery += `] {
        ...,
        "sensitivitySpec": coalesce(
          specifications[title match "Sensitivity"][0].value,
          "0 dB"
        ),
        "hasSensitivity": defined(specifications[title match "Sensitivity"][0]),
        "sortingOrder": count(specifications[title match "Sensitivity"])
      } | order(sortingOrder ${selectedSort.direction})`;
    } else if (selectedSort.field === "impedance") {
      assembledQuery += `] {
          ...,
          "impedanceSpec": coalesce(
            specifications[title match "Impedance"][0].value,
            "0"
          ),
          "hasImpedance": defined(specifications[title match "Impedance"][0]),
          "sortingOrder": count(specifications[title match "Impedance"])
        } | order(sortingOrder ${selectedSort.direction})`;
    } else {
      assembledQuery += `] | order(${selectedSort.field} ${selectedSort.direction})`;
    }
  } else {
    assembledQuery += `] | order(name asc)`;
  }
  console.log("Final GROQ query:", assembledQuery);
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
