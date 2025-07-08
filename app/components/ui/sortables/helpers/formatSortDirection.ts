export default function formatSortDirection(dir: string) {
  if (dir === "asc") return "Ascending";
  if (dir === "desc") return "Descending";
  return dir.charAt(0).toUpperCase() + dir.slice(1); 
}
