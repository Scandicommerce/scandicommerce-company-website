/**
 * Information architecture for the Norwegian site.
 *
 * Source: "Scandicommerce — meny-mockup (ny IA).html" (5 October 2026), which
 * supersedes the five-item menu in Scandicommerce_IA_handlingsliste_NO.xlsx
 * (15 September 2026). Footer slugs below are the ones that actually exist in
 * Sanity, not the pre-normalisation slugs the mockup was drawn against.
 *
 * These values are the fallback the header and footer render when the matching
 * Sanity settings document has no `menu` / `columns` of its own. Editors can
 * override everything from Studio; this keeps the site shippable without them.
 */

export interface NavLink {
  label?: string
  /** Sanity page slug, when the link points at a referenced document. */
  slug?: string | null
  /** Literal path or external URL, used when no page is referenced. */
  href?: string | null
  /** Short line under the label in mega-menu panels. */
  description?: string
  /** Renders as a nested child of the entry above it. */
  indent?: boolean
  /**
   * Set to false while the destination does not exist yet. Such entries are
   * kept here so the agreed IA stays visible in one place, but are not
   * rendered — the header must never link to a 404, since it appears on every
   * page. Delete the flag in the same change that ships the page.
   */
  live?: boolean
}

export interface NavColumn {
  title?: string
  items?: NavLink[]
}

export interface NavItem extends NavLink {
  /** Non-empty columns turn the item into a dropdown; otherwise it is a plain link. */
  columns?: NavColumn[]
}

/** Footer columns keep the `links` key the footerSettings schema already uses. */
export interface FooterColumn {
  title?: string
  links?: NavLink[]
}

export interface NavCta {
  label?: string
  slug?: string | null
  href?: string | null
}

/** Top-level menu, Norwegian IA. */
export const navigationNo: NavItem[] = [
  {
    label: 'Tjenester',
    columns: [
      {
        title: 'Leveranser',
        items: [
          {
            label: 'Tjenester oversikt',
            href: '/tjenester',
            description: 'Alle leveranser og hvilke pakker de inngår i',
          },
          { label: 'Shopify & nettbutikk', href: '/tjenester/shopify' },
          { label: 'Migrering til Shopify', href: '/tjenester/migrering' },
          { label: 'B2B og ordreportal', href: '/tjenester/b2b' },
          { label: 'Utvikling og skreddersøm', href: '/tjenester/utvikling' },
        ],
      },
      {
        title: 'Pakker og apper',
        items: [
          { label: 'Alle pakker', href: '/tjenester/alle-pakker' },
          { label: 'Growth', href: '/tjenester/alle-pakker/growth', indent: true },
          { label: 'Premium', href: '/tjenester/alle-pakker/premium', indent: true },
          { label: 'Enterprise', href: '/tjenester/alle-pakker/enterprise', indent: true },
          {
            label: 'Apper',
            href: '/apper',
            description: 'NexusShipping, NexusLoyalty, NexusGrow',
            live: false,
          },
        ],
      },
    ],
  },
  {
    label: 'Growth marketing',
    live: false,
    columns: [
      {
        title: 'Synlighet',
        items: [
          {
            label: 'Growth marketing',
            href: '/growth-marketing',
            description: 'Oversikt og pakketering',
          },
          {
            label: 'SEO',
            href: '/growth-marketing/seo',
            description: 'Leveres allerede i dag',
          },
          {
            label: 'GEO og AI-synlighet',
            href: '/growth-marketing/geo',
            description: 'Bli funnet, sitert og anbefalt av AI',
          },
        ],
      },
      {
        title: 'Betalt og måling',
        items: [
          { label: 'Google Ads', href: '/growth-marketing/google-ads' },
          { label: 'Meta Ads', href: '/growth-marketing/meta-ads' },
          { label: 'Bing Ads', href: '/growth-marketing/bing-ads' },
          { label: 'Analyse og sporing', href: '/growth-marketing/analyse' },
        ],
      },
    ],
  },
  {
    label: 'Integrasjoner',
    columns: [
      {
        title: 'Etter system',
        items: [
          { label: 'Alle integrasjoner', href: '/integrasjoner' },
          {
            label: 'ERP og økonomi',
            href: '/integrasjoner/erp',
            description: 'Finago, 24SevenOffice, Tripletex',
          },
          { label: 'PIM og produktdata', href: '/integrasjoner/pim' },
          {
            label: 'Logistikk og frakt',
            href: '/integrasjoner/logistikk',
            description: 'Profrakt, Holio, Quickship',
          },
          {
            label: 'Betaling',
            href: '/integrasjoner/betaling',
            description: 'Nets, Vipps, Klarna, Qliro',
          },
        ],
      },
      {
        title: 'Partnere',
        items: [
          { label: 'Alle partnere', href: '/partnere', description: '14 partnerselskaper' },
          { label: 'Bli partner', href: '/partnere/bli-partner', live: false },
        ],
      },
    ],
  },
  { label: 'Agentisk handel', href: '/agentisk-handel', live: false },
  { label: 'NexusPOS', href: '/nexuspos' },
  { label: 'Kundecaser', href: '/kundecaser' },
]

export const ctaNo: NavCta = { label: 'Book møte', href: '/kontakt' }

/**
 * Footer columns, Norwegian IA. Ressurser and Selskapet moved down here when
 * the header was reduced to what is sellable.
 */
export const footerColumnsNo: FooterColumn[] = [
  {
    title: 'Tjenester',
    links: [
      { label: 'Alle pakker', href: '/tjenester/alle-pakker' },
      { label: 'Migrering', href: '/tjenester/migrering' },
      { label: 'Utvikling', href: '/tjenester/utvikling' },
      { label: 'Apper', href: '/apper', live: false },
    ],
  },
  {
    title: 'Ressurser',
    links: [
      { label: 'Blogg og artikler', href: '/blogg' },
      { label: 'Hvorfor Shopify', href: '/hvorfor-shopify' },
      { label: 'TCO-kalkulator', href: '/shopify-tco-kalkulator' },
      { label: 'Shopify x PIM', href: '/shopify-pim' },
      { label: 'Shopify x KI', href: '/shopify/shopify-x-ki' },
      { label: 'Vipps Hurtigkasse', href: '/shopify/vipps-hurtigkasse' },
    ],
  },
  {
    title: 'Selskapet',
    links: [
      { label: 'Om oss', href: '/om-oss' },
      { label: 'Partnere', href: '/partnere' },
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'Merch', href: '/merch' },
    ],
  },
  {
    title: 'Juridisk',
    links: [
      { label: 'Personvern og cookies', href: '/legal/personvern' },
      { label: 'App-personvern', href: '/legal/app-privacy-policy' },
      { label: 'Nettstedskart', href: '/sitemap' },
    ],
  },
]

/**
 * Pre-IA English menu. The new IA is Norwegian-only for now — en, sv, da and de
 * stay on the old structure until the Norwegian version is locked.
 */
export const navigationEn: NavItem[] = [
  {
    label: 'Services',
    columns: [
      {
        items: [
          { label: 'Shopify Development', href: '/services/shopify-development' },
          { label: 'Migration to Shopify', href: '/services/migrate' },
          { label: 'Shopify POS', href: '/services/shopify-pos' },
          { label: 'All Packages', href: '/services/all-packages' },
        ],
      },
    ],
  },
  {
    label: 'Shopify',
    columns: [
      {
        items: [
          { label: 'Shopify', href: '/shopify/shopify-platform' },
          { label: 'Shopify POS', href: '/shopify/shopify-pos' },
          { label: 'Shopify Migration', href: '/services/migrate' },
          { label: 'Shopify TCO calculator', href: '/shopify-tco-calculator' },
          { label: 'Shopify x PIM', href: '/shopify-pim' },
          { label: 'Shopify X AI', href: '/shopify/shopify-x-ai' },
          { label: 'Why Shopify?', href: '/why-shopify' },
          { label: 'Vipps Hurtigkasse', href: '/shopify/vipps-hurtigkasse' },
        ],
      },
    ],
  },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact', href: '/contact' },
]

export const ctaEn: NavCta = { label: 'GET STARTED', href: '/services/all-packages' }

export const footerColumnsEn: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Partners', href: '/partners' },
      { label: 'Contact', href: '/contact' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
  { title: 'Services', links: [{ label: 'All Packages', href: '/services/all-packages' }] },
  { title: 'Resources', links: [{ label: 'Blog & Articles', href: '/blog' }] },
  { title: 'Merch', links: [{ label: 'Merch', href: '/merch' }] },
]

/** Entries explicitly marked `live: false` are not rendered. */
export function isLive(item: { live?: boolean }): boolean {
  return item.live !== false
}

/**
 * Drops unbuilt entries, then any column and any dropdown left without links.
 * CMS-authored menus pass through unchanged — editors cannot link to a page
 * that does not exist, because Studio only offers published documents.
 */
export function liveNavigation(items: NavItem[]): NavItem[] {
  return items.filter(isLive).map((item) => {
    if (!item.columns) return item
    const columns = item.columns
      .map((column) => ({ ...column, items: (column.items ?? []).filter(isLive) }))
      .filter((column) => column.items.length > 0)
    return { ...item, columns }
  }).filter((item) => !item.columns || item.columns.length > 0 || Boolean(item.href || item.slug))
}

/** Menu shown when the language's headerSettings document has no `menu` of its own. */
export function defaultNavigation(language?: string): NavItem[] {
  return language === 'no' ? navigationNo : navigationEn
}

export function defaultCta(language?: string): NavCta {
  return language === 'no' ? ctaNo : ctaEn
}

export function defaultFooterColumns(language?: string): FooterColumn[] {
  return language === 'no' ? footerColumnsNo : footerColumnsEn
}
