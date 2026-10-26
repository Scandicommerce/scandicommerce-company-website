import type { Metadata } from 'next'
import { ArrowLeftRight, Building2, CodeXml, Store, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import LocalizedLink from '@/components/ui/LocalizedLink'
import ServiceHero from '@/components/sections/services/ServiceHero'
import DataFlowAnimation from '@/components/integrations/DataFlowAnimation'
import { navigationNo, type NavLink } from '@/lib/navigation'
import { getPageTeaserText } from '@/lib/pageTeaser'
import { packagesHref, CONTACT_SLUG, trimSlashes } from '@/lib/routes'
import type { Language } from '@/lib/site-config'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import { ui } from '@/components/integrations/labels'
import { Faq } from '@/components/integrations/LinkBlocks'
import { getServicesOverview, serviceLang, type ServiceLang } from '@/lib/servicesDepth'

/** Route path without language prefix, per language. */
export const SERVICES_OVERVIEW_PATH: Record<ServiceLang, string> = { no: 'tjenester', en: 'services', sv: 'services', da: 'services', de: 'services' }

/**
 * Illustration to the right of the heading. Set `src` to a file under
 * /public (e.g. '/images/tjenester/hero.png') or a Sanity CDN URL; while it is
 * null the hero renders text-only.
 */
const HERO_IMAGE: { src: string; alt: string; width: number; height: number } | null = null

interface FlowStep {
  from: string
  to: string
  payload: string
}

interface OverviewCopy {
  metaTitle: string
  eyebrow: string
  title: string
  intro: string
  bookMeeting: string
  allPackages: string
  readMore: string
  flowSteps: FlowStep[]
  flowNodes: string[]
  chooserEyebrow: string
  chooserTitle: string
  chooserLead: string
  processEyebrow: string
  processTitle: string
  faqHeading: string
  ctaTitle: string
  ctaText: string
}

const COPY: Record<ServiceLang, OverviewCopy> = {
  no: {
    metaTitle: 'Shopify-tjenester: nettbutikk, migrering, B2B og utvikling',
    eyebrow: 'Leveranser',
    title: 'Tjenester',
    intro: 'Fra ny nettbutikk eller migrering til Shopify, til integrerte B2B-portaler og unik skreddersøm.',
    bookMeeting: 'Book møte',
    allPackages: 'Se alle pakker',
    readMore: 'Les mer →',
    flowSteps: [
      { from: 'Shopify', to: 'Nettbutikk', payload: 'ny butikk' },
      { from: 'Migrering', to: 'Shopify', payload: 'produkter + kunder' },
      { from: 'Shopify', to: 'B2B', payload: 'ordreportal' },
      { from: 'Utvikling', to: 'Shopify', payload: 'skreddersøm' },
    ],
    flowNodes: ['Nettbutikk', 'Migrering', 'B2B og ordreportal', 'Utvikling'],
    chooserEyebrow: 'Hva passer deg',
    chooserTitle: 'Start med situasjonen din',
    chooserLead: 'Finn linjen som ligner mest. Er du usikker, tar vi en kartlegging og anbefaler.',
    processEyebrow: 'Slik jobber vi',
    processTitle: 'Samme fremgangsmåte, uansett leveranse',
    faqHeading: 'Vanlige spørsmål',
    ctaTitle: 'Vet du hva du trenger?',
    ctaText: 'Se pakkene med fast pris, eller book et møte så finner vi riktig løsning sammen.',
  },
  en: {
    metaTitle: 'Shopify services: new store, migration, B2B and development',
    eyebrow: 'Services',
    title: 'Services',
    intro: 'From a new store or a migration to Shopify, to integrated B2B portals and custom development built for your business.',
    bookMeeting: 'Book a meeting',
    allPackages: 'See all packages',
    readMore: 'Read more →',
    flowSteps: [
      { from: 'Shopify', to: 'New store', payload: 'new store' },
      { from: 'Migration', to: 'Shopify', payload: 'products + customers' },
      { from: 'Shopify', to: 'B2B', payload: 'order portal' },
      { from: 'Development', to: 'Shopify', payload: 'custom work' },
    ],
    flowNodes: ['New store', 'Migration', 'B2B and order portal', 'Development'],
    chooserEyebrow: 'What fits you',
    chooserTitle: 'Start with your situation',
    chooserLead: 'Find the line that sounds most like you. If you are unsure, we do a discovery session and recommend.',
    processEyebrow: 'How we work',
    processTitle: 'The same approach, whatever we deliver',
    faqHeading: 'Common questions',
    ctaTitle: 'Know what you need?',
    ctaText: 'See the fixed-price packages, or book a meeting and we find the right solution together.',
  },
  sv: {
    metaTitle: 'Shopify-tjänster: ny butik, migrering, B2B och utveckling',
    eyebrow: 'Tjänster',
    title: 'Tjänster',
    intro: 'Från ny butik eller migrering till Shopify, till integrerade B2B-portaler och skräddarsydd utveckling byggd för er verksamhet.',
    bookMeeting: 'Boka möte',
    allPackages: 'Se alla paket',
    readMore: 'Läs mer →',
    flowSteps: [
      { from: 'Shopify', to: 'Ny butik', payload: 'ny butik' },
      { from: 'Migrering', to: 'Shopify', payload: 'produkter + kunder' },
      { from: 'Shopify', to: 'B2B', payload: 'orderportal' },
      { from: 'Utveckling', to: 'Shopify', payload: 'skräddarsytt' },
    ],
    flowNodes: ['Ny butik', 'Migrering', 'B2B och orderportal', 'Utveckling'],
    chooserEyebrow: 'Vad passar er',
    chooserTitle: 'Börja med er situation',
    chooserLead: 'Hitta raden som låter mest som ni. Är ni osäkra gör vi en kartläggning och rekommenderar.',
    processEyebrow: 'Så arbetar vi',
    processTitle: 'Samma tillvägagångssätt, oavsett leverans',
    faqHeading: 'Vanliga frågor',
    ctaTitle: 'Vet ni vad ni behöver?',
    ctaText: 'Se paketen med fast pris, eller boka ett möte så hittar vi rätt lösning tillsammans.',
  },
  da: {
    metaTitle: 'Shopify-ydelser: ny webshop, migrering, B2B og udvikling',
    eyebrow: 'Ydelser',
    title: 'Ydelser',
    intro: 'Fra ny webshop eller migrering til Shopify, til integrerede B2B-portaler og skræddersyet udvikling bygget til jeres forretning.',
    bookMeeting: 'Book møde',
    allPackages: 'Se alle pakker',
    readMore: 'Læs mere →',
    flowSteps: [
      { from: 'Shopify', to: 'Ny webshop', payload: 'ny webshop' },
      { from: 'Migrering', to: 'Shopify', payload: 'produkter + kunder' },
      { from: 'Shopify', to: 'B2B', payload: 'ordreportal' },
      { from: 'Udvikling', to: 'Shopify', payload: 'skræddersyet' },
    ],
    flowNodes: ['Ny webshop', 'Migrering', 'B2B og ordreportal', 'Udvikling'],
    chooserEyebrow: 'Hvad passer til jer',
    chooserTitle: 'Start med jeres situation',
    chooserLead: 'Find den linje, der ligner jer mest. Er I i tvivl, laver vi en afklaring og anbefaler.',
    processEyebrow: 'Sådan arbejder vi',
    processTitle: 'Samme fremgangsmåde, uanset hvad vi leverer',
    faqHeading: 'Ofte stillede spørgsmål',
    ctaTitle: 'Ved I, hvad I har brug for?',
    ctaText: 'Se pakkerne med fast pris, eller book et møde, så finder vi den rigtige løsning sammen.',
  },
  de: {
    metaTitle: 'Shopify-Leistungen: neuer Shop, Migration, B2B und Entwicklung',
    eyebrow: 'Leistungen',
    title: 'Leistungen',
    intro: 'Vom neuen Shop oder der Migration zu Shopify bis zu integrierten B2B-Portalen und individueller Entwicklung für Ihr Unternehmen.',
    bookMeeting: 'Termin vereinbaren',
    allPackages: 'Alle Pakete ansehen',
    readMore: 'Mehr erfahren →',
    flowSteps: [
      { from: 'Shopify', to: 'Neuer Shop', payload: 'neuer Shop' },
      { from: 'Migration', to: 'Shopify', payload: 'Produkte + Kunden' },
      { from: 'Shopify', to: 'B2B', payload: 'Bestellportal' },
      { from: 'Entwicklung', to: 'Shopify', payload: 'Individualisierung' },
    ],
    flowNodes: ['Neuer Shop', 'Migration', 'B2B und Bestellportal', 'Entwicklung'],
    chooserEyebrow: 'Was zu Ihnen passt',
    chooserTitle: 'Starten Sie mit Ihrer Situation',
    chooserLead: 'Finden Sie die Zeile, die am ehesten auf Sie zutrifft. Wenn Sie unsicher sind, machen wir eine Analyse und sprechen eine Empfehlung aus.',
    processEyebrow: 'So arbeiten wir',
    processTitle: 'Dieselbe Vorgehensweise, egal was wir liefern',
    faqHeading: 'Häufige Fragen',
    ctaTitle: 'Wissen Sie, was Sie brauchen?',
    ctaText: 'Sehen Sie sich die Festpreispakete an, oder vereinbaren Sie einen Termin und wir finden gemeinsam die richtige Lösung.',
  },
}

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
  'services/shopify': Store,
  'services/migrate': ArrowLeftRight,
  'services/b2b': Building2,
  'services/shopify-development': CodeXml,
}

interface Teaser {
  label: string
  href: string
  description: string
  Icon?: LucideIcon
}

/**
 * English sub-pages. The English menu has no Leveranser column, so this list
 * is the source of truth for the cards on /services. Swedish, Danish and
 * German share the English routes and get their own copy below.
 */
const TEASERS_EN: Teaser[] = [
  {
    label: 'New Shopify store',
    href: '/services/shopify',
    description: 'A new store on Shopify or Shopify Plus, from design and setup to launch. Fixed price and a clear scope.',
    Icon: ICONS['services/shopify'],
  },
  {
    label: 'Migration to Shopify',
    href: '/services/migrate',
    description: 'Move to Shopify without the risk. We migrate products, customers and orders, keep your SEO rankings and avoid downtime.',
    Icon: ICONS['services/migrate'],
  },
  {
    label: 'B2B and order portal',
    href: '/services/b2b',
    description: 'An order portal and B2B commerce on Shopify: customer-specific prices, self-service ordering and buying on invoice.',
    Icon: ICONS['services/b2b'],
  },
  {
    label: 'Development and custom work',
    href: '/services/shopify-development',
    description: 'We build your Shopify store or architecture exactly the way you want it, whether that is a configurator, apps, agents or new functionality, tailored to your store and business model.',
    Icon: ICONS['services/shopify-development'],
  },
]

const TEASERS_SV: Teaser[] = [
  {
    label: 'Ny Shopify-butik',
    href: '/services/shopify',
    description: 'En ny butik på Shopify eller Shopify Plus, från design och uppsättning till lansering. Fast pris och tydlig omfattning.',
    Icon: ICONS['services/shopify'],
  },
  {
    label: 'Migrering till Shopify',
    href: '/services/migrate',
    description: 'Flytta till Shopify utan risk. Vi migrerar produkter, kunder och ordrar, behåller era SEO-rankingar och undviker driftstopp.',
    Icon: ICONS['services/migrate'],
  },
  {
    label: 'B2B och orderportal',
    href: '/services/b2b',
    description: 'En orderportal och B2B-handel på Shopify: kundspecifika priser, självbetjänad beställning och köp mot faktura.',
    Icon: ICONS['services/b2b'],
  },
  {
    label: 'Utveckling och skräddarsytt',
    href: '/services/shopify-development',
    description: 'Vi bygger er Shopify-butik eller arkitektur precis som ni vill ha den, oavsett om det är en konfigurator, appar, agenter eller ny funktionalitet, anpassat till er butik och affärsmodell.',
    Icon: ICONS['services/shopify-development'],
  },
]

const TEASERS_DA: Teaser[] = [
  {
    label: 'Ny Shopify-webshop',
    href: '/services/shopify',
    description: 'En ny webshop på Shopify eller Shopify Plus, fra design og opsætning til lancering. Fast pris og tydeligt omfang.',
    Icon: ICONS['services/shopify'],
  },
  {
    label: 'Migrering til Shopify',
    href: '/services/migrate',
    description: 'Flyt til Shopify uden risiko. Vi migrerer produkter, kunder og ordrer, bevarer jeres SEO-placeringer og undgår nedetid.',
    Icon: ICONS['services/migrate'],
  },
  {
    label: 'B2B og ordreportal',
    href: '/services/b2b',
    description: 'En ordreportal og B2B-handel på Shopify: kundespecifikke priser, selvbetjent bestilling og køb på faktura.',
    Icon: ICONS['services/b2b'],
  },
  {
    label: 'Udvikling og skræddersyet arbejde',
    href: '/services/shopify-development',
    description: 'Vi bygger jeres Shopify-webshop eller arkitektur præcis, som I vil have den, uanset om det er en konfigurator, apps, agenter eller ny funktionalitet, tilpasset jeres shop og forretningsmodel.',
    Icon: ICONS['services/shopify-development'],
  },
]

const TEASERS_DE: Teaser[] = [
  {
    label: 'Neuer Shopify-Shop',
    href: '/services/shopify',
    description: 'Ein neuer Shop auf Shopify oder Shopify Plus, von Design und Einrichtung bis zum Launch. Festpreis und klarer Umfang.',
    Icon: ICONS['services/shopify'],
  },
  {
    label: 'Migration zu Shopify',
    href: '/services/migrate',
    description: 'Wechseln Sie ohne Risiko zu Shopify. Wir migrieren Produkte, Kunden und Bestellungen, erhalten Ihre SEO-Rankings und vermeiden Ausfallzeiten.',
    Icon: ICONS['services/migrate'],
  },
  {
    label: 'B2B und Bestellportal',
    href: '/services/b2b',
    description: 'Ein Bestellportal und B2B-Handel auf Shopify: kundenspezifische Preise, Self-Service-Bestellung und Kauf auf Rechnung.',
    Icon: ICONS['services/b2b'],
  },
  {
    label: 'Entwicklung und Individualisierung',
    href: '/services/shopify-development',
    description: 'Wir bauen Ihren Shopify-Shop oder Ihre Architektur genau so, wie Sie es wollen, ob Konfigurator, Apps, Agenten oder neue Funktionen, zugeschnitten auf Ihren Shop und Ihr Geschäftsmodell.',
    Icon: ICONS['services/shopify-development'],
  },
]

/** Cards per language for the .com site; Norwegian builds its own from the menu. */
const TEASERS_BY_LANG: Record<Exclude<ServiceLang, 'no'>, Teaser[]> = { en: TEASERS_EN, sv: TEASERS_SV, da: TEASERS_DA, de: TEASERS_DE }

/**
 * The Leveranser column of the Tjenester menu, minus this page itself. The
 * menu is the single source of truth: adding or renaming a Leveranser item
 * there updates this overview too.
 */
function leveranserItems(): NavLink[] {
  const tjenester = navigationNo.find((item) => item.label === 'Tjenester')
  const column = tjenester?.columns?.find((col) => col.title === 'Leveranser')
  return (column?.items ?? []).filter((item) => item.href && trimSlashes(item.href) !== SERVICES_OVERVIEW_PATH.no)
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

async function loadTeasers(language: string): Promise<Teaser[]> {
  const l = serviceLang(language)
  if (l === 'no') return Promise.all(leveranserItems().map((item) => loadTeaser(item, language)))
  return TEASERS_BY_LANG[l]
}

export async function servicesOverviewMetadata(language: string): Promise<Metadata> {
  const l = serviceLang(language)
  const copy = COPY[l]
  const settings = await getSiteSettings(language)
  const seo = coalescePageSeo(null, settings)
  seo.metaTitle = copy.metaTitle
  seo.metaDescription = copy.intro
  seo.ogTitle = seo.metaTitle
  seo.ogDescription = copy.intro
  return buildMetadata({ seo, settings, language, pathWithoutLang: SERVICES_OVERVIEW_PATH[l] })
}

export default async function ServicesOverviewPage({ language }: { language: string }) {
  const l = serviceLang(language)
  const copy = COPY[l]
  const overview = getServicesOverview(language)
  const contactHref = `/${CONTACT_SLUG[language as Language] ?? CONTACT_SLUG.en}`
  const teasers = await loadTeasers(language)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.intro}
          visualFrame={false}
          buttons={[
            { text: copy.bookMeeting, link: contactHref, variant: 'primary' },
            { text: copy.allPackages, link: packagesHref(language), variant: 'secondary' },
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
                steps={copy.flowSteps}
                language={language}
                nodes={copy.flowNodes.map((label) => ({ label, logos: [] }))}
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
                    <span className="mt-auto text-sm font-semibold text-sc-ink-900 group-hover:text-sc-cyan-600">{copy.readMore}</span>
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
                <div className={ui.eyebrow}>{copy.chooserEyebrow}</div>
                <h2 className={ui.h2}>{copy.chooserTitle}</h2>
              </div>
              <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{copy.chooserLead}</p>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 p-0">
              {overview.chooser.map((c) => (
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
              <div className={ui.eyebrow}>{copy.processEyebrow}</div>
              <h2 className={ui.h2}>{copy.processTitle}</h2>
            </div>
            <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {overview.process.map((step, i) => (
                <li key={step.title} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                  <span className="font-mono text-[13px] text-sc-ink-500">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{step.title}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Faq items={overview.faq} heading={copy.faqHeading} />

        <section className="bg-sc-ink-900 py-16 text-white lg:py-20">
          <div className={`${ui.container} flex flex-wrap items-center justify-between gap-8`}>
            <div className="flex max-w-[640px] flex-col gap-3">
              <h2 className="m-0 text-[32px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]">{copy.ctaTitle}</h2>
              <p className="m-0 text-lg leading-relaxed text-sc-ink-200">{copy.ctaText}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LocalizedLink
                href={packagesHref(language)}
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50"
              >
                {copy.allPackages}
              </LocalizedLink>
              <LocalizedLink
                href={contactHref}
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-sc-ink-600 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-ink-800"
              >
                {copy.bookMeeting}
              </LocalizedLink>
            </div>
          </div>
        </section>
      </main>
      <FooterWrapper />
    </div>
  )
}
