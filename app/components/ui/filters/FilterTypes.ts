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

// Used for filtering products in query params and API
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

// Used for UI filter configuration
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

// Alias type to make FilterItem component use FilterOptionObject
export type FilterComponentProps = FilterOptionObject;

export type FilterOptions = FilterOptionObject[] | [];
