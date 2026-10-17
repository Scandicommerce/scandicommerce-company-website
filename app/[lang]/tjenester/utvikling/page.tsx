import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ServiceHero from '@/components/sections/services/ServiceHero'
import CodeEditorMockup from '@/components/sections/services/visuals/CodeEditorMockup'
import { ShopifyDevelopmentPageSectionRenderer } from '@/components/pageSectionRenderers/ShopifyDevelopmentPageSectionRenderer'
import { ServiceDeliverables, ServiceFacts, ServiceFaq, ServiceIntegrations, ServiceLinks, ServicePrerequisites } from '@/components/sections/services/depth/ServiceDepth'
import { servicesDepth } from '@/lib/servicesDepth'
import { getLanguageFromParams } from '@/lib/language'
import { coalescePageSeo, getPageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import { client } from '@/sanity/lib/client'
import { shopifyDevelopmentPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ROUTE_PATH = 'tjenester/utvikling'

/**
 * Hero copy for the new IA. The Sanity hero ("Shopify for seriøse merkevarer")
 * is about Shopify in general, which is now /tjenester/shopify; only its
 * buttons are used here. Everything below the hero still comes from Sanity.
 */
const hero = {
  eyebrow: 'Utvikling og skreddersøm',
  title: 'Shopify, bygget akkurat slik du vil',
  highlight: 'akkurat slik du vil',
  description:
    'Vi utvikler din Shopify-butikk eller arkitektur akkurat slik du vil, enten det er konfigurator, apper, agenter eller ny funksjonalitet – tilpasset din butikk og forretningsmodell.',
  highlights: ['Konfiguratorer', 'Apper og integrasjoner', 'Agenter og AI'],
}

interface ShopifyDevPageData {
  _id: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
}

interface HeroSection {
  heroButtons?: Array<{ text: string; link: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const [doc, settings] = await Promise.all([
    getPageSeo({ type: 'shopifyDevelopmentPage', slug: ROUTE_PATH, language }),
    getSiteSettings(language),
  ])
  const seo = coalescePageSeo(doc, settings)
  return buildMetadata({ seo, settings, language, pathWithoutLang: ROUTE_PATH, docType: 'shopifyDevelopmentPage' })
}

export default async function UtviklingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // Norwegian IA only; the English page stays at /services/shopify-development.
  if (language !== 'no') notFound()

  const pageData = await client
    .fetch<ShopifyDevPageData | null>(shopifyDevelopmentPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)
  const sections = normalizePageSections('shopifyDevelopmentPage', pageData)
  const heroSection = sections.find((s) => s._type === 'shopifyDevelopmentPageHeroSection') as HeroSection | undefined
  const depth = servicesDepth.utvikling

  const buttons = heroSection?.heroButtons?.length
    ? heroSection.heroButtons.map((b, i) => ({
        text: b.text,
        link: b.link,
        variant: i === 0 ? ('primary' as const) : ('secondary' as const),
      }))
    : [
        { text: 'Book møte', link: '/kontakt', variant: 'primary' as const },
        { text: 'Se pakkene', link: '/tjenester/alle-pakker', variant: 'secondary' as const },
      ]

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero {...hero} buttons={buttons} visual={<CodeEditorMockup />} />
        <ServiceFacts depth={depth} />
        <ShopifyDevelopmentPageSectionRenderer
          sections={sections.filter((s) => s._type !== 'shopifyDevelopmentPageHeroSection' && s._type !== 'shopifyDevelopmentPageCtaSection')}
        />
        <ServiceDeliverables depth={depth} />
        <ServicePrerequisites depth={depth} />
        <ServiceIntegrations depth={depth} language={language} />
        <ServiceFaq depth={depth} />
        <ServiceLinks depth={depth} />
        <ShopifyDevelopmentPageSectionRenderer sections={sections.filter((s) => s._type === 'shopifyDevelopmentPageCtaSection')} />
      </main>
      <FooterWrapper />
    </div>
  )
}
