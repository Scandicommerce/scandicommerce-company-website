import { LOCALE_IDS } from "@/sanity/lib/languages";
import {
  buildLocaleUrl,
  getHomepagePrefixForLocale,
  isDomainSplitActive,
  X_DEFAULT_LANGUAGE,
} from "@/lib/hreflang";
import type { PageSeoTranslation } from "@/lib/sanity/pageSeo";

/**
 * Convert a list of translated siblings (from `translation.metadata`) into
 * the `{ canonical, languages }` shape consumed by `buildMetadata`.
 *
 * Rules (per project decision):
 *   - NO-language URLs live on the .no domain WITHOUT a `/no` path prefix.
 *   - EN-language URLs live on the .com domain WITHOUT an `/en` path prefix.
 *   - SV / DA / DE URLs live on the .com domain WITH their `/{locale}` prefix.
 *   - x-default points at the EN URL.
 *   - Translations marked `noIndex: true` are excluded from hreflang
 *     (search engines should not be told they are alternates).
 *   - If `translations` is empty/null we still emit a hreflang map for the
 *     current locale only (no cross-language pollution).
 *   - Caller-provided `explicitCanonical` (from `seoExtended.canonical`)
 *     always wins as the canonical URL.
 *
 * The function never throws; missing data simply yields a sparser map.
 */
export function buildHreflangFromTranslations({
  translations,
  currentLanguage,
  currentDoc,
  currentPath,
  explicitCanonical,
}: {
  translations: PageSeoTranslation[] | null | undefined;
  currentLanguage: string;
  /**
   * The current page's Sanity document data. When provided, the canonical
   * URL is derived from `slugForRoute(currentDoc)` rather than the request
   * path — necessary so homepages of sv/da/de get their country-code prefix
   * injected (e.g. https://scandicommerce.com/se for SV homepage).
   */
  currentDoc?: {
    _type: string;
    slug?: string;
    isHomepage?: boolean;
  } | null;
  /**
   * Request path without leading locale segment. Used as a fallback when no
   * Sanity doc is available (e.g. /sitemap, /shopify/shopify_migration with
   * no migratePage doc).
   */
  currentPath?: string;
  /** `seoExtended.canonical` override, if set. */
  explicitCanonical?: string;
}): { canonical?: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};

  // Compute the current locale's canonical URL.
  const currentPathResolved = currentDoc
    ? slugForRoute({ ...currentDoc, language: currentLanguage })
    : (currentPath ?? "").replace(/^\/+|\/+$/g, "");
  const currentUrl = buildLocaleUrl(currentLanguage, currentPathResolved);
  if (currentUrl) {
    languages[currentLanguage] = currentUrl;
  }

  // Translations from `translation.metadata`. Each entry tells us the actual
  // slug for that language, so SEO doesn't lie even when slugs differ
  // (e.g. EN `/about` vs NO `/om-oss`).
  if (Array.isArray(translations)) {
    for (const t of translations) {
      if (!t || !t.doc) continue;
      const lang = t.doc.language || t._key;
      if (!lang || !LOCALE_IDS.includes(lang)) continue;
      if (lang === currentLanguage) continue; // already added above
      if (t.doc.noIndex) continue;

      const path = slugForRoute(t.doc);
      const url = buildLocaleUrl(lang, path);
      if (url) languages[lang] = url;
    }
  }

  // x-default → EN (project decision; falls back to the only locale we have).
  const xDefaultUrl =
    languages[X_DEFAULT_LANGUAGE] ?? Object.values(languages)[0];
  if (xDefaultUrl) {
    languages["x-default"] = xDefaultUrl;
  }

  // Don't emit hreflang at all when only the current locale exists; tagging
  // a page as having alternates when there are none is misleading.
  const hasCrossLocale = Object.keys(languages).some(
    (k) => k !== currentLanguage && k !== "x-default"
  );
  const finalLanguages = hasCrossLocale ? languages : {};

  const canonical =
    explicitCanonical && explicitCanonical.trim()
      ? explicitCanonical
      : currentUrl || undefined;

  return { canonical, languages: finalLanguages };
}

/**
 * Resolve a route-friendly path for a translation doc.
 *
 * Single source of truth for "slug → URL" path:
 *   - Homepages share `slug: "/"` across all languages, so we inject the
 *     locale-specific country-code prefix (`se`/`dk`/`de`) to keep
 *     sv/da/de homepages distinct from the EN homepage on the shared
 *     `.com` host.
 *   - Section pages (sv/da/de) already encode their country-code prefix in
 *     the slug itself (e.g. `se/about`). We trust the slug verbatim.
 *   - Blog posts and posts always live under `resources/<slug>` regardless
 *     of language (matches the data convention).
 *
 * The `language` arg is required for homepage prefix lookup.
 */
export function slugForRoute(doc: {
  _type: string;
  slug?: string;
  isHomepage?: boolean;
  language?: string;
}): string {
  if (!doc) return "";

  const rawSlug = (doc.slug ?? "").replace(/^\/+|\/+$/g, "");
  const treatAsHomepage = doc.isHomepage || rawSlug === "" || rawSlug === "home";

  if (treatAsHomepage) {
    return getHomepagePrefixForLocale(doc.language ?? "");
  }
  if (doc._type === "blogPost" || doc._type === "post") {
    return `resources/${rawSlug}`;
  }
  return rawSlug;
}

// Re-export `isDomainSplitActive` for caller diagnostics (e.g. debugging
// canonical generation in preview environments).
export { isDomainSplitActive };
