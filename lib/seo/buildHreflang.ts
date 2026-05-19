import { LOCALE_IDS } from "@/sanity/lib/languages";
import {
  buildLocaleUrl,
  X_DEFAULT_LANGUAGE,
} from "@/lib/hreflang";
import type { PageSeoTranslation } from "@/lib/sanity/pageSeo";

/** Locale-specific blog index slug (matches the renamed index routes). */
const BLOG_INDEX_SLUG: Record<string, string> = {
  no: "blogg",
  en: "blog",
  sv: "blogg",
  da: "blog",
  de: "blog",
};

/**
 * Hreflang + canonical from `translation.metadata` siblings.
 *
 * Domain split:
 *   - NO → scandicommerce.no (no /no prefix)
 *   - EN → scandicommerce.com (no /en prefix)
 *   - SV / DA / DE → scandicommerce.com/{locale}/... only (never .no)
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
  currentDoc?: {
    _type: string;
    slug?: string;
    isHomepage?: boolean;
  } | null;
  currentPath?: string;
  explicitCanonical?: string;
}): { canonical?: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};

  const currentPathResolved = currentDoc
    ? slugForRoute({ ...currentDoc, language: currentLanguage })
    : (currentPath ?? "").replace(/^\/+|\/+$/g, "");

  const currentUrl = buildLocaleUrl(currentLanguage, currentPathResolved);
  if (currentUrl) {
    languages[currentLanguage] = currentUrl;
  }

  if (Array.isArray(translations)) {
    for (const t of translations) {
      if (!t?.doc) continue;
      const lang = t.doc.language || t._key;
      if (!lang || !LOCALE_IDS.includes(lang)) continue;
      if (lang === currentLanguage) continue;
      if (t.doc.noIndex) continue;

      const path = slugForRoute(t.doc);
      const url = buildLocaleUrl(lang, path);
      if (!url) continue;

      languages[lang] = url;
    }
  }

  const xDefaultUrl =
    languages[X_DEFAULT_LANGUAGE] ?? Object.values(languages)[0];
  if (xDefaultUrl) {
    languages["x-default"] = xDefaultUrl;
  }

  const hasCrossLocale = Object.keys(languages).some(
    (k) => k !== currentLanguage && k !== "x-default"
  );
  const finalLanguages = hasCrossLocale ? languages : {};

  const canonical =
    explicitCanonical?.trim() ? explicitCanonical : currentUrl || undefined;

  return { canonical, languages: finalLanguages };
}

/**
 * Sanity slug → path segment for `buildLocaleUrl` (before locale prefix rules).
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
    return "";
  }
  if (doc._type === "blogPost" || doc._type === "post") {
    const indexSlug = BLOG_INDEX_SLUG[doc.language ?? ""] ?? "blog";
    return `${indexSlug}/${rawSlug}`;
  }
  return rawSlug;
}

