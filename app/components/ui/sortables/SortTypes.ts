export interface SortOption {
  name: string;
  displayName?: string;
  type?: "alphabetic" | "numeric" | "date" | "boolean";
  field?: string;
  defaultDirection?: "asc" | "desc";
}
export interface SortState {
  field: string;
  direction: "asc" | "desc";
}
