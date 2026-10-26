/**
 * Growth marketing service area (Norwegian site): the hub at /growth-marketing
 * and one placeholder page per service.
 *
 * Source for the pages (app/[lang]/growth-marketing) and for the proposed
 * Growth marketing dropdown (`growthNavItem`). lib/navigation.ts is owned by
 * the IA work and is not edited from here: it can adopt the dropdown with
 * `growthNavItem()` so menu and pages stay in step.
 *
 * These are dummies: the pages render the agreed service-page template with
 * placeholder blocks and are noindex until real copy replaces them (at which
 * point the content is expected to move into Sanity).
 */

import type { NavColumn, NavItem } from '@/lib/navigation'

export const GROWTH_BASE_PATH = '/growth-marketing'

/** Menu columns and hub sections, in order. */
export const GROWTH_GROUPS = [
  { id: 'strategi', title: 'Strategi og innsikt' },
  { id: 'annonsering', title: 'Annonsering' },
  { id: 'egne-kanaler', title: 'Egne kanaler' },
] as const

export type GrowthGroup = (typeof GROWTH_GROUPS)[number]['id']

export interface GrowthService {
  /** Path below /growth-marketing, e.g. "sem/google-ads". */
  slug: string
  group: GrowthGroup
  /**
   * Slug of the parent service when this is a channel page (Google Ads under SEM).
   * Channel pages are linked from their parent page only, not from the menu or hub.
   */
  parent?: string
  /** Label in the menu, breadcrumbs and cards. */
  label: string
  /** H1 and meta title. */
  title: string
  /** H1 with soft hyphens (\u00AD) where a long word would not fit on a phone. Defaults to `title`. */
  heroTitle?: string
  /** Opening sentence: who it is for and what it is. Placeholder until copy is written. */
  lead: string
}

export const growthHub = {
  label: 'Growth marketing',
  title: 'Growth marketing for nettbutikker',
  lead:
    'Merkevare, SEO, betalt søk, sosiale medier, e-post og sporing – levert av folk som bare jobber med netthandel, til fastpris.',
}

export const growthServices: GrowthService[] = [
  {
    slug: 'merkevare-og-strategi',
    group: 'strategi',
    label: 'Merkevare og strategi',
    title: 'Merkevare- og vekststrategi for nettbutikker',
    lead: 'En merkevare kundene husker når de skal handle – og en vekstplan som får resten av markedsføringen til å treffe.',
  },
  {
    slug: 'sporing-og-analyse',
    group: 'strategi',
    label: 'Sporing og analyse',
    title: 'Sporing og analyse for nettbutikker',
    lead: 'Server-side sporing med Tracklution, analyse i GA4 og BigQuery, og dashboards som viser hva markedsføringen faktisk gir.',
  },
  {
    slug: 'sem',
    group: 'annonsering',
    label: 'SEM',
    title: 'Betalt søk (SEM) for nettbutikker',
    lead: 'Annonser i Google, Bing og AI-søk som styres mot lønnsomhet, ikke klikk.',
  },
  {
    slug: 'sem/google-ads',
    group: 'annonsering',
    parent: 'sem',
    label: 'Google Ads',
    title: 'Google Ads for nettbutikker',
    lead: 'Søk, Shopping og Performance Max satt opp og drevet mot det som faktisk selger i butikken din.',
  },
  {
    slug: 'sem/bing-ads',
    group: 'annonsering',
    parent: 'sem',
    label: 'Bing Ads',
    title: 'Bing Ads (Microsoft Advertising) for nettbutikker',
    lead: 'Den billigere delen av betalt søk – ofte rimeligere klikk og en annen målgruppe enn i Google.',
  },
  {
    // Paid visibility in AI answers; organic AI visibility (GEO) stays under SEO
    slug: 'sem/ai-sok',
    group: 'annonsering',
    parent: 'sem',
    label: 'AI-søk',
    title: 'Annonsering i AI-søk for nettbutikker',
    lead: 'Annonser og produktdata klare for AI-søk – i Google i dag, og i nye AI-tjenester når de åpner i Norge.',
  },
  {
    slug: 'some',
    group: 'annonsering',
    label: 'SoMe',
    title: 'Markedsføring i sosiale medier for nettbutikker',
    lead: 'Merkevarebygging og kreativer som skaper etterspørsel – organisk og betalt, der kundene dine bruker tiden sin.',
  },
  {
    slug: 'some/meta-ads',
    group: 'annonsering',
    parent: 'some',
    label: 'Meta Ads',
    title: 'Meta Ads (Facebook og Instagram) for nettbutikker',
    lead: 'Kampanjer i Facebook og Instagram koblet til produktkatalogen og målt mot salg i nettbutikken.',
  },
  {
    slug: 'some/tiktok',
    group: 'annonsering',
    parent: 'some',
    label: 'TikTok',
    title: 'TikTok-annonsering for nettbutikker',
    lead: 'Korte videoer som skaper etterspørsel – med mange kreativer, skapere og måling mot salget i nettbutikken.',
  },
  {
    slug: 'some/snapchat',
    group: 'annonsering',
    parent: 'some',
    label: 'Snapchat',
    title: 'Snapchat-annonsering for nettbutikker',
    lead: 'Vertikale annonser og produktannonser der mange nordmenn er hver dag – målt mot salget i nettbutikken.',
  },
  {
    // Includes CSS partners (Comparison Shopping Services) for Google Shopping
    slug: 'affiliate',
    group: 'annonsering',
    label: 'Affiliate',
    title: 'Affiliate, CSS og feedoptimalisering for nettbutikker',
    lead: 'Én god produktfeed – ut til Google Shopping, CSS, prissammenligning og affiliate-partnere, og fulgt opp mot salg i nettbutikken.',
  },
  {
    // GEO / AI visibility is part of the SEO offer, not a page of its own
    slug: 'seo',
    group: 'egne-kanaler',
    label: 'SEO',
    title: 'SEO for nettbutikker',
    lead: 'Teknisk SEO, innhold og synlighet i Google og AI-søk – for nettbutikker som vil ha mer trafikk som kjøper.',
  },
  {
    slug: 'e-postmarkedsforing',
    group: 'egne-kanaler',
    // Short like SEO / SEM / CRO in the menu; the H1 and URL keep the searched term
    label: 'E-post',
    title: 'E-postmarkedsføring for nettbutikker',
    lead: 'Klaviyo-flyter, segmentering og kampanjer som snakker til hver kunde – 1:1 i stor skala.',
  },
  {
    slug: 'cro',
    group: 'egne-kanaler',
    label: 'CRO',
    title: 'Konverteringsoptimalisering (CRO) for nettbutikker',
    heroTitle: 'Konverterings\u00ADoptimalisering (CRO) for nettbutikker',
    lead: 'Flere kjøp fra trafikken du allerede har – med data, tester og forbedringer i butikken.',
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

/** Top-level services of one group, in order; channel pages excluded. */
export function growthGroupServices(group: GrowthGroup): GrowthService[] {
  return growthServices.filter((s) => s.group === group && !s.parent)
}

/** Columns for the Growth marketing dropdown: one per group, overview first, labels only. */
export function growthNavColumns(): NavColumn[] {
  return GROWTH_GROUPS.map((group, index) => ({
    title: group.title,
    items: [
      ...(index === 0 ? [{ label: 'Growth marketing oversikt', href: GROWTH_BASE_PATH }] : []),
      ...growthGroupServices(group.id).map((service) => ({
        label: service.label,
        href: growthHref(service.slug),
      })),
    ],
  }))
}

/** Drop-in replacement for the Growth marketing entry in lib/navigation.ts. */
export function growthNavItem(): NavItem {
  return { label: growthHub.label, columns: growthNavColumns() }
}
