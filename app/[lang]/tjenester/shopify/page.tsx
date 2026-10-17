import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ServiceHero from '@/components/sections/services/ServiceHero'
import StorefrontMockup from '@/components/sections/services/visuals/StorefrontMockup'
import WhyShopifyWins from '@/components/sections/services/shopify_development/WhyShopifyWins'
import HowWeWork from '@/components/sections/services/shopify_development/HowWeWork'
import ReadyToBuild from '@/components/sections/services/shopify_development/ReadyToBuild'
import ReadMoreSection from '@/components/sections/services/ReadMoreSection'
import { ServiceDeliverables, ServiceFacts, ServiceFaq, ServiceIntegrations, ServiceLinks, ServicePrerequisites } from '@/components/sections/services/depth/ServiceDepth'
import { servicesDepth } from '@/lib/servicesDepth'
import Image from 'next/image'
import { getLanguageFromParams } from '@/lib/language'
import { getPageTeaserText } from '@/lib/pageTeaser'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ROUTE_PATH = 'tjenester/shopify'

// Draft copy. Positioning: a new store on Shopify / Shopify Plus, built and
// launched at a fixed price. Custom apps and integrations belong on
// /tjenester/utvikling, so keep this page about the store itself.
const META_TITLE = 'Ny nettbutikk på Shopify og Shopify Plus'
const META_DESCRIPTION =
  'Vi bygger og lanserer nettbutikken din på Shopify eller Shopify Plus – fra design og oppsett til lansering, med fast pris og tydelig omfang.'

const hero = {
  eyebrow: 'Shopify & nettbutikk',
  title: 'Ny nettbutikk på Shopify',
  highlight: 'Shopify',
  description:
    'Vi designer, bygger og lanserer nettbutikken din på Shopify eller Shopify Plus. Fast pris, tydelig omfang og en butikk du kan drive selv fra dag én.',
  buttons: [
    { text: 'Book møte', link: '/kontakt', variant: 'primary' as const },
    { text: 'Se pakker og priser', link: '/tjenester/alle-pakker', variant: 'secondary' as const },
  ],
  highlights: ['Shopify Plus-partner', 'Fast pris', 'Over 50 norske merkevarer'],
}

const included = {
  whyShopifyTitle: 'Dette får du',
  whyShopifySubtitle: 'Alt som skal til for å gå live, uten overraskelser underveis.',
  whyShopifyFeatures: [
    {
      icon: 'cart',
      title: 'Design og tema',
      description: 'Et tema tilpasset merkevaren din, optimalisert for mobil og for å konvertere besøkende til kunder.',
    },
    {
      icon: 'chart',
      title: 'Oppsett og innhold',
      description: 'Produkter, kategorier, frakt, betaling og Vipps satt opp riktig fra start.',
    },
    {
      icon: 'uptime',
      title: 'Lansering',
      description: 'Testing, domene og go-live, med oss på vakt de første dagene etter lansering.',
    },
    {
      icon: 'shield',
      title: 'Opplæring',
      description: 'Teamet ditt lærer å drive butikken selv, så dere ikke er avhengige av oss for hver endring.',
    },
  ],
}

const process = {
  howWeWorkTitle: 'Slik jobber vi',
  howWeWorkSteps: [
    { number: 0, title: 'Kartlegging', description: 'Vi går gjennom mål, sortiment og hva butikken må kunne.' },
    { number: 1, title: 'Design', description: 'Vi tilpasser temaet til merkevaren din og godkjenner det med deg.' },
    { number: 2, title: 'Bygging', description: 'Vi setter opp butikken, innholdet og integrasjonene.' },
    { number: 3, title: 'Lansering', description: 'Vi tester, går live og følger opp de første ukene.' },
  ],
}

/**
 * "Read more about the platform" slot. Points at the Shopify platform page;
 * when that page moves (e.g. under Integrasjoner or Partnere), change `href`
 * here. The description comes from that page's SEO description in Sanity,
 * with `fallbackDescription` used until it has one.
 */
const platform = {
  href: '/shopify/shopify-plattformen',
  eyebrow: 'Om plattformen',
  title: 'Les mer om Shopify-plattformen',
  fallbackDescription:
    'Hvorfor Shopify og Shopify Plus er markedsledende innen netthandel, og hva plattformen gir deg ut av boksen.',
  linkText: 'Les om Shopify',
}

const cta = {
  ctaTitle: 'Klar for en ny nettbutikk?',
  ctaDescription: 'Fortell oss hva du selger og hvor du vil, så foreslår vi riktig pakke og en realistisk tidsplan.',
  ctaButtonText: 'Book møte',
  ctaButtonLink: '/kontakt',
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const settings = await getSiteSettings(language)
  const seo = coalescePageSeo(null, settings)
  seo.metaTitle = META_TITLE
  seo.metaDescription = META_DESCRIPTION
  seo.ogTitle = META_TITLE
  seo.ogDescription = META_DESCRIPTION
  return buildMetadata({ seo, settings, language, pathWithoutLang: ROUTE_PATH })
}

export default async function ShopifyNettbutikkPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // Norwegian IA only; the English site has no /tjenester.
  if (language !== 'no') notFound()

  const platformText = await getPageTeaserText(platform.href, language)
  const depth = servicesDepth.shopify

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero {...hero} visual={<StorefrontMockup />} />
        <WhyShopifyWins whyShopify={included} />
        <ServiceFacts depth={depth} />
        <HowWeWork howWeWork={process} />
        <ServiceDeliverables depth={depth} />
        <ServicePrerequisites depth={depth} />
        <ServiceIntegrations depth={depth} language={language} />
        <ReadMoreSection
          eyebrow={platform.eyebrow}
          title={platform.title}
          description={platformText.description || platform.fallbackDescription}
          href={platform.href}
          linkText={platform.linkText}
          visual={<Image src="/images/shopifyPlus.svg" alt="Shopify Plus" width={220} height={96} unoptimized className="h-auto w-[160px] md:w-full" />}
        />
        <ServiceFaq depth={depth} />
        <ServiceLinks depth={depth} />
        <ReadyToBuild cta={cta} />
      </main>
      <FooterWrapper />
    </div>
  )
}
