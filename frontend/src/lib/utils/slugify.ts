/**
 * Converts a string into a URL-friendly slug.
 * Example: "Handmade Wooden Bowl" → "handmade-wooden-bowl"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")  // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, "-")   // Replace spaces and underscores with hyphens
    .replace(/--+/g, "-")      // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, "");  // Trim hyphens from start/end
}

/**
 * Truncates a string to a max length and appends '...'
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Generates a unique slug by appending a random suffix.
 * Useful when the base slug might already be taken.
 */
export function uniqueSlug(text: string): string {
  const base = slugify(text);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
}
