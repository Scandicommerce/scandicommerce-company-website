/**
 * Canonical organization / ProfessionalService facts for JSON-LD (AIO-oriented long description).
 * Public URLs in schema are resolved against the request `origin` in `organization.ts`.
 */
export const ORGANIZATION_BRAND_NAME = 'scandicommerce'

/** WebSite JSON-LD (homepage): shorter blurb than Organization `description`. */
export const WEB_SITE_DESCRIPTION =
  'scandicommerce is a Shopify Plus partner agency in Oslo, Norway, that serves Norway and the wider Nordics with fixed-price, productized e-commerce services. The team ships headed Shopify Online Store experiences and headless storefronts using Sanity, the Shopify Storefront API, and Hydrogen, and ties the stack to growth with Klaviyo, Make, CRO, technical SEO, migrations, and ongoing retainers.'

export const WEB_SITE_ALTERNATE_NAME = 'scandicommerce.no'

export const WEB_SITE_IN_LANGUAGE = ['nb-NO', 'en'] as const

export const ORGANIZATION_LEGAL_NAME = 'scandicommerce'

export const ORGANIZATION_ALTERNATE_NAMES = ['scandicommerce.no', 'Scandicommerce AS'] as const

export const ORGANIZATION_DESCRIPTION =
  'scandicommerce is a Norwegian Shopify Plus partner agency based in Oslo that delivers productized e-commerce services at fixed prices with no billable hours. The team serves brands across Norway and the Nordics by combining headed Shopify Online Store themes with headless commerce programs that use Sanity as a headless CMS, Shopify’s Storefront API, and Shopify Hydrogen for custom frontends. Core services include full store builds and migrations from WooCommerce, Magento, and Drupal Commerce to Shopify Plus, conversion rate optimization, technical SEO, custom Liquid theme development, third-party app integrations, marketing automation with Klaviyo and Make (Integromat), performance optimization, AI-driven personalization, and ongoing retainer support. Every engagement is packaged as transparent, fixed-price tiers from a 3,500 NOK/month Foundation plan to a 30,000+ NOK/month Enterprise plan, without binding contracts. scandicommerce supports more than 20 Norwegian e-commerce brands and has helped clients generate more than €12 million in revenue.'

export const ORGANIZATION_TELEPHONE = '+4733394000'

export const ORGANIZATION_EMAIL = 'post@scandicommerce.no'

export const ORGANIZATION_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Drammensveien 167',
  postalCode: '0277',
  addressLocality: 'Oslo',
  addressRegion: 'Oslo',
  addressCountry: 'NO',
} as const

export const ORGANIZATION_GEO = {
  '@type': 'GeoCoordinates',
  latitude: 59.9199,
  longitude: 10.6916,
} as const

export const ORGANIZATION_VAT_ID = 'NO933434346MVA'

export const ORGANIZATION_TAX_ID = '933434346'

export const ORGANIZATION_FOUNDING_DATE = '2024'

export const ORGANIZATION_NUMBER_OF_EMPLOYEES = {
  '@type': 'QuantitativeValue',
  minValue: 4,
  maxValue: 10,
} as const

export const ORGANIZATION_PRICE_RANGE = '3500–30000+ NOK/month'

export const ORGANIZATION_CURRENCIES_ACCEPTED = 'NOK'

export const ORGANIZATION_PAYMENT_ACCEPTED = 'Invoice, Bank Transfer'

export const ORGANIZATION_AREA_SERVED = [
  { '@type': 'Country', name: 'Norway' },
  { '@type': 'Place', name: 'Scandinavia' },
  { '@type': 'Place', name: 'Nordics' },
] as const

export const ORGANIZATION_SERVICE_AREA = {
  '@type': 'GeoCircle',
  geoMidpoint: {
    '@type': 'GeoCoordinates',
    latitude: 59.9199,
    longitude: 10.6916,
  },
  geoRadius: '5000 km',
} as const

export const ORGANIZATION_KNOWS_LANGUAGE = ['nb', 'nn', 'en'] as const

export const ORGANIZATION_KNOWS_ABOUT = [
  'scandicommerce architects and maintains Shopify Plus storefronts for Norwegian and Nordic merchants, pairing Liquid-driven Online Store themes with composable, headless experiences when a brand needs full frontend control.',
  'The agency connects Sanity content to Shopify commerce data through the Shopify Storefront API so editorial teams can publish freely while checkout, inventory, and promotions stay in Shopify.',
  'Engineers at scandicommerce build Hydrogen-based frontends when clients want React performance, streaming, and bespoke UX on top of Shopify’s commerce primitives.',
  'Implementation work spans migrations from WooCommerce, Magento, and Drupal Commerce into Shopify Plus with careful URL, redirect, and data hygiene for Oslo-based and Nordic teams.',
  'Technical SEO programs focus on crawl clarity, structured data, and performance for Shopify stores that must compete in Norway and neighboring Nordic markets.',
  'Conversion rate optimization engagements translate analytics, user research, and experimentation into measurable lifts on both headed themes and headless routes.',
  'Klaviyo is used to orchestrate lifecycle email and SMS automation that reflects real purchase behavior fed from Shopify and connected data sources.',
  'Make (Integromat) workflows stitch Shopify to ERPs, spreadsheets, support tools, and legacy systems so operators spend less time on manual data entry.',
  'The team integrates Shopify apps, custom app proxies, and private middleware when off-the-shelf connectors cannot cover a Nordic retailer’s requirements.',
  'Vipps and other local payment expectations are folded into checkout flows so Norwegian shoppers see familiar, trusted payment methods.',
  'B2B and B2C rollouts share the same disciplined playbook, whether the buyer is a procurement portal or a direct consumer in Scandinavia.',
  'Multi-store and multi-market setups receive governance models that keep catalogs, pricing, and languages aligned as brands expand beyond Oslo.',
  'Shopify POS and unified commerce scenarios are supported when retailers need consistent inventory between physical locations in Norway and their online channel.',
  'AI-assisted merchandising and personalization experiments are applied responsibly with clear measurement plans tied to revenue outcomes.',
] as const

export const ORGANIZATION_SLOGAN = 'Shopify Plus-byrå i Norge med fastpris pakker'

export const ORGANIZATION_FOUNDERS = [
  { '@type': 'Person', name: 'Christian Fredrik Konow', jobTitle: 'Founder & CEO' },
  { '@type': 'Person', name: 'Chris Willy Jensen', jobTitle: 'Co-founder & CTO' },
] as const

export const ORGANIZATION_TEAM_MEMBERS = [
  { '@type': 'Person', name: 'Tim Teigen', jobTitle: 'Ecommerce Advisor' },
  { '@type': 'Person', name: 'Adrian Fjeld Hansen', jobTitle: 'Lead SEO and Shopify' },
] as const

export const ORGANIZATION_LOGO_PATH = '/images/mainLogo.svg'

export const ORGANIZATION_LOGO_DIMENSIONS = { width: 200, height: 50 } as const

/** Path segments after origin for package landing pages (Norwegian production URLs). */
export const ORGANIZATION_SERVICE_PACKAGES = [
  {
    slug: 'foundation',
    name: 'Foundation',
    description:
      'Monthly Shopify retainer for small brands and startups. Includes website maintenance, basic SEO and CRO advisory, and security updates. Ideal for stores with simple product catalogs that need ongoing support and guidance to grow their online presence on Shopify.',
    price: '3500',
  },
  {
    slug: 'growth',
    name: 'Growth',
    description:
      'Shopify growth retainer for established businesses ready to scale. Includes everything in Foundation plus conversion rate optimization, content updates, marketing automation setup with tools like Klaviyo and Make, and advanced analytics. Designed for mid-size product catalogs needing custom code, improved checkout flows, and data-driven growth strategies.',
    price: '8000',
  },
  {
    slug: 'premium',
    name: 'Premium',
    description:
      'Comprehensive Shopify Plus optimization package for high-volume retailers and established brands with complex workflows, both B2B and B2C needs. Includes everything in Growth plus AI-driven personalization, revenue optimization, custom feature development including headless builds with Sanity, and priority support. Suited for mid-to-large catalogs and stores that need A/B testing, advanced integrations, and proactive performance work.',
    price: '15000',
  },
  {
    slug: 'enterprise',
    name: 'Enterprise',
    description:
      'Fully tailored Shopify Plus partnership for large-scale e-commerce operations. Includes everything in Premium plus advanced AI integration, multi-store management across markets, custom Shopify app development, headless commerce architecture with Sanity or Hydrogen, international expansion support, and a dedicated success manager. Built for high-volume businesses with complex catalogs and multi-market needs.',
    price: '30000',
  },
] as const
