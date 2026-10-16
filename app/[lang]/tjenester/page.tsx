import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeftRight, Building2, CodeXml, Store, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import LocalizedLink from '@/components/ui/LocalizedLink'
import ServiceHero from '@/components/sections/services/ServiceHero'
import DataFlowAnimation from '@/components/integrations/DataFlowAnimation'
import { getLanguageFromParams } from '@/lib/language'
import { navigationNo, type NavLink } from '@/lib/navigation'
import { getPageTeaserText } from '@/lib/pageTeaser'
import { packagesHref, CONTACT_SLUG, trimSlashes } from '@/lib/routes'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ROUTE_PATH = 'tjenester'

const PAGE_TITLE = 'Tjenester'
/**
 * Illustration to the right of the heading. Set `src` to a file under
 * /public (e.g. '/images/tjenester/hero.png') or a Sanity CDN URL; while it is
 * null the hero renders text-only.
 */
const HERO_IMAGE: { src: string; alt: string; width: number; height: number } | null = null

const PAGE_INTRO =
  'Fra ny nettbutikk eller migrering til Shopify, til integrerte B2B-portaler og unik skreddersøm.'

/**
 * Teaser copy written for this overview. Takes priority over the sub-page's
 * own SEO description, which is only used for items not listed here.
 */
const TEASERS: Record<string, string> = {
  'tjenester/shopify':
    'Ny nettbutikk på Shopify eller Shopify Plus, fra design og oppsett til lansering. Fast pris og tydelig omfang.',
  'tjenester/migrering':
    'Bytt til Shopify uten risiko. Vi flytter produkter, kunder og ordre, bevarer SEO-rangeringene og unngår nedetid.',
  'tjenester/b2b':
    'Ordreportal og B2B-handel på Shopify: egne priser per kunde, selvbetjent bestilling og kjøp på faktura.',
  'tjenester/utvikling':
    "Vi utvikler din Shopify-butikk eller arkitektur akkurat slik du vil, enten det er konfigurator, apper, agenter eller ny funksjonalitet – tilpasset din butikk og forretningsmodell.",
}

/** Card icon per sub-page. Items without an entry render without an icon. */
const ICONS: Record<string, LucideIcon> = {
  'tjenester/shopify': Store,
  'tjenester/migrering': ArrowLeftRight,
  'tjenester/b2b': Building2,
  'tjenester/utvikling': CodeXml,
}

/**
 * The Leveranser column of the Tjenester menu, minus this page itself. The
 * menu is the single source of truth: adding or renaming a Leveranser item
 * there updates this overview too.
 */
function leveranserItems(): NavLink[] {
  const tjenester = navigationNo.find((item) => item.label === 'Tjenester')
  const column = tjenester?.columns?.find((col) => col.title === 'Leveranser')
  return (column?.items ?? []).filter((item) => item.href && trimSlashes(item.href) !== ROUTE_PATH)
}

interface Teaser {
  label: string
  href: string
  description: string
  Icon?: LucideIcon
}

async function loadTeaser(item: NavLink, language: string): Promise<Teaser> {
  const path = trimSlashes(item.href ?? '')
  const description = TEASERS[path] ?? (await getPageTeaserText(path, language)).description
  return {
    label: item.label ?? path,
    href: `/${path}`,
    description: description || item.description || '',
    Icon: ICONS[path],
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const settings = await getSiteSettings(language)
  const seo = coalescePageSeo(null, settings)
  seo.metaTitle = 'Shopify-tjenester: nettbutikk, migrering, B2B og utvikling'
  seo.metaDescription = PAGE_INTRO
  seo.ogTitle = seo.metaTitle
  seo.ogDescription = PAGE_INTRO
  return buildMetadata({ seo, settings, language, pathWithoutLang: ROUTE_PATH })
}

export default async function TjenesterOverviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // Norwegian IA only; the English site has no /tjenester.
  if (language !== 'no') notFound()

  const teasers = await Promise.all(leveranserItems().map((item) => loadTeaser(item, language)))

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero
          eyebrow="Leveranser"
          title={PAGE_TITLE}
          description={PAGE_INTRO}
          buttons={[
            { text: 'Book møte', link: `/${CONTACT_SLUG.no}`, variant: 'primary' },
            { text: 'Se alle pakker', link: packagesHref(language), variant: 'secondary' },
          ]}
          visual={
            HERO_IMAGE ? (
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                width={HERO_IMAGE.width}
                height={HERO_IMAGE.height}
                priority
                className="h-auto w-full rounded-lg"
              />
            ) : (
              <DataFlowAnimation
                variant="overview"
                systems={[{ name: 'Shopify', role: 'source' }]}
                steps={[
                  { from: 'Shopify', to: 'Nettbutikk', payload: 'ny butikk' },
                  { from: 'Migrering', to: 'Shopify', payload: 'produkter + kunder' },
                  { from: 'Shopify', to: 'B2B', payload: 'ordreportal' },
                  { from: 'Utvikling', to: 'Shopify', payload: 'skreddersøm' },
                ]}
                language={language}
                nodes={[
                  { label: 'Nettbutikk', logos: [] },
                  { label: 'Migrering', logos: [] },
                  { label: 'B2B og ordreportal', logos: [] },
                  { label: 'Utvikling', logos: [] },
                ]}
              />
            )
          }
        />

        <section className="bg-white">
          <div className="section_container max-w-[1320px] mx-auto page-padding-x py-10 lg:py-20">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 list-none p-0 m-0">
              {teasers.map((teaser) => (
                <li key={teaser.href}>
                  <LocalizedLink
                    href={teaser.href}
                    className="group flex h-full flex-col rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-8 transition-transform hover:-translate-y-1"
                  >
                    {teaser.Icon && (
                      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sc-cyan-500 text-white">
                        <teaser.Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    )}
                    <h2 className="text-[22px] lg:text-[28px] font-bold text-sc-ink-900 tracking-[-0.01em] mb-3">
                      {teaser.label}
                    </h2>
                    {teaser.description && (
                      <p className="flex-1 text-sm lg:text-[15px] leading-relaxed text-sc-ink-600 mb-6 m-0">
                        {teaser.description}
                      </p>
                    )}
                    <span className="mt-auto text-sm font-semibold text-sc-cyan-500 group-hover:text-sc-cyan-600">
                      Les mer →
                    </span>
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-sc-ink-50">
          <div className="section_container max-w-[1320px] mx-auto page-padding-x py-10 lg:py-20 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
            <div className="flex-1">
              <h2 className="text-[26px] lg:text-[36px] font-bold text-sc-ink-900 tracking-[-0.02em] leading-snug mb-2">
                Vet du hva du trenger?
              </h2>
              <p className="text-sm lg:text-[15px] leading-relaxed text-sc-ink-600 m-0">
                Se pakkene med fast pris, eller book et møte så finner vi riktig løsning sammen.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LocalizedLink
                href={packagesHref(language)}
                className="inline-flex items-center justify-center rounded-lg bg-[#1EEFFA] px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-teal"
              >
                Se alle pakker
              </LocalizedLink>
              <LocalizedLink
                href={`/${CONTACT_SLUG.no}`}
                className="inline-flex items-center justify-center rounded-lg border border-sc-ink-200 bg-[#1EEFFA] px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-teal"
              >
                Book møte
              </LocalizedLink>
            </div>
          </div>
        </section>
      </main>
      <FooterWrapper />
    </div>
  )
}
