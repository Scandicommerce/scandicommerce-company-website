import { client } from "@/sanity/lib/client";
import {
  pageSeoQuery,
  pageSeoBySlugQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";
import { defaultLanguage } from "@/sanity/lib/languages";
import { stegaClean } from "@sanity/client/stega";

/**
 * Server-side helpers for `generateMetadata`. All fetches use the published
 * client (no stega encoding) so the resulting strings are safe to emit into
 * <title> / <meta> tags and JSON-LD.
 */

export type PageSeoExtended = {
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SanityImageRef;
  ogImageAlt?: string;
  structuredDataType?: string;
  noIndex?: boolean;
  noFollow?: boolean;
};

export type PageSeoLegacy = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImageRef;
};

export type SanityImageRef = {
  asset?: { _ref?: string; _id?: string; url?: string };
  _ref?: string;
  [key: string]: unknown;
};

/** Translated sibling of a page, resolved via translation.metadata. */
export type PageSeoTranslation = {
  _key: string;
  doc: {
    _id: string;
    _type: string;
    language: string;
    slug?: string;
    isHomepage?: boolean;
    noIndex?: boolean;
  } | null;
};

export type PageSeoDoc = {
  _id: string;
  _type: string;
  language?: string;
  pageTitle?: string;
  slug?: string;
  isHomepage?: boolean;
  seoExtended?: PageSeoExtended | null;
  seo?: PageSeoLegacy | null;
  /** Translated siblings via @sanity/document-internationalization translation.metadata. */
  translations?: PageSeoTranslation[] | null;
  /** FAQ pairs extracted from page sections (for FAQPage JSON-LD). */
  faqItems?: Array<{ question?: string | null; answer?: string | null } | null> | null;
};

export type SiteSettingsForSeo = {
  siteName?: string;
  titleTemplate?: string;
  defaultMetaDescription?: string;
  favicon?: SanityImageRef;
  logo?: SanityImageRef;
  defaultOgImage?: SanityImageRef;
  defaultOgImageAlt?: string;
  verification?: { google?: string; bing?: string };
  robots?: { noIndexEntireSite?: boolean };
  socialProfiles?: Record<string, string | undefined>;
  organization?: Record<string, unknown>;
};

// Metadata changes rarely; cache aggressively. Tag so we can revalidate on
// Sanity writes via revalidateTag if desired in a follow-up.
const FETCH_OPTIONS = {
  next: { revalidate: 3600, tags: ["page-seo"] as string[] },
};

/**
 * Fetch the SEO data for a page identified by document `_type` + slug + language.
 * Returns `null` when no matching document exists.
 *
 * - Use empty `slug` ("") for the homepage; the query falls back to
 *   `slug.current == "home"` OR `isHomepage == true`.
 * - Caller is responsible for resolving the document `_type` (typically via
 *   `resolvePageByPath`).
 */
export async function getPageSeo({
  type,
  slug,
  language,
}: {
  type: string;
  slug: string;
  language: string;
}): Promise<PageSeoDoc | null> {
  try {
    return await client.fetch<PageSeoDoc | null>(
      pageSeoQuery,
      { type, slug, language: language || defaultLanguage },
      FETCH_OPTIONS
    );
  } catch (err) {
    // Never break the page render because of a metadata fetch.
    console.error("[pageSeo] getPageSeo failed", { type, slug, language, err });
    return null;
  }
}

/**
 * Fetch the SEO data for a page where the document `_type` is one of a known
 * set, but the slug alone is unique enough to identify the doc. Used for
 * blog post / case study / package detail-style routes.
 */
export async function getPageSeoBySlug({
  types,
  slug,
  language,
}: {
  types: string[];
  slug: string;
  language: string;
}): Promise<PageSeoDoc | null> {
  try {
    return await client.fetch<PageSeoDoc | null>(
      pageSeoBySlugQuery,
      { types, slug, language: language || defaultLanguage },
      FETCH_OPTIONS
    );
  } catch (err) {
    console.error("[pageSeo] getPageSeoBySlug failed", {
      types,
      slug,
      language,
      err,
    });
    return null;
  }
}

/**
 * Fetch the `siteSettings` document for the given language. Used to populate
 * fallback metadata (default OG image, site name, verification) and the
 * site-wide noindex kill switch.
 */
export async function getSiteSettings(
  language: string
): Promise<SiteSettingsForSeo | null> {
  try {
    return await client.fetch<SiteSettingsForSeo | null>(
      siteSettingsQuery,
      { language: language || defaultLanguage },
      FETCH_OPTIONS
    );
  } catch (err) {
    console.error("[pageSeo] getSiteSettings failed", { language, err });
    return null;
  }
}

/**
 * Coalesce `seoExtended` → legacy `seo` → derived defaults into a single
 * normalised shape that `buildMetadata` consumes. Pure, side-effect-free.
 */
export function coalescePageSeo(
  doc: PageSeoDoc | null,
  settings: SiteSettingsForSeo | null
) {
  const ext = doc?.seoExtended ?? undefined;
  const legacy = doc?.seo ?? undefined;
  const pageTitle = doc?.pageTitle;

  // stegaClean strips invisible Vercel Visual Editing markers that can leak
  // into <title> / <meta> tags when the client doesn't explicitly disable stega.
  const clean = (v: string | undefined | null): string =>
    stegaClean(v ?? "") as string;

  const metaTitle = clean(ext?.metaTitle) || clean(legacy?.metaTitle) || clean(pageTitle) || "";
  const metaDescription =
    clean(ext?.metaDescription) ||
    clean(legacy?.metaDescription) ||
    clean(settings?.defaultMetaDescription) ||
    "";

  return {
    metaTitle,
    metaDescription,
    canonical: clean(ext?.canonical) || undefined,
    ogTitle: clean(ext?.ogTitle) || metaTitle,
    ogDescription: clean(ext?.ogDescription) || metaDescription,
    ogImage: ext?.ogImage ?? legacy?.ogImage ?? settings?.defaultOgImage,
    ogImageAlt: clean(ext?.ogImageAlt) || clean(settings?.defaultOgImageAlt) || undefined,
    structuredDataType: clean(ext?.structuredDataType) || "none",
    noIndex: Boolean(ext?.noIndex),
    noFollow: Boolean(ext?.noFollow),
    pageTitle: clean(pageTitle),
    isHomepage: Boolean(doc?.isHomepage),
    translations: doc?.translations ?? null,
    docLanguage: doc?.language,
    docSlug: doc?.slug,
  };
}

export type CoalescedPageSeo = ReturnType<typeof coalescePageSeo>;
