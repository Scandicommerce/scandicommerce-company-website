/**
 * Homepage / landing page section blocks from Sanity (`sections[]` page builder array).
 */

export type HomepageSectionBlock =
  | ({ _type: "heroSection"; _key: string } & HomepageHeroPayload)
  | ({ _type: "trustedBySection"; _key: string } & HomepageTrustedByPayload)
  | ({ _type: "painPointsSection"; _key: string } & HomepagePainPointsPayload)
  | ({ _type: "servicesShowcaseSection"; _key: string } & HomepageServicesShowcasePayload)
  | ({ _type: "resultsSection"; _key: string } & HomepageResultsPayload)
  | ({ _type: "homepageTestimonialSection"; _key: string } & HomepageTestimonialPayload)
  | ({ _type: "processSection"; _key: string } & HomepageProcessPayload)
  | ({ _type: "partnersSection"; _key: string } & HomepagePartnersPayload)
  | ({ _type: "ctaSection"; _key: string } & HomepageCtaPayload)
  | ({ _type: "technicalDepthSection"; _key: string } & TechnicalDepthPayload)
  | ({ _type: "blogTeaserSection"; _key: string } & HomepageBlogTeaserPayload)

export interface HomepageHeroPayload {
  heroBadge?: string
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
  heroButtons?: Array<{ text: string; link: string; variant?: "primary" | "secondary" }>
  heroTagline?: string
  heroImageUrl?: string
  heroVideo?: string
  heroVideoFileUrl?: string
  heroVideoFileMobileUrl?: string
  heroPackages?: Array<{ title: string; price?: string }>
}

export interface HomepageBlogTeaserPayload {
  eyebrow?: string
  title?: string
  linkText?: string
  linkHref?: string
  count?: number
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
    category?: string
    stat: string
    metricName?: string
    description?: string
    ctaText?: string
    ctaLink?: string
  }>
}

export interface HomepageTestimonialPayload {
  testimonialRating?: number
  testimonialQuote?: string
  testimonialAuthorName?: string
  testimonialAuthorTitle?: string
  testimonialButtonText?: string
  testimonialButtonLink?: string
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
}

/** Typed `sections[]` reader; malformed entries are dropped. */
export function normalizeHomepageSections(page: HomepageFromSanity | null | undefined): HomepageSectionBlock[] {
  const raw = page?.sections
  if (!Array.isArray(raw)) return []
  return raw.filter((s): s is HomepageSectionBlock => Boolean(s && typeof s === "object" && "_type" in s))
}
