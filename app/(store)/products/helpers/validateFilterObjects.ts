const VALID_DIRECT_FIELDS = ["name", "brand", "price", "stock", "sku"];
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
export default function validateFilterObjects(
  rawFilters: Array<{
    field: string;
    value: string | number | boolean | Array<string | number | boolean>;
  }>,
) {
  const validatedFilters = rawFilters
    .map((filter) => {
      const lcField = filter.field.toLowerCase();
      if (
        SPECIAL_FIELD_MAPPINGS[lcField as keyof typeof SPECIAL_FIELD_MAPPINGS]
      ) {
        return SPECIAL_FIELD_MAPPINGS[
          lcField as keyof typeof SPECIAL_FIELD_MAPPINGS
        ];
      }
      const filterValue =
        typeof filter.value === "string" ? filter.value : String(filter.value);
      if (
        VALID_OVERVIEW_VALUES.some(
          (val) =>
            val.toLowerCase() === filterValue.toLowerCase() ||
            (Array.isArray(filter.value) &&
              filter.value.some(
                (v) =>
                  typeof v === "string" &&
                  VALID_OVERVIEW_VALUES.some(
                    (val) => val.toLowerCase() === v.toLowerCase(),
                  ),
              )),
        )
      ) {
        return {
          ...filter,
          type: "overviewField",
        };
      }
      if (VALID_FILTER_FIELDS.includes(lcField)) {
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
    .filter(Boolean); 
  return validatedFilters;
}
