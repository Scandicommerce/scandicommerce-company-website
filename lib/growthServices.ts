/**
 * Growth marketing service area (Norwegian site): the hub at /growth-marketing
 * and one placeholder page per service.
 *
 * Single source for both the pages (app/[lang]/growth-marketing) and the
 * Growth marketing dropdown in the header (lib/navigation.ts), so the menu and
 * the pages cannot drift apart.
 *
 * These are dummies: the pages render the agreed service-page template with
 * placeholder blocks and are noindex until real copy replaces them (at which
 * point the content is expected to move into Sanity).
 */

import type { NavColumn } from '@/lib/navigation'

export const GROWTH_BASE_PATH = '/growth-marketing'

export interface GrowthService {
  /** Path below /growth-marketing, e.g. "sem/google-ads". */
  slug: string
  /**
   * Slug of the parent service when this is a channel page (Google Ads under SEM).
   * Channel pages are linked from their parent page only, not from the menu or hub.
   */
  parent?: string
  /** Label in the menu, breadcrumbs and cards. */
  label: string
  /** H1. */
  title: string
  /** Opening sentence: who it is for and what it is. Placeholder until copy is written. */
  lead: string
}

/** A link that lives outside /growth-marketing but belongs to the area. */
interface ExternalGrowthLink {
  label: string
  href: string
  lead: string
  /** Insert after this slug. */
  after: string
}

export const growthHub = {
  label: 'Growth marketing',
  title: 'Growth marketing for Shopify-butikker',
  lead:
    'Merkevare, SEO, betalt søk, sosiale medier, e-post og sporing – levert av folk som bare jobber med Shopify, til fastpris.',
}

export const growthServices: GrowthService[] = [
  {
    slug: 'merkevare-og-strategi',
    label: 'Merkevare og strategi',
    title: 'Merkevare- og vekststrategi for Shopify-butikker',
    lead: 'Posisjonering, målgrupper og en vekstplan som gjør resten av markedsføringen enklere å treffe med.',
  },
  {
    // GEO / AI visibility is part of the SEO offer, not a page of its own
    slug: 'seo',
    label: 'SEO',
    title: 'SEO for Shopify-butikker',
    lead: 'Teknisk SEO, innhold og synlighet i Google og AI-søk – for Shopify-butikker som vil ha mer trafikk som kjøper.',
  },
  {
    slug: 'sem',
    label: 'SEM',
    title: 'Betalt søk (SEM) for Shopify-butikker',
    lead: 'Annonser i Google og Bing som styres mot lønnsomhet, ikke klikk.',
  },
  {
    slug: 'sem/google-ads',
    parent: 'sem',
    label: 'Google Ads',
    title: 'Google Ads for Shopify-butikker',
    lead: 'Søk, Shopping og Performance Max satt opp og drevet mot det som faktisk selger i butikken din.',
  },
  {
    slug: 'sem/bing-ads',
    parent: 'sem',
    label: 'Bing Ads',
    title: 'Bing Ads (Microsoft Advertising) for Shopify-butikker',
    lead: 'Den billigere delen av betalt søk – ofte rimeligere klikk og en annen målgruppe enn i Google.',
  },
  {
    slug: 'some',
    label: 'SoMe',
    title: 'Markedsføring i sosiale medier for Shopify-butikker',
    lead: 'Organisk innhold og betalte kampanjer i sosiale medier som bygger merkevare og driver salg.',
  },
  {
    slug: 'some/meta-ads',
    parent: 'some',
    label: 'Meta Ads',
    title: 'Meta Ads (Facebook og Instagram) for Shopify-butikker',
    lead: 'Kampanjer i Facebook og Instagram koblet til produktkatalogen og målt mot salg i Shopify.',
  },
  {
    slug: 'e-postmarkedsforing',
    label: 'E-postmarkedsføring',
    title: 'E-postmarkedsføring for Shopify-butikker',
    lead: 'Klaviyo-flyter, segmentering og kampanjer som snakker til hver kunde – 1:1 i stor skala.',
  },
  {
    slug: 'sporing-og-analyse',
    label: 'Sporing og analyse',
    title: 'Sporing og analyse for Shopify-butikker',
    lead: 'GA4, Consent Mode og server-side sporing satt opp riktig, så du vet hva markedsføringen faktisk gir.',
  },
]

/** CRO keeps its canonical page under Tjenester but is a growth lever, so the area links to it. */
const externalGrowthLinks: ExternalGrowthLink[] = [
  {
    label: 'CRO',
    href: '/tjenester/cro',
    lead: 'Flere kjøp fra trafikken du allerede har.',
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
  lead: string
  href: string
}

/** Top-level services in menu order, with external links in place; channel pages excluded. */
export function growthEntries(): GrowthEntry[] {
  const entries: GrowthEntry[] = []
  for (const service of growthServices.filter((s) => !s.parent)) {
    entries.push({ label: service.label, lead: service.lead, href: growthHref(service.slug) })
    for (const link of externalGrowthLinks.filter((l) => l.after === service.slug)) {
      entries.push({ label: link.label, lead: link.lead, href: link.href })
    }
  }
  return entries
}

/** The Growth marketing dropdown: one plain list, overview first. */
export function growthNavColumns(): NavColumn[] {
  return [
    {
      items: [
        { label: 'Oversikt', href: GROWTH_BASE_PATH },
        ...growthEntries().map((entry) => ({ label: entry.label, href: entry.href })),
      ],
    },
  ]
}
