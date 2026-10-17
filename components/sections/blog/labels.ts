import { lang as toLang, type Lang } from '@/components/integrations/labels'

/** Labels for the post page (no, en, sv, da, de). */
export const POST_T: Record<
  Lang,
  {
    index: string
    contents: string
    writtenBy: string
    morePostsBy: string
    readNext: string
    related: string
    readTime: (n: number) => string
    tldr: string
    note: string
    ctaHeading: string
    ctaText: string
    ctaButton: string
  }
> = {
  no: {
    index: 'Blogg',
    contents: 'Innhold',
    writtenBy: 'Skrevet av',
    morePostsBy: 'Flere innlegg av',
    readNext: 'Les videre',
    related: 'Relaterte innlegg',
    readTime: (n) => `${n} min lesetid`,
    tldr: 'TL;DR',
    note: 'Merk',
    ctaHeading: 'Vil du snakke om nettbutikken din?',
    ctaText: 'Et kort møte, så vet du hva som er verdt å gjøre først.',
    ctaButton: 'Bestill en uforpliktende samtale',
  },
  en: {
    index: 'Blog',
    contents: 'Contents',
    writtenBy: 'Written by',
    morePostsBy: 'More posts by',
    readNext: 'Read next',
    related: 'Related posts',
    readTime: (n) => `${n} min read`,
    tldr: 'TL;DR',
    note: 'Note',
    ctaHeading: 'Want to talk about your store?',
    ctaText: 'A short call and you will know what is worth doing first.',
    ctaButton: 'Book a no-obligation call',
  },
  sv: {
    index: 'Blog',
    contents: 'Innehåll',
    writtenBy: 'Skriven av',
    morePostsBy: 'Fler inlägg av',
    readNext: 'Läs vidare',
    related: 'Relaterade inlägg',
    readTime: (n) => `${n} min läsning`,
    tldr: 'TL;DR',
    note: 'Obs',
    ctaHeading: 'Vill du prata om din butik?',
    ctaText: 'Ett kort samtal, så vet du vad som är värt att göra först.',
    ctaButton: 'Boka ett förutsättningslöst samtal',
  },
  da: {
    index: 'Blog',
    contents: 'Indhold',
    writtenBy: 'Skrevet af',
    morePostsBy: 'Flere indlæg af',
    readNext: 'Læs videre',
    related: 'Relaterede indlæg',
    readTime: (n) => `${n} min læsning`,
    tldr: 'TL;DR',
    note: 'Bemærk',
    ctaHeading: 'Vil du tale om din webshop?',
    ctaText: 'Et kort opkald, så ved du, hvad der er værd at gøre først.',
    ctaButton: 'Book en uforpligtende samtale',
  },
  de: {
    index: 'Blog',
    contents: 'Inhalt',
    writtenBy: 'Geschrieben von',
    morePostsBy: 'Mehr Beiträge von',
    readNext: 'Weiterlesen',
    related: 'Verwandte Beiträge',
    readTime: (n) => `${n} Min. Lesezeit`,
    tldr: 'TL;DR',
    note: 'Hinweis',
    ctaHeading: 'Möchten Sie über Ihren Shop sprechen?',
    ctaText: 'Ein kurzes Gespräch, und Sie wissen, was sich zuerst lohnt.',
    ctaButton: 'Unverbindliches Gespräch vereinbaren',
  },
}

export const postLabels = (language: string) => POST_T[toLang(language)]

const LOCALE: Record<Lang, string> = { no: 'nb-NO', en: 'en-GB', sv: 'sv-SE', da: 'da-DK', de: 'de-DE' }

/** Short date for the mono meta line, e.g. "17. mar. 2026" / "17 Mar 2026". */
export function formatPostDate(value: string | null | undefined, language: string): string {
  if (!value) return ''
  const parsed = new Date(value)
  if (isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString(LOCALE[toLang(language)], { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Minutes at ~200 words a minute, never below one. */
export function readingMinutes(words: number | undefined): number {
  return Math.max(1, Math.round((words ?? 0) / 200))
}

/** Text shared by the heading and body styles of the reading column. */
export const BODY_TEXT = 'text-[17px] leading-[1.7] text-sc-ink-600'
export const H2 = 'm-0 scroll-mt-24 text-[24px] font-bold leading-snug tracking-[-0.02em] text-sc-ink-900 md:text-[28px]'
export const H3 = 'm-0 scroll-mt-24 text-[20px] font-bold leading-snug tracking-[-0.01em] text-sc-ink-900'
