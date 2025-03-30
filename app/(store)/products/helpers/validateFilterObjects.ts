const VALID_DIRECT_FIELDS = ["name", "brand", "price", "stock", "sku"];

// Include "connection" as a valid field for filtering
const VALID_FILTER_FIELDS = [
  ...VALID_DIRECT_FIELDS,
  "connection",
  "design",
  "type",
];

const VALID_OVERVIEW_VALUES = [
  "in-ear",
  "on-ear",
  "over-ear",
  "open-back",
  "closed-back",
  "wired",
  "wireless",
  "bluetooth",
];

const SPECIAL_FIELD_MAPPINGS = {
  "in stock": {
    field: "stock",
    operator: ">",
    value: 0,
  },
};

export default function validateFilterObjects(rawFilters) {
  console.log("Server rawFilters", rawFilters);
  const validatedFilters = rawFilters
    .map((filter) => {
      // Handle special field mappings
      const lcField = filter.field.toLowerCase();
      if (SPECIAL_FIELD_MAPPINGS[lcField]) {
        return SPECIAL_FIELD_MAPPINGS[lcField];
      }

      // Process filter value
      const filterValue =
        typeof filter.value === "string" ? filter.value : String(filter.value);

      // Check if it's a valid overview value (case-insensitive)
      if (
        VALID_OVERVIEW_VALUES.some(
          (val) =>
            val.toLowerCase() === filterValue.toLowerCase() ||
            (Array.isArray(filter.value) &&
              filter.value.some(
                (v) =>
                  typeof v === "string" &&
                  VALID_OVERVIEW_VALUES.some(
                    (val) => val.toLowerCase() === v.toLowerCase()
                  )
              ))
        )
      ) {
        // Mark this as an overview field filter
        return {
          ...filter,
          type: "overviewField",
        };
      }

      // Check if field is a valid direct field or a known filter field
      if (VALID_FILTER_FIELDS.includes(lcField)) {
        // Special case for connection field - treat as overview field filter
        if (
          lcField === "connection" ||
          lcField === "design" ||
          lcField === "type"
        ) {
          return {
            value: filterValue,
            operator: "match",
            type: "overviewField",
          };
        }
        return filter;
      }

      console.warn(`Invalid filter field: ${filter.field}`);
      return null;
    })
    .filter(Boolean); // Remove null entries

  console.log("Server validatedFilters", validatedFilters);
  return validatedFilters;
}
