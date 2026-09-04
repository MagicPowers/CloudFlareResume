import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2024-12" -> "Dec 2024". "present" -> "Present". */
export function formatMonth(value: string): string {
  if (value === "present") return "Present";
  const [y, m] = value.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

export function toDate(value: string): Date {
  if (value === "present") return new Date();
  const [y, m] = value.split("-").map(Number);
  return new Date(y, m - 1, 1);
}

/** "1 yr 9 mos" in the LinkedIn house style. */
export function duration(start: string, end: string): string {
  const a = toDate(start);
  const b = toDate(end);
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  months = Math.max(months, 0) + 1;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rem) parts.push(`${rem} mo${rem > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}

export function yearOf(value: string): number {
  return value === "present"
    ? new Date().getFullYear()
    : Number(value.split("-")[0]);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/** D&D ability modifier, rendered with an explicit sign. */
export function abilityModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
