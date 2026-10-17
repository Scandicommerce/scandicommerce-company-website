import type { Metadata } from 'next'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ServiceHero from '@/components/sections/services/ServiceHero'
import OrderPortalMockup from '@/components/sections/services/visuals/OrderPortalMockup'
import WhyShopifyWins from '@/components/sections/services/shopify_development/WhyShopifyWins'
import HowWeWork from '@/components/sections/services/shopify_development/HowWeWork'
import ReadyToBuild from '@/components/sections/services/shopify_development/ReadyToBuild'
import ReadMoreSection from '@/components/sections/services/ReadMoreSection'
import { ServiceDeliverables, ServiceFacts, ServiceFaq, ServiceIntegrations, ServiceLinks, ServicePrerequisites } from '@/components/sections/services/depth/ServiceDepth'
import { getServicesDepth, serviceLang, type ServiceLang } from '@/lib/servicesDepth'
import { getPageTeaserText } from '@/lib/pageTeaser'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'

export const B2B_PATH: Record<ServiceLang, string> = { no: 'tjenester/b2b', en: 'services/b2b' }

interface Copy {
  metaTitle: string
  metaDescription: string
  hero: {
    eyebrow: string
    title: string
    highlight: string
    description: string
    buttons: { text: string; link: string; variant: 'primary' | 'secondary' }[]
    highlights: string[]
  }
  included: {
    whyShopifyEyebrow?: string
    whyShopifyTitle: string
    whyShopifySubtitle: string
    whyShopifyFeatures: { icon: string; title: string; description: string }[]
  }
  process: {
    howWeWorkEyebrow?: string
    howWeWorkTitle: string
    howWeWorkSteps: { number: number; title: string; description: string }[]
  }
  /** Customer story shown as the read-more card; its text comes from the article's SEO fields. */
  caseStudy: { href: string; eyebrow: string; fallbackTitle: string; fallbackDescription: string; linkText: string }
  cta: { ctaTitle: string; ctaDescription: string; ctaButtonText: string; ctaButtonLink: string }
}

const COPY: Record<ServiceLang, Copy> = {
  no: {
    metaTitle: 'B2B og ordreportal på Shopify',
    metaDescription:
      'Ordreportal og B2B-handel på Shopify: egne priser per kunde, selvbetjent bestilling, kjøp på faktura og integrasjon mot ERP.',
    hero: {
      eyebrow: 'B2B og ordreportal',
      title: 'B2B-handel og ordreportal på Shopify',
      highlight: 'ordreportal',
      description:
        'La forhandlere og bedriftskunder bestille selv – med sine egne priser, betingelser og sortiment. Integrert med ERP, og gjerne i samme Shopify-butikk som forbrukersalget.',
      buttons: [
        { text: 'Book møte', link: '/kontakt', variant: 'primary' },
        { text: 'Se pakker og priser', link: '/tjenester/alle-pakker', variant: 'secondary' },
      ],
      highlights: ['Egne priser per kunde', 'Kjøp på faktura', 'Integrert med ERP'],
    },
    included: {
      whyShopifyTitle: 'Det en ordreportal må kunne',
      whyShopifySubtitle: 'Alt kundene dine trenger for å bestille selv, og alt dere trenger for å slippe manuelle ordre.',
      whyShopifyFeatures: [
        { icon: 'cart', title: 'Egne priser per kunde', description: 'Prislister, rabatter og volumpriser per kunde eller kundegruppe, og et sortiment tilpasset hver avtale.' },
        { icon: 'chart', title: 'Selvbetjent bestilling', description: 'Kundene logger inn, ser lagerstatus og bestiller eller gjenbestiller selv, når det passer dem.' },
        { icon: 'shield', title: 'Faktura og betingelser', description: 'Kjøp på faktura med betalingsbetingelser per kunde, i tillegg til kort og Vipps.' },
        { icon: 'uptime', title: 'Integrert med ERP', description: 'Ordre, kunder, priser og lager synkroniseres med ERP-systemet, for eksempel Tripletex eller 24SevenOffice.' },
      ],
    },
    process: {
      howWeWorkTitle: 'Slik jobber vi',
      howWeWorkSteps: [
        { number: 0, title: 'Kartlegging', description: 'Kundegrupper, prismodeller, betingelser og hvilke systemer som må snakke sammen.' },
        { number: 1, title: 'Oppsett', description: 'Bedriftskunder, prislister og sortiment satt opp i Shopify.' },
        { number: 2, title: 'Integrasjon', description: 'Kobling mot ERP og lager, så ordre og priser alltid stemmer.' },
        { number: 3, title: 'Lansering', description: 'Vi går live og hjelper deg med å få forhandlerne over i portalen.' },
      ],
    },
    caseStudy: {
      href: '/blogg/fra-24nettbutikk-til-effektiv-b2b-drift-pa-shopify',
      eyebrow: 'Kundecase',
      fallbackTitle: 'Fra 24Nettbutikk til effektiv B2B-drift på Shopify',
      fallbackDescription: 'Hvordan vi flyttet en norsk B2B-virksomhet til Shopify Plus, med Tripletex-integrasjon og prisroller.',
      linkText: 'Les caset',
    },
    cta: {
      ctaTitle: 'Klar for å la kundene bestille selv?',
      ctaDescription: 'Fortell oss hvordan dere selger til bedrifter i dag, så viser vi hvordan det kan se ut på Shopify.',
      ctaButtonText: 'Book møte',
      ctaButtonLink: '/kontakt',
    },
  },
  en: {
    metaTitle: 'B2B and order portal on Shopify',
    metaDescription:
      'An order portal and B2B commerce on Shopify: customer-specific prices, self-service ordering, buying on invoice and ERP integration.',
    hero: {
      eyebrow: 'B2B and order portal',
      title: 'B2B commerce and an order portal on Shopify',
      highlight: 'order portal',
      description:
        'Let resellers and business customers order on their own – with their own prices, terms and assortment. Integrated with your ERP, and ideally in the same Shopify store as your consumer sales.',
      buttons: [
        { text: 'Book a meeting', link: '/contact', variant: 'primary' },
        { text: 'See packages and pricing', link: '/services/all-packages', variant: 'secondary' },
      ],
      highlights: ['Customer-specific prices', 'Buy on invoice', 'Integrated with ERP'],
    },
    included: {
      whyShopifyEyebrow: 'What you get',
      whyShopifyTitle: 'What an order portal has to do',
      whyShopifySubtitle: 'Everything your customers need to order on their own, and everything you need to stop handling orders manually.',
      whyShopifyFeatures: [
        { icon: 'cart', title: 'Customer-specific prices', description: 'Price lists, discounts and volume pricing per customer or customer group, and an assortment tailored to each agreement.' },
        { icon: 'chart', title: 'Self-service ordering', description: 'Customers log in, see stock levels and order or reorder on their own, whenever it suits them.' },
        { icon: 'shield', title: 'Invoice and terms', description: 'Buy on invoice with payment terms per customer, alongside card and Vipps.' },
        { icon: 'uptime', title: 'Integrated with ERP', description: 'Orders, customers, prices and stock are synced with your ERP, for example Tripletex or 24SevenOffice.' },
      ],
    },
    process: {
      howWeWorkEyebrow: 'Process',
      howWeWorkTitle: 'How we work',
      howWeWorkSteps: [
        { number: 0, title: 'Discovery', description: 'Customer groups, pricing models, terms and which systems need to talk to each other.' },
        { number: 1, title: 'Setup', description: 'Company accounts, price lists and assortment set up in Shopify.' },
        { number: 2, title: 'Integration', description: 'Connection to ERP and inventory, so orders and prices are always right.' },
        { number: 3, title: 'Launch', description: 'We go live and help you move your resellers into the portal.' },
      ],
    },
    caseStudy: {
      href: '/blog/from-24nettbutikk-to-efficient-b2b-operations-on-shopify',
      eyebrow: 'Case study',
      fallbackTitle: 'From 24Nettbutikk to efficient B2B operations on Shopify',
      fallbackDescription: 'How we moved a Norwegian B2B business to Shopify Plus, with a Tripletex integration and price roles.',
      linkText: 'Read the case',
    },
    cta: {
      ctaTitle: 'Ready to let your customers order on their own?',
      ctaDescription: 'Tell us how you sell to businesses today, and we will show you what it could look like on Shopify.',
      ctaButtonText: 'Book a meeting',
      ctaButtonLink: '/contact',
    },
  },
}

export async function b2bMetadata(language: string): Promise<Metadata> {
  const l = serviceLang(language)
  const copy = COPY[l]
  const settings = await getSiteSettings(language)
  const seo = coalescePageSeo(null, settings)
  seo.metaTitle = copy.metaTitle
  seo.metaDescription = copy.metaDescription
  seo.ogTitle = copy.metaTitle
  seo.ogDescription = copy.metaDescription
  return buildMetadata({ seo, settings, language, pathWithoutLang: B2B_PATH[l] })
}

export default async function B2bPage({ language }: { language: string }) {
  const copy = COPY[serviceLang(language)]
  const { hero, included, process, caseStudy, cta } = copy
  const caseText = await getPageTeaserText(caseStudy.href, language)
  const depth = getServicesDepth('b2b', language)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero {...hero} visual={<OrderPortalMockup />} />
        <WhyShopifyWins whyShopify={included} />
        <ServiceFacts depth={depth} />
        <HowWeWork howWeWork={process} />
        <ServiceDeliverables depth={depth} language={language} />
        <ServicePrerequisites depth={depth} language={language} />
        <ServiceIntegrations depth={depth} language={language} />
        <ReadMoreSection
          eyebrow={caseStudy.eyebrow}
          title={caseText.title || caseStudy.fallbackTitle}
          description={caseText.description || caseStudy.fallbackDescription}
          href={caseStudy.href}
          linkText={caseStudy.linkText}
        />
        <ServiceFaq depth={depth} />
        <ServiceLinks depth={depth} language={language} />
        <ReadyToBuild cta={cta} />
      </main>
      <FooterWrapper />
    </div>
  )
}
