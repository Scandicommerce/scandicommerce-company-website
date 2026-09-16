import { getOrganizationSameAs } from './constants'
import {
  ORGANIZATION_ADDRESS,
  ORGANIZATION_ALTERNATE_NAMES,
  ORGANIZATION_AREA_SERVED,
  ORGANIZATION_BRAND_NAME,
  ORGANIZATION_CURRENCIES_ACCEPTED,
  ORGANIZATION_DESCRIPTION,
  ORGANIZATION_EMAIL,
  ORGANIZATION_FOUNDERS,
  ORGANIZATION_FOUNDING_DATE,
  ORGANIZATION_GEO,
  ORGANIZATION_KNOWS_ABOUT,
  ORGANIZATION_KNOWS_LANGUAGE,
  ORGANIZATION_LEGAL_NAME,
  ORGANIZATION_LOGO_DIMENSIONS,
  ORGANIZATION_LOGO_PATH,
  ORGANIZATION_NUMBER_OF_EMPLOYEES,
  ORGANIZATION_PAYMENT_ACCEPTED,
  ORGANIZATION_PRICE_RANGE,
  ORGANIZATION_SERVICE_AREA,
  ORGANIZATION_SERVICE_PACKAGES,
  ORGANIZATION_SLOGAN,
  ORGANIZATION_TAX_ID,
  ORGANIZATION_TEAM_MEMBERS,
  ORGANIZATION_TELEPHONE,
  ORGANIZATION_VAT_ID,
} from './organizationConfig'
import { SCHEMA_ORG_CONTEXT, type JsonLdObject, type SchemaOrgImageObject } from './types'
import { normalizeHttpUrl, normalizeSiteOrigin } from './urls'
import { SITES } from '@/lib/site-config'

export function organizationSchemaId(origin: string): string {
  return `${origin}/#organization`
}

export function localBusinessSchemaId(origin: string): string {
  return `${origin}/#localbusiness`
}

function logoObject(origin: string): SchemaOrgImageObject | null {
  const logoUrl = normalizeHttpUrl(`${origin}${ORGANIZATION_LOGO_PATH}`)
  if (!logoUrl) return null
  return {
    '@type': 'ImageObject',
    url: logoUrl,
    width: ORGANIZATION_LOGO_DIMENSIONS.width,
    height: ORGANIZATION_LOGO_DIMENSIONS.height,
  }
}

/**
 * `sameAs`: the other production domain plus verified profiles. Brand
 * disambiguation against "scandiweb" depends on this being complete
 * (SITE-SEO-ARCHITECTURE §11).
 */
export function organizationSameAs(origin: string): string[] {
  const o = normalizeSiteOrigin(origin)
  const others = Object.values(SITES)
    .map((s) => s.origin)
    .filter((u) => u !== o)
  return [...new Set([...others, ...getOrganizationSameAs()])]
}

/**
 * Sitewide `Organization` node (TECHNICAL-SEO-SPEC §12.1). `url` is always
 * the origin that served the page; `@id` is origin-scoped so the two domains
 * reference each other via `sameAs`, not by sharing an id.
 */
export function buildOrganizationNode(origin: string): JsonLdObject | null {
  const o = normalizeSiteOrigin(origin)
  if (!o) return null
  const logo = logoObject(o)
  const node: JsonLdObject = {
    '@type': 'Organization',
    '@id': organizationSchemaId(o),
    name: ORGANIZATION_BRAND_NAME,
    legalName: ORGANIZATION_LEGAL_NAME,
    alternateName: [...ORGANIZATION_ALTERNATE_NAMES],
    url: o,
    ...(logo && { logo, image: logo.url }),
    description: ORGANIZATION_DESCRIPTION,
    telephone: ORGANIZATION_TELEPHONE,
    email: ORGANIZATION_EMAIL,
    address: { ...ORGANIZATION_ADDRESS },
    vatID: ORGANIZATION_VAT_ID,
    taxID: ORGANIZATION_TAX_ID,
    foundingDate: ORGANIZATION_FOUNDING_DATE,
    numberOfEmployees: { ...ORGANIZATION_NUMBER_OF_EMPLOYEES },
    areaServed: [...ORGANIZATION_AREA_SERVED],
    knowsLanguage: [...ORGANIZATION_KNOWS_LANGUAGE],
    knowsAbout: [...ORGANIZATION_KNOWS_ABOUT],
    slogan: ORGANIZATION_SLOGAN,
    founder: [...ORGANIZATION_FOUNDERS],
    member: [...ORGANIZATION_TEAM_MEMBERS],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: ORGANIZATION_TELEPHONE,
        email: ORGANIZATION_EMAIL,
        contactType: 'sales',
        areaServed: ['NO', 'SE', 'DK', 'FI'],
        availableLanguage: ['Norwegian', 'English'],
      },
    ],
    sameAs: organizationSameAs(o),
  }
  return node
}

/**
 * `ProfessionalService` (a LocalBusiness) for the Oslo office — emitted on
 * the .no homepage and contact page only (TECHNICAL-SEO-SPEC §12.1).
 */
export function buildLocalBusinessNode(origin: string): JsonLdObject | null {
  const o = normalizeSiteOrigin(origin)
  if (!o) return null
  const logo = logoObject(o)
  const itemListElement = ORGANIZATION_SERVICE_PACKAGES.map((pkg) => {
    const offerUrl = normalizeHttpUrl(`${o}/tjenester/alle-pakker/${pkg.slug}`)
    return {
      '@type': 'Offer',
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      priceCurrency: 'NOK',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: pkg.price,
        priceCurrency: 'NOK',
        billingDuration: 'P1M',
        unitText: 'month',
      },
      ...(offerUrl && pkg.slug !== 'foundation' ? { url: offerUrl } : {}),
    }
  })
  return {
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': localBusinessSchemaId(o),
    name: ORGANIZATION_BRAND_NAME,
    url: o,
    ...(logo && { image: logo.url }),
    telephone: ORGANIZATION_TELEPHONE,
    email: ORGANIZATION_EMAIL,
    address: { ...ORGANIZATION_ADDRESS },
    geo: { ...ORGANIZATION_GEO },
    priceRange: ORGANIZATION_PRICE_RANGE,
    currenciesAccepted: ORGANIZATION_CURRENCIES_ACCEPTED,
    paymentAccepted: ORGANIZATION_PAYMENT_ACCEPTED,
    areaServed: [...ORGANIZATION_AREA_SERVED],
    serviceArea: { ...ORGANIZATION_SERVICE_AREA },
    parentOrganization: { '@id': organizationSchemaId(o) },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${ORGANIZATION_BRAND_NAME} Shopify services`,
      itemListElement,
    },
  }
}

/** @deprecated kept for callers that still expect a single combined node. */
export function buildOrganizationAndProfessionalService(origin: string): JsonLdObject | null {
  const node = buildOrganizationNode(origin)
  if (!node) return null
  return { '@context': SCHEMA_ORG_CONTEXT, ...node }
}
