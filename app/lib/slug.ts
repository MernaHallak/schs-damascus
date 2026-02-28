// Slugify Arabic/English titles into URL-safe slugs.
// Keeps Arabic letters and numbers, and uses "-" for spacing.
export function slugify(input: string): string {
  const s = (input || "").trim().toLowerCase();
  if (!s) return "";

  // Remove Arabic diacritics
  const withoutDiacritics = s.replace(/[\u064B-\u0652\u0670]/g, "");

  return withoutDiacritics
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ensureNonEmptySlug(slug: string, fallback: string) {
  const s = (slug || "").trim();
  return s.length ? s : slugify(fallback);
}
