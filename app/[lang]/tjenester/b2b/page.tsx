import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ServiceHero from '@/components/sections/services/ServiceHero'
import OrderPortalMockup from '@/components/sections/services/visuals/OrderPortalMockup'
import WhyShopifyWins from '@/components/sections/services/shopify_development/WhyShopifyWins'
import HowWeWork from '@/components/sections/services/shopify_development/HowWeWork'
import ReadyToBuild from '@/components/sections/services/shopify_development/ReadyToBuild'
import ReadMoreSection from '@/components/sections/services/ReadMoreSection'
import { ServiceDeliverables, ServiceFacts, ServiceFaq, ServiceIntegrations, ServiceLinks, ServicePrerequisites } from '@/components/sections/services/depth/ServiceDepth'
import { servicesDepth } from '@/lib/servicesDepth'
import { getLanguageFromParams } from '@/lib/language'
import { getPageTeaserText } from '@/lib/pageTeaser'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ROUTE_PATH = 'tjenester/b2b'

// Draft copy.
const META_TITLE = 'B2B og ordreportal på Shopify'
const META_DESCRIPTION =
  'Ordreportal og B2B-handel på Shopify: egne priser per kunde, selvbetjent bestilling, kjøp på faktura og integrasjon mot ERP.'

const hero = {
  eyebrow: 'B2B og ordreportal',
  title: 'B2B-handel og ordreportal på Shopify',
  highlight: 'ordreportal',
  description:
    'La forhandlere og bedriftskunder bestille selv – med sine egne priser, betingelser og sortiment. Integrert med ERP, og gjerne i samme Shopify-butikk som forbrukersalget.',
  buttons: [
    { text: 'Book møte', link: '/kontakt', variant: 'primary' as const },
    { text: 'Se pakker og priser', link: '/tjenester/alle-pakker', variant: 'secondary' as const },
  ],
  highlights: ['Egne priser per kunde', 'Kjøp på faktura', 'Integrert med ERP'],
}

const included = {
  whyShopifyTitle: 'Det en ordreportal må kunne',
  whyShopifySubtitle: 'Alt kundene dine trenger for å bestille selv, og alt dere trenger for å slippe manuelle ordre.',
  whyShopifyFeatures: [
    {
      icon: 'cart',
      title: 'Egne priser per kunde',
      description: 'Prislister, rabatter og volumpriser per kunde eller kundegruppe, og et sortiment tilpasset hver avtale.',
    },
    {
      icon: 'chart',
      title: 'Selvbetjent bestilling',
      description: 'Kundene logger inn, ser lagerstatus og bestiller eller gjenbestiller selv, når det passer dem.',
    },
    {
      icon: 'shield',
      title: 'Faktura og betingelser',
      description: 'Kjøp på faktura med betalingsbetingelser per kunde, i tillegg til kort og Vipps.',
    },
    {
      icon: 'uptime',
      title: 'Integrert med ERP',
      description: 'Ordre, kunder, priser og lager synkroniseres med ERP-systemet, for eksempel Tripletex eller 24SevenOffice.',
    },
  ],
}

const process = {
  howWeWorkTitle: 'Slik jobber vi',
  howWeWorkSteps: [
    { number: 0, title: 'Kartlegging', description: 'Kundegrupper, prismodeller, betingelser og hvilke systemer som må snakke sammen.' },
    { number: 1, title: 'Oppsett', description: 'Bedriftskunder, prislister og sortiment satt opp i Shopify.' },
    { number: 2, title: 'Integrasjon', description: 'Kobling mot ERP og lager, så ordre og priser alltid stemmer.' },
    { number: 3, title: 'Lansering', description: 'Vi går live og hjelper deg med å få forhandlerne over i portalen.' },
  ],
}

/** Customer story shown as the read-more card; its text comes from the article's SEO fields. */
const caseStudy = {
  href: '/blogg/fra-24nettbutikk-til-effektiv-b2b-drift-pa-shopify',
  eyebrow: 'Kundecase',
  fallbackTitle: 'Fra 24Nettbutikk til effektiv B2B-drift på Shopify',
  fallbackDescription: 'Hvordan vi flyttet en norsk B2B-virksomhet til Shopify Plus, med Tripletex-integrasjon og prisroller.',
  linkText: 'Les caset',
}

const cta = {
  ctaTitle: 'Klar for å la kundene bestille selv?',
  ctaDescription: 'Fortell oss hvordan dere selger til bedrifter i dag, så viser vi hvordan det kan se ut på Shopify.',
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

export default async function B2bPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // Norwegian IA only; the English site has no /tjenester.
  if (language !== 'no') notFound()

  const caseText = await getPageTeaserText(caseStudy.href, language)
  const depth = servicesDepth.b2b

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero {...hero} visual={<OrderPortalMockup />} />
        <WhyShopifyWins whyShopify={included} />
        <ServiceFacts depth={depth} />
        <HowWeWork howWeWork={process} />
        <ServiceDeliverables depth={depth} />
        <ServicePrerequisites depth={depth} />
        <ServiceIntegrations depth={depth} language={language} />
        <ReadMoreSection
          eyebrow={caseStudy.eyebrow}
          title={caseText.title || caseStudy.fallbackTitle}
          description={caseText.description || caseStudy.fallbackDescription}
          href={caseStudy.href}
          linkText={caseStudy.linkText}
        />
        <ServiceFaq depth={depth} />
        <ServiceLinks depth={depth} />
        <ReadyToBuild cta={cta} />
      </main>
      <FooterWrapper />
    </div>
  )
}
