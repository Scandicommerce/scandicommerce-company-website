import type { ImageObject, Organization, PostalAddress, WithContext } from 'schema-dts'
import { urlFor } from '@/sanity/lib/image'
import type { SiteSettingsForSeo, SanityImageRef } from '@/lib/sanity/pageSeo'
import { organizationSchemaId } from '@/lib/schema/organization'
import { normalizeHttpUrl, normalizeSiteOrigin } from '@/lib/schema/urls'
import type { JsonLdObject } from '@/lib/schema/types'

function imageObjectFromSanity(img: SanityImageRef | undefined): ImageObject | undefined {
  if (!img) return undefined
  try {
    const u = urlFor(img as never).width(512).height(512).fit('max').url()
    const url = normalizeHttpUrl(u)
    if (!url) return undefined
    return { '@type': 'ImageObject', url }
  } catch {
    return undefined
  }
}

function postalFromOrg(addr: Record<string, unknown> | undefined): PostalAddress | undefined {
  if (!addr) return undefined
  const street = typeof addr.streetAddress === 'string' ? addr.streetAddress : undefined
  const locality = typeof addr.locality === 'string' ? addr.locality : undefined
  const postal = typeof addr.postalCode === 'string' ? addr.postalCode : undefined
  const country = typeof addr.country === 'string' ? addr.country : undefined
  if (!street && !locality && !postal && !country) return undefined
  return {
    '@type': 'PostalAddress',
    ...(street && { streetAddress: street }),
    ...(locality && { addressLocality: locality }),
    ...(postal && { postalCode: postal }),
    ...(country && { addressCountry: country }),
  }
}

function sameAsFromProfiles(
  profiles: Record<string, string | undefined> | undefined
): string[] | undefined {
  if (!profiles) return undefined
  const urls = Object.values(profiles).filter(
    (v): v is string => typeof v === 'string' && /^https?:\/\//i.test(v.trim())
  )
  return urls.length ? urls : undefined
}

/**
 * Organization JSON-LD from `siteSettings` (schema.org / `schema-dts`).
 * Returns `null` when there is not enough CMS data — caller should fall back
 * to the legacy static graph (`buildOrganizationAndProfessionalService`).
 */
export function buildOrganizationJsonLdFromSiteSettings(
  origin: string,
  settings: SiteSettingsForSeo | null
): JsonLdObject | null {
  const o = normalizeSiteOrigin(origin)
  if (!o || !settings) return null

  const orgBlock = settings.organization as Record<string, unknown> | undefined
  const legalName =
    (typeof orgBlock?.legalName === 'string' && orgBlock.legalName.trim()) ||
    (typeof settings.siteName === 'string' && settings.siteName.trim()) ||
    ''
  if (!legalName) return null

  const brandName =
    (typeof settings.siteName === 'string' && settings.siteName.trim()) || legalName

  const logo = imageObjectFromSanity(settings.logo) ?? imageObjectFromSanity(settings.defaultOgImage)
  const address = postalFromOrg(orgBlock?.address as Record<string, unknown> | undefined)
  const sameAs = sameAsFromProfiles(settings.socialProfiles)

  const phone = typeof orgBlock?.phone === 'string' ? orgBlock.phone.trim() : undefined
  const email = typeof orgBlock?.email === 'string' ? orgBlock.email.trim() : undefined
  const desc =
    typeof orgBlock?.description === 'string' ? orgBlock.description.trim() : undefined
  const foundingYear = orgBlock?.foundingYear
  const foundingDate =
    typeof foundingYear === 'number' && Number.isFinite(foundingYear)
      ? `${foundingYear}-01-01`
      : undefined

  const node: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationSchemaId(o),
    name: brandName,
    legalName,
    url: o,
    ...(logo && { logo }),
    ...(desc && { description: desc }),
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    ...(address && { address }),
    ...(foundingDate && { foundingDate }),
    ...(sameAs && { sameAs }),
  }

  return node as unknown as JsonLdObject
}
