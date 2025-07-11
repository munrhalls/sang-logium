export interface FiltersMap {
  [key: string]: boolean;
}
export interface DisplayToRealMapType {
  "stock amount": string;
}
export const displayToRealMap: DisplayToRealMapType = {
  "stock amount": "stock",
};
export type FilterValue = string | string[] | { min?: number; max?: number };
export interface FilterItem {
  field: string;
  value: FilterValue;
  filterType?: string;
  operator?: string;
}
export interface RangeFilterItem extends FilterItem {
  operator: string;
  filterType: "range";
}
export interface FilterOptionObject {
  name: string;
  type: "boolean" | "checkbox" | "multiselect" | "radio" | "range" | null;
  options: string[] | null;
  defaultValue: string | null;
  min: number | null;
  max: number | null;
  isMinOnly: boolean | null;
  step: number | null;
}
export type FilterComponentProps = FilterOptionObject;
export type FilterOptions = FilterOptionObject[] | [];
