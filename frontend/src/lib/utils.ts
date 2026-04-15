import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes data for serialization between Server and Client components.
 * Useful for Appwrite documents which may contain non-serializable properties.
 */
export function normalize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
