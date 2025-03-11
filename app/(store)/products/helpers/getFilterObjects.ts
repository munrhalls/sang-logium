export default function getFilterObjects(searchParamsInput: {
  [key: string]: string | string[];
}) {
  const filterObjects = [];

  for (const field in searchParamsInput) {
    const value = searchParamsInput[field];
    if (!value) continue;

    let operator = "==";

    if (field === "priceRange") operator = "<=";
    if (field === "inStock") operator = ">";
    if (field === "design" || field === "connection") operator = "in";

    filterObjects.push({
      field: field === "inStock" ? "stock" : field,
      operator,
      value: field === "inStock" ? 0 : value,
    });
  }
  return filterObjects;
}
