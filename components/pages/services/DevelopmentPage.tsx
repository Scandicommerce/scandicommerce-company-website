import type { Metadata } from 'next'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ServiceHero from '@/components/sections/services/ServiceHero'
import CodeEditorMockup from '@/components/sections/services/visuals/CodeEditorMockup'
import { ShopifyDevelopmentPageSectionRenderer } from '@/components/pageSectionRenderers/ShopifyDevelopmentPageSectionRenderer'
import { ServiceDeliverables, ServiceFacts, ServiceFaq, ServiceIntegrations, ServiceLinks, ServicePrerequisites } from '@/components/sections/services/depth/ServiceDepth'
import { getServicesDepth, serviceLang, type ServiceLang } from '@/lib/servicesDepth'
import { coalescePageSeo, getPageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import { client } from '@/sanity/lib/client'
import { shopifyDevelopmentPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'

export const DEVELOPMENT_PATH: Record<ServiceLang, string> = { no: 'tjenester/utvikling', en: 'services/shopify-development', sv: 'services/shopify-development', da: 'services/shopify-development', de: 'services/shopify-development' }

interface HeroButton {
  text: string
  link: string
  variant: 'primary' | 'secondary'
}

/**
 * Hero copy for the new IA. The Sanity hero ("Shopify for seriøse merkevarer")
 * is about Shopify in general, which is now the new-store page; only its
 * buttons are used here. Everything below the hero still comes from Sanity.
 */
interface Copy {
  hero: { eyebrow: string; title: string; highlight: string; description: string; highlights: string[] }
  /** Used when the Sanity hero has no buttons. */
  fallbackButtons: HeroButton[]
}

const COPY: Record<ServiceLang, Copy> = {
  no: {
    hero: {
      eyebrow: 'Utvikling og skreddersøm',
      title: 'Shopify, bygget akkurat slik du vil',
      highlight: 'akkurat slik du vil',
      description:
        'Vi utvikler din Shopify-butikk eller arkitektur akkurat slik du vil, enten det er konfigurator, apper, agenter eller ny funksjonalitet – tilpasset din butikk og forretningsmodell.',
      highlights: ['Konfiguratorer', 'Apper og integrasjoner', 'Agenter og AI'],
    },
    fallbackButtons: [
      { text: 'Book møte', link: '/kontakt', variant: 'primary' },
      { text: 'Se pakkene', link: '/tjenester/alle-pakker', variant: 'secondary' },
    ],
  },
  en: {
    hero: {
      eyebrow: 'Development and custom work',
      title: 'Shopify, built exactly the way you want it',
      highlight: 'exactly the way you want it',
      description:
        'We build your Shopify store or architecture exactly the way you want it, whether that is a configurator, apps, agents or new functionality – tailored to your store and business model.',
      highlights: ['Configurators', 'Apps and integrations', 'Agents and AI'],
    },
    fallbackButtons: [
      { text: 'Book a meeting', link: '/contact', variant: 'primary' },
      { text: 'See the packages', link: '/services/all-packages', variant: 'secondary' },
    ],
  },
  sv: {
    hero: {
      eyebrow: 'Utveckling och skräddarsytt',
      title: 'Shopify, byggt precis som ni vill ha det',
      highlight: 'precis som ni vill ha det',
      description:
        'Vi bygger er Shopify-butik eller arkitektur precis som ni vill ha den, oavsett om det är en konfigurator, appar, agenter eller ny funktionalitet – anpassat till er butik och affärsmodell.',
      highlights: ['Konfiguratorer', 'Appar och integrationer', 'Agenter och AI'],
    },
    fallbackButtons: [
      { text: 'Boka möte', link: '/contact', variant: 'primary' },
      { text: 'Se paketen', link: '/services/all-packages', variant: 'secondary' },
    ],
  },
  da: {
    hero: {
      eyebrow: 'Udvikling og skræddersyet arbejde',
      title: 'Shopify, bygget præcis som I vil have det',
      highlight: 'præcis som I vil have det',
      description:
        'Vi bygger jeres Shopify-webshop eller arkitektur præcis, som I vil have den, uanset om det er en konfigurator, apps, agenter eller ny funktionalitet – tilpasset jeres shop og forretningsmodel.',
      highlights: ['Konfiguratorer', 'Apps og integrationer', 'Agenter og AI'],
    },
    fallbackButtons: [
      { text: 'Book møde', link: '/contact', variant: 'primary' },
      { text: 'Se pakkerne', link: '/services/all-packages', variant: 'secondary' },
    ],
  },
  de: {
    hero: {
      eyebrow: 'Entwicklung und Individualisierung',
      title: 'Shopify, genau so gebaut, wie Sie es wollen',
      highlight: 'genau so gebaut, wie Sie es wollen',
      description:
        'Wir bauen Ihren Shopify-Shop oder Ihre Architektur genau so, wie Sie es wollen, ob Konfigurator, Apps, Agenten oder neue Funktionen – zugeschnitten auf Ihren Shop und Ihr Geschäftsmodell.',
      highlights: ['Konfiguratoren', 'Apps und Integrationen', 'Agenten und KI'],
    },
    fallbackButtons: [
      { text: 'Termin vereinbaren', link: '/contact', variant: 'primary' },
      { text: 'Pakete ansehen', link: '/services/all-packages', variant: 'secondary' },
    ],
  },
}

interface ShopifyDevPageData {
  _id: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
}

interface HeroSection {
  heroButtons?: Array<{ text: string; link: string }>
}

async function fetchSections(language: string) {
  const pageData = await client
    .fetch<ShopifyDevPageData | null>(shopifyDevelopmentPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)
  return normalizePageSections('shopifyDevelopmentPage', pageData)
}

/** Sections for the page language; a language without its own document renders the English one. */
async function loadSections(language: string) {
  const sections = await fetchSections(language)
  if (sections.length > 0 || language === 'no' || language === 'en') return sections
  return fetchSections('en')
}

export async function developmentMetadata(language: string): Promise<Metadata> {
  const l = serviceLang(language)
  const routePath = DEVELOPMENT_PATH[l]
  const [doc, settings] = await Promise.all([
    getPageSeo({ type: 'shopifyDevelopmentPage', slug: routePath, language }),
    getSiteSettings(language),
  ])
  const seo = coalescePageSeo(doc, settings)
  return buildMetadata({ seo, settings, language, pathWithoutLang: routePath, docType: 'shopifyDevelopmentPage' })
}

export default async function DevelopmentPage({ language }: { language: string }) {
  const copy = COPY[serviceLang(language)]
  const sections = await loadSections(language)
  const heroSection = sections.find((s) => s._type === 'shopifyDevelopmentPageHeroSection') as HeroSection | undefined
  const depth = getServicesDepth('utvikling', language)

  const buttons: HeroButton[] = heroSection?.heroButtons?.length
    ? heroSection.heroButtons.map((b, i) => ({
        text: b.text,
        link: b.link,
        variant: i === 0 ? ('primary' as const) : ('secondary' as const),
      }))
    : copy.fallbackButtons

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero {...copy.hero} buttons={buttons} visual={<CodeEditorMockup />} />
        <ServiceFacts depth={depth} />
        <ShopifyDevelopmentPageSectionRenderer
          lang={language}
          sections={sections.filter((s) => s._type !== 'shopifyDevelopmentPageHeroSection' && s._type !== 'shopifyDevelopmentPageCtaSection')}
        />
        <ServiceDeliverables depth={depth} language={language} />
        <ServicePrerequisites depth={depth} language={language} />
        <ServiceIntegrations depth={depth} language={language} />
        <ServiceFaq depth={depth} />
        <ServiceLinks depth={depth} language={language} />
        <ShopifyDevelopmentPageSectionRenderer lang={language} sections={sections.filter((s) => s._type === 'shopifyDevelopmentPageCtaSection')} />
      </main>
      <FooterWrapper />
    </div>
  )
}
