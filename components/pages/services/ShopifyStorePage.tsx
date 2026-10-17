import type { Metadata } from 'next'
import Image from 'next/image'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ServiceHero from '@/components/sections/services/ServiceHero'
import StorefrontMockup from '@/components/sections/services/visuals/StorefrontMockup'
import WhyShopifyWins from '@/components/sections/services/shopify_development/WhyShopifyWins'
import HowWeWork from '@/components/sections/services/shopify_development/HowWeWork'
import ReadyToBuild from '@/components/sections/services/shopify_development/ReadyToBuild'
import ReadMoreSection from '@/components/sections/services/ReadMoreSection'
import { ServiceDeliverables, ServiceFacts, ServiceFaq, ServiceIntegrations, ServiceLinks, ServicePrerequisites } from '@/components/sections/services/depth/ServiceDepth'
import { getServicesDepth, serviceLang, type ServiceLang } from '@/lib/servicesDepth'
import { getPageTeaserText } from '@/lib/pageTeaser'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'

export const SHOPIFY_STORE_PATH: Record<ServiceLang, string> = { no: 'tjenester/shopify', en: 'services/shopify' }

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
  /**
   * "Read more about the platform" slot. Points at the Shopify platform page;
   * when that page moves (e.g. under Integrasjoner or Partnere), change `href`
   * here. The description comes from that page's SEO description in Sanity,
   * with `fallbackDescription` used until it has one.
   */
  platform: { href: string; eyebrow: string; title: string; fallbackDescription: string; linkText: string }
  cta: { ctaTitle: string; ctaDescription: string; ctaButtonText: string; ctaButtonLink: string }
}

// Positioning: a new store on Shopify / Shopify Plus, built and launched at a
// fixed price. Custom apps and integrations belong on the development page, so
// keep this page about the store itself.
const COPY: Record<ServiceLang, Copy> = {
  no: {
    metaTitle: 'Ny nettbutikk på Shopify og Shopify Plus',
    metaDescription:
      'Vi bygger og lanserer nettbutikken din på Shopify eller Shopify Plus – fra design og oppsett til lansering, med fast pris og tydelig omfang.',
    hero: {
      eyebrow: 'Shopify & nettbutikk',
      title: 'Ny nettbutikk på Shopify',
      highlight: 'Shopify',
      description:
        'Vi designer, bygger og lanserer nettbutikken din på Shopify eller Shopify Plus. Fast pris, tydelig omfang og en butikk du kan drive selv fra dag én.',
      buttons: [
        { text: 'Book møte', link: '/kontakt', variant: 'primary' },
        { text: 'Se pakker og priser', link: '/tjenester/alle-pakker', variant: 'secondary' },
      ],
      highlights: ['Shopify Plus-partner', 'Fast pris', 'Over 50 norske merkevarer'],
    },
    included: {
      whyShopifyTitle: 'Dette får du',
      whyShopifySubtitle: 'Alt som skal til for å gå live, uten overraskelser underveis.',
      whyShopifyFeatures: [
        { icon: 'cart', title: 'Design og tema', description: 'Et tema tilpasset merkevaren din, optimalisert for mobil og for å konvertere besøkende til kunder.' },
        { icon: 'chart', title: 'Oppsett og innhold', description: 'Produkter, kategorier, frakt, betaling og Vipps satt opp riktig fra start.' },
        { icon: 'uptime', title: 'Lansering', description: 'Testing, domene og go-live, med oss på vakt de første dagene etter lansering.' },
        { icon: 'shield', title: 'Opplæring', description: 'Teamet ditt lærer å drive butikken selv, så dere ikke er avhengige av oss for hver endring.' },
      ],
    },
    process: {
      howWeWorkTitle: 'Slik jobber vi',
      howWeWorkSteps: [
        { number: 0, title: 'Kartlegging', description: 'Vi går gjennom mål, sortiment og hva butikken må kunne.' },
        { number: 1, title: 'Design', description: 'Vi tilpasser temaet til merkevaren din og godkjenner det med deg.' },
        { number: 2, title: 'Bygging', description: 'Vi setter opp butikken, innholdet og integrasjonene.' },
        { number: 3, title: 'Lansering', description: 'Vi tester, går live og følger opp de første ukene.' },
      ],
    },
    platform: {
      href: '/shopify/shopify-plattformen',
      eyebrow: 'Om plattformen',
      title: 'Les mer om Shopify-plattformen',
      fallbackDescription: 'Hvorfor Shopify og Shopify Plus er markedsledende innen netthandel, og hva plattformen gir deg ut av boksen.',
      linkText: 'Les om Shopify',
    },
    cta: {
      ctaTitle: 'Klar for en ny nettbutikk?',
      ctaDescription: 'Fortell oss hva du selger og hvor du vil, så foreslår vi riktig pakke og en realistisk tidsplan.',
      ctaButtonText: 'Book møte',
      ctaButtonLink: '/kontakt',
    },
  },
  en: {
    metaTitle: 'New online store on Shopify and Shopify Plus',
    metaDescription:
      'We build and launch your online store on Shopify or Shopify Plus – from design and setup to launch, at a fixed price with a clear scope.',
    hero: {
      eyebrow: 'Shopify & online store',
      title: 'A new online store on Shopify',
      highlight: 'Shopify',
      description:
        'We design, build and launch your online store on Shopify or Shopify Plus. Fixed price, clear scope, and a store you can run yourself from day one.',
      buttons: [
        { text: 'Book a meeting', link: '/contact', variant: 'primary' },
        { text: 'See packages and pricing', link: '/services/all-packages', variant: 'secondary' },
      ],
      highlights: ['Shopify Plus partner', 'Fixed price', 'Over 50 Nordic brands'],
    },
    included: {
      whyShopifyEyebrow: 'What you get',
      whyShopifyTitle: 'What you get',
      whyShopifySubtitle: 'Everything it takes to go live, with no surprises along the way.',
      whyShopifyFeatures: [
        { icon: 'cart', title: 'Design and theme', description: 'A theme adapted to your brand, optimised for mobile and for turning visitors into customers.' },
        { icon: 'chart', title: 'Setup and content', description: 'Products, collections, shipping, payments and Vipps set up correctly from the start.' },
        { icon: 'uptime', title: 'Launch', description: 'Testing, domain and go-live, with us on watch for the first days after launch.' },
        { icon: 'shield', title: 'Training', description: 'Your team learns to run the store themselves, so you do not depend on us for every change.' },
      ],
    },
    process: {
      howWeWorkEyebrow: 'Process',
      howWeWorkTitle: 'How we work',
      howWeWorkSteps: [
        { number: 0, title: 'Discovery', description: 'We go through your goals, your catalogue and what the store needs to do.' },
        { number: 1, title: 'Design', description: 'We adapt the theme to your brand and sign it off with you.' },
        { number: 2, title: 'Build', description: 'We set up the store, the content and the integrations.' },
        { number: 3, title: 'Launch', description: 'We test, go live and follow up during the first weeks.' },
      ],
    },
    platform: {
      href: '/shopify/shopify-platform',
      eyebrow: 'About the platform',
      title: 'Read more about the Shopify platform',
      fallbackDescription: 'Why Shopify and Shopify Plus lead the market in e-commerce, and what the platform gives you out of the box.',
      linkText: 'Read about Shopify',
    },
    cta: {
      ctaTitle: 'Ready for a new online store?',
      ctaDescription: 'Tell us what you sell and where you want to go, and we will suggest the right package and a realistic timeline.',
      ctaButtonText: 'Book a meeting',
      ctaButtonLink: '/contact',
    },
  },
}

export async function shopifyStoreMetadata(language: string): Promise<Metadata> {
  const l = serviceLang(language)
  const copy = COPY[l]
  const settings = await getSiteSettings(language)
  const seo = coalescePageSeo(null, settings)
  seo.metaTitle = copy.metaTitle
  seo.metaDescription = copy.metaDescription
  seo.ogTitle = copy.metaTitle
  seo.ogDescription = copy.metaDescription
  return buildMetadata({ seo, settings, language, pathWithoutLang: SHOPIFY_STORE_PATH[l] })
}

export default async function ShopifyStorePage({ language }: { language: string }) {
  const copy = COPY[serviceLang(language)]
  const { hero, included, process, platform, cta } = copy
  const platformText = await getPageTeaserText(platform.href, language)
  const depth = getServicesDepth('shopify', language)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero {...hero} visual={<StorefrontMockup />} />
        <WhyShopifyWins whyShopify={included} />
        <ServiceFacts depth={depth} />
        <HowWeWork howWeWork={process} />
        <ServiceDeliverables depth={depth} language={language} />
        <ServicePrerequisites depth={depth} language={language} />
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
        <ServiceLinks depth={depth} language={language} />
        <ReadyToBuild cta={cta} />
      </main>
      <FooterWrapper />
    </div>
  )
}
