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
import { ui } from '@/components/integrations/labels'
import { Faq } from '@/components/integrations/LinkBlocks'
import { servicesOverview } from '@/lib/servicesDepth'

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
          visualFrame={false}
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

        <section className="bg-white pb-16 lg:pb-20">
          <div className={ui.container}>
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:gap-5">
              {teasers.map((teaser) => (
                <li key={teaser.href}>
                  <LocalizedLink href={teaser.href} className={`${ui.card} group h-full no-underline`}>
                    {teaser.Icon && (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sc-cyan-500 text-white">
                        <teaser.Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    )}
                    <h2 className="m-0 text-[22px] font-bold leading-snug tracking-[-0.01em] text-sc-ink-900 lg:text-[26px]">{teaser.label}</h2>
                    {teaser.description && <p className="m-0 flex-1 text-[15px] leading-relaxed text-sc-ink-600">{teaser.description}</p>}
                    <span className="mt-auto text-sm font-semibold text-sc-ink-900 group-hover:text-sc-cyan-600">Les mer →</span>
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="hva-passer" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
          <div className={ui.container}>
            <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
              <div className="flex flex-col gap-2.5">
                <div className={ui.eyebrow}>Hva passer deg</div>
                <h2 className={ui.h2}>Start med situasjonen din</h2>
              </div>
              <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">Finn linjen som ligner mest. Er du usikker, tar vi en kartlegging og anbefaler.</p>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 p-0">
              {servicesOverview.chooser.map((c) => (
                <li key={c.href}>
                  <LocalizedLink href={c.href} className="group flex flex-col gap-2 bg-white p-5 no-underline transition-colors hover:bg-sc-ink-50 md:flex-row md:items-center md:justify-between md:gap-8 lg:px-6">
                    <span className="text-[16px] leading-snug text-sc-ink-700 md:max-w-[520px]">{c.situation}</span>
                    <span className="flex items-center gap-2 text-[15px] font-semibold text-sc-ink-900 group-hover:text-sc-cyan-600">
                      {c.service} <span aria-hidden="true">→</span>
                    </span>
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20">
          <div className={`${ui.container} flex flex-col gap-10`}>
            <div className="flex max-w-[680px] flex-col gap-2.5">
              <div className={ui.eyebrow}>Slik jobber vi</div>
              <h2 className={ui.h2}>Samme fremgangsmåte, uansett leveranse</h2>
            </div>
            <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {servicesOverview.process.map((step, i) => (
                <li key={step.title} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                  <span className="font-mono text-[13px] text-sc-ink-500">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{step.title}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Faq items={servicesOverview.faq} heading="Vanlige spørsmål" />

        <section className="bg-sc-ink-900 py-16 text-white lg:py-20">
          <div className={`${ui.container} flex flex-wrap items-center justify-between gap-8`}>
            <div className="flex max-w-[640px] flex-col gap-3">
              <h2 className="m-0 text-[32px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]">Vet du hva du trenger?</h2>
              <p className="m-0 text-lg leading-relaxed text-sc-ink-200">Se pakkene med fast pris, eller book et møte så finner vi riktig løsning sammen.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LocalizedLink
                href={packagesHref(language)}
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50"
              >
                Se alle pakker
              </LocalizedLink>
              <LocalizedLink
                href={`/${CONTACT_SLUG.no}`}
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-sc-ink-600 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-ink-800"
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
