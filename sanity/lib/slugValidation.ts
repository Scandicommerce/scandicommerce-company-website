import type { SlugValue, ValidationContext } from "sanity";

const LOCALE_PREFIX = /^(en|no|sv|da|de|se|dk)(\/|$)/i;

/**
 * URL taxonomy rules (SITE-SEO-ARCHITECTURE §6, TECHNICAL-SEO-SPEC Task 10):
 *   - lowercase, digits and hyphens only; no underscores, no spaces
 *   - no locale / country prefix (the domain and the /sv /da /de route carry the locale)
 *   - at most 3 segments
 *
 * Returns `true` when valid, otherwise an error message for the Studio.
 */
export function validatePublicSlug(
  value: SlugValue | undefined,
  _context?: ValidationContext
): true | string {
  const current = value?.current?.trim();
  if (!current) return true; // `required()` handles emptiness
  if (current === "/") return true; // homepage
  if (/[A-Z]/.test(current)) return "Use lowercase only – URLs are case-sensitive.";
  if (/\s/.test(current)) return "No spaces – use hyphens.";
  if (/_/.test(current)) return "No underscores – use hyphens.";
  if (LOCALE_PREFIX.test(current)) return "Do not start the slug with a language code (en/, no/, sv/, da/, de/). The domain and route carry the locale.";
  if (/^\/|\/$/.test(current)) return "No leading or trailing slash.";
  const segments = current.split("/");
  if (segments.length > 3) return "Maximum 3 path segments.";
  for (const seg of segments) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(seg)) {
      return `Segment "${seg}" may only contain a–z, 0–9 and single hyphens.`;
    }
  }
  return true;
}
