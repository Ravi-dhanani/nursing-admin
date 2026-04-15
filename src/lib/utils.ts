import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createSlug = (text?: string): string => {
  if (!text) return ""; // ✅ prevent crash

  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

export const formatText = (text?: string) =>
  text ? text.replace(/-/g, " ").toUpperCase() : "";
