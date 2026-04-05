/** Sanity → homepage (landing page document), including page-builder blocks */

export interface HomepageSectionBlock {
  _type: string
  _key: string
  [key: string]: unknown
}

export interface HomepageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: HomepageSectionBlock[]
  hero?: {
    heroBadge?: string
    heroTitle?: { text?: string; highlight?: string }
    heroDescription?: string
    heroButtons?: Array<{
      text: string
      link: string
      variant?: 'primary' | 'secondary'
    }>
    heroTagline?: string
    heroPackages?: Array<{ title: string; price?: string }>
  }
  trustedBy?: {
    title?: string
    brands?: Array<{
      name: string
      logo?: { asset?: { url?: string } }
      alt?: string
      link?: string
    }>
  }
  painPoints?: {
    painPointsTitle?: { text?: string; highlight?: string }
    painPointsItems?: Array<{ text: string }>
    painPointsBottomText?: string
    painPointsCta?: { text?: string; url?: string }
  }
  servicesShowcase?: {
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
  results?: {
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
  process?: {
    processTitle?: string
    processSubtitle?: string
    processSteps?: Array<{
      number?: number
      title: string
      description?: string
    }>
  }
  partners?: {
    partnersBadges?: Array<{ text: string; link?: string }>
    partnersDescription?: string
  }
  cta?: {
    title?: string
    subtitle?: string
    backgroundColor?: string
    buttons?: Array<{
      text: string
      link: string
      variant?: 'primary' | 'secondary'
    }>
  }
}
