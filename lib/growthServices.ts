/**
 * Growth marketing service area (Norwegian site): the hub at /growth-marketing
 * and one placeholder page per service.
 *
 * Single source for both the pages (app/[lang]/growth-marketing) and the
 * Growth marketing column in the header (lib/navigation.ts), so the menu and
 * the pages cannot drift apart.
 *
 * These are dummies: the pages render the agreed service-page template with
 * placeholder blocks and are noindex until real copy replaces them (at which
 * point the content is expected to move into Sanity).
 */

import type { NavColumn } from '@/lib/navigation'

export const GROWTH_BASE_PATH = '/growth-marketing'

export type GrowthColumn = 'synlighet' | 'kunder'

export interface GrowthService {
  /** Path below /growth-marketing, e.g. "sem/google-ads". */
  slug: string
  /** Slug of the parent service when this is a channel page (Google Ads under SEM). */
  parent?: string
  column: GrowthColumn
  /** Label in the menu, breadcrumbs and cards. */
  label: string
  /** One-line summary for the menu and the hub cards. */
  summary?: string
  /** H1. */
  title: string
  /** Opening sentence: who it is for and what it is. Placeholder until copy is written. */
  lead: string
}

/** A menu/hub entry that lives outside /growth-marketing but belongs to the area. */
interface ExternalGrowthLink {
  column: GrowthColumn
  label: string
  summary?: string
  href: string
  /** Insert after this slug in the column. */
  after: string
}

export const GROWTH_COLUMN_TITLES: Record<GrowthColumn, string> = {
  synlighet: 'Synlighet',
  kunder: 'Kunder og måling',
}

export const growthHub = {
  label: 'Growth marketing',
  summary: 'Oversikt og pakketering',
  title: 'Growth marketing for Shopify-butikker',
  lead:
    'Merkevare, SEO, betalt søk, sosiale medier, e-post og sporing – levert av folk som bare jobber med Shopify, til fastpris.',
}

export const growthServices: GrowthService[] = [
  {
    slug: 'merkevare-og-strategi',
    column: 'synlighet',
    label: 'Merkevare og strategi',
    title: 'Merkevare- og vekststrategi for Shopify-butikker',
    lead: 'Posisjonering, målgrupper og en vekstplan som gjør resten av markedsføringen enklere å treffe med.',
  },
  {
    // GEO / AI visibility is part of the SEO offer, not a page of its own
    slug: 'seo',
    column: 'synlighet',
    label: 'SEO',
    summary: 'Teknisk SEO, innhold og synlighet i AI-søk',
    title: 'SEO for Shopify-butikker',
    lead: 'Teknisk SEO, innhold og synlighet i Google og AI-søk – for Shopify-butikker som vil ha mer trafikk som kjøper.',
  },
  {
    slug: 'sem',
    column: 'synlighet',
    label: 'SEM',
    summary: 'Betalt søk',
    title: 'Betalt søk (SEM) for Shopify-butikker',
    lead: 'Annonser i Google og Bing som styres mot lønnsomhet, ikke klikk.',
  },
  {
    slug: 'sem/google-ads',
    parent: 'sem',
    column: 'synlighet',
    label: 'Google Ads',
    title: 'Google Ads for Shopify-butikker',
    lead: 'Søk, Shopping og Performance Max satt opp og drevet mot det som faktisk selger i butikken din.',
  },
  {
    slug: 'sem/bing-ads',
    parent: 'sem',
    column: 'synlighet',
    label: 'Bing Ads',
    title: 'Bing Ads (Microsoft Advertising) for Shopify-butikker',
    lead: 'Den billigere delen av betalt søk – ofte rimeligere klikk og en annen målgruppe enn i Google.',
  },
  {
    slug: 'some',
    column: 'kunder',
    label: 'SoMe',
    summary: 'Organisk og betalt sosiale medier',
    title: 'Markedsføring i sosiale medier for Shopify-butikker',
    lead: 'Organisk innhold og betalte kampanjer i sosiale medier som bygger merkevare og driver salg.',
  },
  {
    slug: 'some/meta-ads',
    parent: 'some',
    column: 'kunder',
    label: 'Meta Ads',
    title: 'Meta Ads (Facebook og Instagram) for Shopify-butikker',
    lead: 'Kampanjer i Facebook og Instagram koblet til produktkatalogen og målt mot salg i Shopify.',
  },
  {
    slug: 'e-postmarkedsforing',
    column: 'kunder',
    label: 'E-post og SMS',
    summary: 'Klaviyo, flyter og segmentering – 1:1 i stor skala',
    title: 'E-postmarkedsføring for Shopify-butikker',
    lead: 'Klaviyo-flyter, segmentering og kampanjer som snakker til hver kunde – 1:1 i stor skala.',
  },
  {
    slug: 'sporing-og-analyse',
    column: 'kunder',
    label: 'Sporing og analyse',
    title: 'Sporing og analyse for Shopify-butikker',
    lead: 'GA4, Consent Mode og server-side sporing satt opp riktig, så du vet hva markedsføringen faktisk gir.',
  },
]

/** CRO keeps its canonical page under Tjenester but is a growth lever, so the area links to it. */
const externalGrowthLinks: ExternalGrowthLink[] = [
  {
    column: 'kunder',
    label: 'CRO',
    summary: 'Konverteringsoptimalisering',
    href: '/tjenester/cro',
    after: 'e-postmarkedsforing',
  },
]

export function growthHref(slug?: string): string {
  return slug ? `${GROWTH_BASE_PATH}/${slug}` : GROWTH_BASE_PATH
}

export function findGrowthService(slug: string): GrowthService | undefined {
  return growthServices.find((s) => s.slug === slug)
}

export function growthChildren(slug: string): GrowthService[] {
  return growthServices.filter((s) => s.parent === slug)
}

export interface GrowthEntry {
  label: string
  summary?: string
  href: string
  indent: boolean
}

/** Ordered entries of one column: services, their channels indented, external links in place. */
export function growthColumnEntries(column: GrowthColumn): GrowthEntry[] {
  const entries: GrowthEntry[] = []
  for (const service of growthServices.filter((s) => s.column === column)) {
    entries.push({
      label: service.label,
      summary: service.summary,
      href: growthHref(service.slug),
      indent: Boolean(service.parent),
    })
    for (const link of externalGrowthLinks.filter((l) => l.column === column && l.after === service.slug)) {
      entries.push({ label: link.label, summary: link.summary, href: link.href, indent: false })
    }
  }
  return entries
}

/** Columns for the Growth marketing mega menu; the hub opens the first column. */
export function growthNavColumns(): NavColumn[] {
  return (Object.keys(GROWTH_COLUMN_TITLES) as GrowthColumn[]).map((column, index) => ({
    title: GROWTH_COLUMN_TITLES[column],
    items: [
      ...(index === 0
        ? [{ label: growthHub.label, href: GROWTH_BASE_PATH, description: growthHub.summary }]
        : []),
      ...growthColumnEntries(column).map((entry) => ({
        label: entry.label,
        href: entry.href,
        description: entry.summary,
        indent: entry.indent,
      })),
    ],
  }))
}
