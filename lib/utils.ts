import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as FA from "react-icons/fa";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
