import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getData() {
  const response = await fetch("https://api.astronomyapi.com/api/v2/bodies/positions")
}