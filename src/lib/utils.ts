import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createSlug = (text?: string): string => {
  if (!text) return ""; // ✅ prevent crash

  return text
    .toLowerCase()
    .replace(/[()]/g, "") // remove brackets
    .replace(/\+/g, "-plus-") // keep +
    .replace(/\s+/g, "-") // spaces -> -
    .replace(/-+/g, "-") // remove duplicate -
    .replace(/^-|-$/g, ""); // trim
};

export const formatText = (text?: string) =>
  text ? text.replace(/-/g, " ").toUpperCase() : "";

export function getDeviceId() {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}

export function formatCourseTitle(slug: string) {
  let title = decodeURIComponent(slug);

  // -plus- => +
  title = title.replace(/-plus-/gi, "+");

  // Replace slug hyphens with spaces
  title = title.replace(/-/g, " ");

  title = title.replace(/\s*\(\s*/g, " (");
  title = title.replace(/\s*\)\s*/g, ")");

  // Capitalize only English words, keep Gujarati same
  title = title.replace(/\b[a-z]/gi, (c) => c.toUpperCase());

  return title.trim();
}
