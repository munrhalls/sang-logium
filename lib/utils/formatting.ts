import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function firstLetterToUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export interface CategoryNode {
  id: string;
  title: string;
  slug: string;
  path: string;
  icon?: string;
  parentId?: string;
  group?: string;
  groups?: { title: string; items: CategoryNode[] }[];
}
