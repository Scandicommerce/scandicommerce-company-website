import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import { buildHreflangFromTranslations } from "@/lib/seo/buildHreflang";
import type {
  CoalescedPageSeo,
  SanityImageRef,
  SiteSettingsForSeo,
} from "@/lib/sanity/pageSeo";

/**
 * Convert coalesced page SEO + siteSettings into a Next.js `Metadata` object.
 *
 * Inputs:
 *   - seo: result of `coalescePageSeo(doc, settings)`
 *   - settings: raw siteSettings document (for title template, verification)
 *   - language: route locale (used for hreflang + og:locale)
 *   - pathWithoutLang: route path without leading locale segment (used for
 *     canonical + hreflang alternates). Use "" for the homepage.
 *
 * Behaviour:
 *   - title is wrapped with `settings.titleTemplate` (e.g. "%s | scandicommerce")
 *     when present. Already-suffixed titles are detected and left alone.
 *   - canonical respects an explicit `seo.canonical` override; otherwise it is
 *     derived from the locale's production host (.no for NO content, .com
 *     for everything else) plus the appropriate path prefix.
 *   - hreflang is built from `seo.translations` (the `translation.metadata`
 *     siblings), so URLs respect per-locale slug differences and only emit
 *     alternates for translations that actually exist + are indexable.
 *   - robots reflects `seo.noIndex` / `seo.noFollow`.
 *   - openGraph + twitter use the same image (1200×630 derived via `urlFor`).
 *   - verification reads Google + Bing tokens from siteSettings.
 */
export function buildMetadata({
  seo,
  settings,
  language,
  pathWithoutLang,
  docType,
}: {
  seo: CoalescedPageSeo;
  settings: SiteSettingsForSeo | null;
  language: string;
  pathWithoutLang: string;
  /**
   * Document `_type` for the current page (e.g. "landingPage", "aboutPage").
   * Combined with `seo.docSlug` + `seo.isHomepage` it drives correct hreflang
   * URL generation. Omit for routes without a backing Sanity doc; the helper
   * will fall back to `pathWithoutLang` for the current locale URL.
   */
  docType?: string;
}): Metadata {
  const title = applyTitleTemplate(seo.metaTitle, settings?.titleTemplate);
  const description = seo.metaDescription || undefined;

  const currentDoc =
    docType && (seo.docSlug !== undefined || seo.isHomepage)
      ? {
          _type: docType,
          slug: seo.docSlug,
          isHomepage: seo.isHomepage,
        }
      : null;

  const { canonical, languages } = buildHreflangFromTranslations({
    translations: seo.translations,
    currentLanguage: language,
    currentDoc,
    currentPath: pathWithoutLang,
    explicitCanonical: seo.canonical,
  });
  const hasLanguages = Object.keys(languages).length > 0;

  const ogImageUrl = sanityImageToOgUrl(seo.ogImage);
  const siteName = settings?.siteName;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      languages: hasLanguages ? languages : undefined,
    },
    robots: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
    },
    openGraph: {
      title: seo.ogTitle || title || undefined,
      description: seo.ogDescription || description,
      url: canonical,
      siteName,
      locale: language,
      type: "website",
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: seo.ogImageAlt ?? settings?.defaultOgImageAlt,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle || title || undefined,
      description: seo.ogDescription || description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };

  const googleToken = settings?.verification?.google;
  const bingToken = settings?.verification?.bing;
  if (googleToken || bingToken) {
    metadata.verification = {
      ...(googleToken && { google: googleToken }),
      ...(bingToken && { other: { "msvalidate.01": bingToken } }),
    };
  }

  // Site-wide kill switch wins over per-page settings.
  if (settings?.robots?.noIndexEntireSite) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

function applyTitleTemplate(
  metaTitle: string,
  template: string | undefined
): string | undefined {
  if (!metaTitle) return undefined;
  if (!template || !template.includes("%s")) return metaTitle;
  // Avoid double-suffixing if the editor already added it manually.
  const suffix = template.replace("%s", "").trim();
  if (suffix && metaTitle.includes(suffix)) return metaTitle;
  return template.replace("%s", metaTitle);
}

function sanityImageToOgUrl(image: SanityImageRef | undefined): string | undefined {
  if (!image) return undefined;
  try {
    return urlFor(image as never).width(1200).height(630).fit("crop").url();
  } catch {
    return undefined;
  }
}
