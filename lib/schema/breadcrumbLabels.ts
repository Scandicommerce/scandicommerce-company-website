/**
 * Human-readable labels for URL segments (keys are lowercased path parts).
 * Extend as new top-level sections are added.
 */
export const BREADCRUMB_SEGMENT_LABELS: Record<string, string> = {
  tjenester: 'Tjenester',
  'alle-pakker': 'Alle pakker',
  shopify: 'Shopify',
  'shopify_migrering': 'Shopify-migrering',
  'shopify-POS': 'Shopify POS',
  shopify_pos: 'Shopify POS',
  shopify_x_KI: 'Shopify × KI',
  shopify_TCO_kalkulator: 'TCO-kalkulator',
  'vipps-hurtigkasse': 'Vipps hurtigkasse',
  hvorfor_shopify: 'Hvorfor Shopify',
  utvikling: 'Utvikling',
  blogg: 'Blogg',
  resources: 'Resources',
  kontakt: 'Kontakt',
  'om-oss': 'Om oss',
  partnere: 'Partnere',
  merch: 'Merch',
  work: 'Work',
  about: 'About',
  contact: 'Contact',
  partners: 'Partners',
  services: 'Services',
  all_packages: 'All packages',
  sitemap: 'Sitemap',
}

/** First breadcrumb label (position 1) by UI locale. */
export const BREADCRUMB_HOME_LABEL_BY_LOCALE: Record<string, string> = {
  no: 'Hjem',
  nb: 'Hjem',
  da: 'Hjem',
  sv: 'Hem',
  de: 'Startseite',
}

export function getBreadcrumbHomeLabel(locale: string): string {
  const key = locale.toLowerCase().split('-')[0] || ''
  return BREADCRUMB_HOME_LABEL_BY_LOCALE[key] ?? 'Home'
}

export function humanizeSegment(segment: string): string {
  const key = segment.toLowerCase()
  if (BREADCRUMB_SEGMENT_LABELS[key]) return BREADCRUMB_SEGMENT_LABELS[key]
  return segment
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}
