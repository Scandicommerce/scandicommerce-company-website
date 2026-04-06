/**
 * Homepage / landing page section blocks from Sanity (page builder array or legacy root fields).
 */

export type HomepageSectionBlock =
  | ({ _type: "heroSection"; _key: string } & HomepageHeroPayload)
  | ({ _type: "trustedBySection"; _key: string } & HomepageTrustedByPayload)
  | ({ _type: "painPointsSection"; _key: string } & HomepagePainPointsPayload)
  | ({ _type: "servicesShowcaseSection"; _key: string } & HomepageServicesShowcasePayload)
  | ({ _type: "resultsSection"; _key: string } & HomepageResultsPayload)
  | ({ _type: "processSection"; _key: string } & HomepageProcessPayload)
  | ({ _type: "partnersSection"; _key: string } & HomepagePartnersPayload)
  | ({ _type: "ctaSection"; _key: string } & HomepageCtaPayload)
  | ({ _type: "technicalDepthSection"; _key: string } & TechnicalDepthPayload)

export interface HomepageHeroPayload {
  heroBadge?: string
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
  heroButtons?: Array<{ text: string; link: string; variant?: "primary" | "secondary" }>
  heroTagline?: string
  heroPackages?: Array<{ title: string; price?: string }>
}

export interface HomepageTrustedByPayload {
  title?: string
  brands?: Array<{
    name: string
    logo?: { asset?: { url?: string } }
    alt?: string
    link?: string
  }>
}

export interface HomepagePainPointsPayload {
  painPointsTitle?: { text?: string; highlight?: string }
  painPointsItems?: Array<{ text: string }>
  painPointsBottomText?: string
  painPointsCta?: { text?: string; url?: string }
}

export interface HomepageServicesShowcasePayload {
  title?: { text?: string; highlight?: string }
  subtitle?: string
  categories?: Array<{
    title: string
    icon?: string
    description?: string
    price?: string
    link?: string
    linkText?: string
  }>
  packages?: Array<{
    title: string
    subtitle?: string
    price: string
    priceType?: string
    timeline?: string
    rating?: number
    ratingValue?: string
    bestFor?: string[]
    buttonText?: string
    buttonLink?: string
  }>
}

export interface HomepageResultsPayload {
  title?: string
  subtitle?: string
  theme?: string
  items?: Array<{
    clientImage?: { asset?: { url?: string } }
    clientName: string
    stat: string
    metricName?: string
    description?: string
    ctaText?: string
    ctaLink?: string
  }>
}

export interface HomepageProcessPayload {
  processTitle?: string
  processSubtitle?: string
  processSteps?: Array<{ number?: number; title: string; description?: string }>
}

export interface HomepagePartnersPayload {
  partnersBadges?: Array<{ text: string; link?: string }>
  partnersDescription?: string
}

export interface HomepageCtaPayload {
  title?: string
  subtitle?: string
  buttons?: Array<{ text: string; link: string; variant?: "primary" | "secondary" }>
  backgroundColor?: string
}

export interface TechnicalDepthPayload {
  headline?: string
  body?: string
}

export interface HomepageFromSanity {
  sections?: HomepageSectionBlock[] | null
  hero?: HomepageHeroPayload | null
  trustedBy?: HomepageTrustedByPayload | null
  painPoints?: HomepagePainPointsPayload | null
  servicesShowcase?: HomepageServicesShowcasePayload | null
  results?: HomepageResultsPayload | null
  process?: HomepageProcessPayload | null
  partners?: HomepagePartnersPayload | null
  cta?: HomepageCtaPayload | null
}

function block<T extends Record<string, unknown>>(
  _type: HomepageSectionBlock["_type"],
  _key: string,
  payload: T
): HomepageSectionBlock {
  return { _type, _key, ...payload } as HomepageSectionBlock
}

/** Prefer `sections` when present; otherwise build ordered blocks from legacy root fields. */
export function normalizeHomepageSections(page: HomepageFromSanity | null | undefined): HomepageSectionBlock[] {
  if (!page) return []
  const raw = page.sections
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.filter((s): s is HomepageSectionBlock => Boolean(s && typeof s === "object" && "_type" in s))
  }

  const out: HomepageSectionBlock[] = []
  if (page.hero && Object.keys(page.hero).length > 0) {
    out.push(block("heroSection", "legacy-hero", page.hero as Record<string, unknown>))
  }
  if (page.trustedBy && Object.keys(page.trustedBy).length > 0) {
    out.push(block("trustedBySection", "legacy-trustedBy", page.trustedBy as Record<string, unknown>))
  }
  if (page.painPoints && Object.keys(page.painPoints).length > 0) {
    out.push(block("painPointsSection", "legacy-painPoints", page.painPoints as Record<string, unknown>))
  }
  if (page.servicesShowcase && Object.keys(page.servicesShowcase).length > 0) {
    out.push(block("servicesShowcaseSection", "legacy-servicesShowcase", page.servicesShowcase as Record<string, unknown>))
  }
  if (page.results && Object.keys(page.results).length > 0) {
    out.push(block("resultsSection", "legacy-results", page.results as Record<string, unknown>))
  }
  if (page.process && Object.keys(page.process).length > 0) {
    out.push(block("processSection", "legacy-process", page.process as Record<string, unknown>))
  }
  if (page.partners && Object.keys(page.partners).length > 0) {
    out.push(block("partnersSection", "legacy-partners", page.partners as Record<string, unknown>))
  }
  if (page.cta && Object.keys(page.cta).length > 0) {
    out.push(block("ctaSection", "legacy-cta", page.cta as Record<string, unknown>))
  }
  return out
}
