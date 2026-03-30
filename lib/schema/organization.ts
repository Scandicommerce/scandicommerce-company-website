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
import {
  SCHEMA_ORG_CONTEXT,
  type JsonLdObject,
  type SchemaOrgImageObject,
} from './types'
import { normalizeHttpUrl, normalizeSiteOrigin } from './urls'

export function organizationSchemaId(origin: string): string {
  return `${origin}/#organization`
}

export function buildOrganizationAndProfessionalService(origin: string): JsonLdObject | null {
  const o = normalizeSiteOrigin(origin)
  if (!o) return null

  const logoUrl = normalizeHttpUrl(`${o}${ORGANIZATION_LOGO_PATH}`)
  if (!logoUrl) return null

  const logo: SchemaOrgImageObject = {
    '@type': 'ImageObject',
    url: logoUrl,
    width: ORGANIZATION_LOGO_DIMENSIONS.width,
    height: ORGANIZATION_LOGO_DIMENSIONS.height,
  }

  const sameAs = getOrganizationSameAs()

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
      ...(offerUrl ? { url: offerUrl } : {}),
    }
  })

  const entity: JsonLdObject = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': ['ProfessionalService', 'Organization'],
    '@id': organizationSchemaId(o),
    name: ORGANIZATION_BRAND_NAME,
    legalName: ORGANIZATION_LEGAL_NAME,
    alternateName: [...ORGANIZATION_ALTERNATE_NAMES],
    url: o,
    logo,
    image: logoUrl,
    description: ORGANIZATION_DESCRIPTION,
    telephone: ORGANIZATION_TELEPHONE,
    email: ORGANIZATION_EMAIL,
    address: { ...ORGANIZATION_ADDRESS },
    geo: { ...ORGANIZATION_GEO },
    vatID: ORGANIZATION_VAT_ID,
    taxID: ORGANIZATION_TAX_ID,
    foundingDate: ORGANIZATION_FOUNDING_DATE,
    numberOfEmployees: { ...ORGANIZATION_NUMBER_OF_EMPLOYEES },
    priceRange: ORGANIZATION_PRICE_RANGE,
    currenciesAccepted: ORGANIZATION_CURRENCIES_ACCEPTED,
    paymentAccepted: ORGANIZATION_PAYMENT_ACCEPTED,
    areaServed: [...ORGANIZATION_AREA_SERVED],
    serviceArea: { ...ORGANIZATION_SERVICE_AREA },
    knowsLanguage: [...ORGANIZATION_KNOWS_LANGUAGE],
    knowsAbout: [...ORGANIZATION_KNOWS_ABOUT],
    slogan: ORGANIZATION_SLOGAN,
    brand: {
      '@type': 'Brand',
      name: ORGANIZATION_BRAND_NAME,
      url: o,
    },
    founder: [...ORGANIZATION_FOUNDERS],
    member: [...ORGANIZATION_TEAM_MEMBERS],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${ORGANIZATION_BRAND_NAME} Shopify services`,
      itemListElement,
    },
  }

  if (sameAs.length) entity.sameAs = sameAs

  return entity
}
