import type { Metadata } from 'next'
import { urlFor } from '@/sanity/lib/image'
import { buildHreflangFromTranslations } from '@/lib/seo/buildHreflang'
import { OG_LOCALE_BY_LANGUAGE, isLanguage, siteForLanguage } from '@/lib/site-config'
import { isNoIndexPath, normalizeSlug } from '@/lib/routes'
import type { CoalescedPageSeo, SanityImageRef, SiteSettingsForSeo } from '@/lib/sanity/pageSeo'

/** Hard limits from SITE-SEO-ARCHITECTURE §7. Longer values are trimmed at a word boundary. */
export const TITLE_MAX = 60
export const DESCRIPTION_MAX = 155

const BRAND = 'scandicommerce'

/** Last-resort description per site (siteSettings.defaultMetaDescription wins when set). */
const DEFAULT_DESCRIPTION: Record<string, string> = {
  no: 'Scandicommerce er et Shopify Plus-byrå i Oslo med fastpris: bygging, migrering og drift av nettbutikker med integrasjoner mot Vipps, 24SevenOffice, Tripletex og Bring.',
  com: 'scandicommerce is a Shopify Plus partner agency in Oslo, Norway: headed and headless Shopify builds, platform migrations and Nordic integrations at fixed prices.',
}
const DEFAULT_TITLE_TEMPLATE = `%s | ${BRAND}`

/** Path of the generated, branded 1200×630 fallback image (app/opengraph-image.tsx). */
export const DEFAULT_OG_IMAGE_PATH = '/opengraph-image'

/**
 * Convert coalesced page SEO + siteSettings into a Next.js `Metadata` object.
 *
 *   - canonical: self-referencing absolute URL on the serving origin
 *     (or the CMS `canonical` override, which must be absolute);
 *   - hreflang: reciprocal cluster from `translation.metadata`;
 *   - robots: page-level noIndex/noFollow, plus forced noindex for merch and
 *     the human-readable /sitemap page (TECHNICAL-SEO-SPEC Task 5);
 *   - og:image: CMS image → site default → generated brand image.
 */
export function buildMetadata({
  seo,
  settings,
  language,
  pathWithoutLang,
  docType,
}: {
  seo: CoalescedPageSeo
  settings: SiteSettingsForSeo | null
  language: string
  pathWithoutLang: string
  docType?: string
}): Metadata {
  const site = siteForLanguage(language)
  const title = fitTitle(seo.metaTitle, settings?.titleTemplate)
  const description = truncate(seo.metaDescription || DEFAULT_DESCRIPTION[site.key], DESCRIPTION_MAX)

  const currentDoc =
    docType && (seo.docSlug !== undefined || seo.isHomepage)
      ? { _type: docType, slug: seo.docSlug, isHomepage: seo.isHomepage }
      : null

  const { canonical, languages } = buildHreflangFromTranslations({
    translations: seo.translations,
    currentLanguage: language,
    currentDoc,
    currentPath: pathWithoutLang,
    explicitCanonical: seo.canonical,
  })
  const hasLanguages = Object.keys(languages).length > 0

  const forcedNoIndex = isNoIndexPath(normalizeSlug(pathWithoutLang))
  const noIndex = Boolean(seo.noIndex) || forcedNoIndex
  const ogImageUrl = sanityImageToOgUrl(seo.ogImage) ?? `${site.origin}${DEFAULT_OG_IMAGE_PATH}`
  const siteName = settings?.siteName || BRAND

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      // noindex pages must not take part in an hreflang cluster
      languages: hasLanguages && !noIndex ? languages : undefined,
    },
    robots: {
      index: !noIndex,
      follow: !seo.noFollow,
    },
    openGraph: {
      title: truncate(seo.ogTitle || title || undefined, 95),
      description: seo.ogDescription || description,
      url: canonical,
      siteName,
      locale: isLanguage(language) ? OG_LOCALE_BY_LANGUAGE[language] : site.ogLocale,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: seo.ogImageAlt ?? settings?.defaultOgImageAlt ?? siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: truncate(seo.ogTitle || title || undefined, 95),
      description: seo.ogDescription || description,
      images: [ogImageUrl],
    },
  }

  const googleToken = settings?.verification?.google
  const bingToken = settings?.verification?.bing
  if (googleToken || bingToken) {
    metadata.verification = {
      ...(googleToken && { google: googleToken }),
      ...(bingToken && { other: { 'msvalidate.01': bingToken } }),
    }
  }

  // Site-wide kill switch wins over per-page settings.
  if (settings?.robots?.noIndexEntireSite) {
    metadata.robots = { index: false, follow: false }
    metadata.alternates = { canonical }
  }

  return metadata
}

/**
 * Title ≤60: append the brand suffix only when the result still fits; a
 * title that is itself over 60 is left intact up to 70 chars (Google trims
 * visually, a hard cut reads worse) and word-truncated beyond that.
 */
export function fitTitle(metaTitle: string, template: string | undefined): string | undefined {
  const base = (metaTitle ?? '').trim()
  if (!base) return undefined
  const withBrand = applyTitleTemplate(base, template) ?? base
  if (withBrand.length <= TITLE_MAX) return withBrand
  if (base.length <= 70) return base
  return truncate(base, TITLE_MAX)
}

/**
 * Apply the site title template exactly once. Titles that already carry the
 * brand (any casing: "Scandicommerce", "scandicommerce.no", …) are left alone,
 * which is what stops "Om Scandicommerce | … | scandicommerce".
 */
export function applyTitleTemplate(metaTitle: string, template: string | undefined): string | undefined {
  const base = (metaTitle ?? '').trim()
  if (!base) return undefined
  const tpl = template && template.includes('%s') ? template : DEFAULT_TITLE_TEMPLATE
  if (base.toLowerCase().includes(BRAND)) return base
  return tpl.replace('%s', base)
}

/** Trim to `max` characters at a word boundary, adding an ellipsis when cut. */
export function truncate(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined
  const v = value.trim()
  if (v.length <= max) return v
  const cut = v.slice(0, max - 1)
  const atWord = cut.lastIndexOf(' ')
  return `${(atWord > max * 0.6 ? cut.slice(0, atWord) : cut).replace(/[\s,;:|–-]+$/, '')}…`
}

function sanityImageToOgUrl(image: SanityImageRef | undefined): string | undefined {
  if (!image) return undefined
  try {
    return urlFor(image as never).width(1200).height(630).fit('crop').url()
  } catch {
    return undefined
  }
}
