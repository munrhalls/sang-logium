export default function getSelectedSort(searchParams) {
  const sortField = searchParams.sort || "default";
  const sortDir = searchParams.dir || "asc";

  return {
    field: sortField,
    direction: sortDir,
  };
}
