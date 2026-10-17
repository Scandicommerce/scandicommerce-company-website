import type { Metadata } from 'next'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ServiceHero from '@/components/sections/services/ServiceHero'
import MigrationMockup from '@/components/sections/services/visuals/MigrationMockup'
import { MigratePageSectionRenderer } from '@/components/pageSectionRenderers/MigratePageSectionRenderer'
import { ServiceDeliverables, ServiceFacts, ServiceFaq, ServiceIntegrations, ServiceLinks, ServicePrerequisites } from '@/components/sections/services/depth/ServiceDepth'
import { getServicesDepth, serviceLang, type ServiceLang } from '@/lib/servicesDepth'
import { coalescePageSeo, getPageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import { client } from '@/sanity/lib/client'
import { migratePageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'

export const MIGRATION_PATH: Record<ServiceLang, string> = { no: 'tjenester/migrering', en: 'services/migrate', sv: 'services/migrate', da: 'services/migrate', de: 'services/migrate' }

/**
 * The content lives in the `migratePage` document per language. The Norwegian
 * document's Sanity slug is still the old URL; changing it to
 * `tjenester/migrering` in Studio is the last step of the move. The page loads
 * the document by type, so it keeps working before and after.
 */
const SANITY_SLUG: Record<ServiceLang, string> = { no: 'tjenester/shopify-migrering', en: 'services/migrate', sv: 'services/migrate', da: 'services/migrate', de: 'services/migrate' }

interface Copy {
  eyebrow: string
  fallbackTitle: string
  fallbackHighlight: string
  highlights: string[]
}

const COPY: Record<ServiceLang, Copy> = {
  no: {
    eyebrow: 'Migrering til Shopify',
    fallbackTitle: 'Bytt til Shopify uten risiko',
    fallbackHighlight: 'Shopify',
    highlights: ['SEO-rangeringer bevart', 'Null nedetid', 'Over 50 migreringer'],
  },
  en: {
    eyebrow: 'Migration to Shopify',
    fallbackTitle: 'Move to Shopify without the risk',
    fallbackHighlight: 'Shopify',
    highlights: ['SEO rankings preserved', 'Zero downtime', 'Over 50 migrations'],
  },
  sv: {
    eyebrow: 'Migrering till Shopify',
    fallbackTitle: 'Flytta till Shopify utan risk',
    fallbackHighlight: 'Shopify',
    highlights: ['SEO-rankingar bevarade', 'Noll driftstopp', 'Över 50 migreringar'],
  },
  da: {
    eyebrow: 'Migrering til Shopify',
    fallbackTitle: 'Flyt til Shopify uden risiko',
    fallbackHighlight: 'Shopify',
    highlights: ['SEO-placeringer bevaret', 'Ingen nedetid', 'Over 50 migreringer'],
  },
  de: {
    eyebrow: 'Migration zu Shopify',
    fallbackTitle: 'Ohne Risiko zu Shopify wechseln',
    fallbackHighlight: 'Shopify',
    highlights: ['SEO-Rankings erhalten', 'Keine Ausfallzeit', 'Über 50 Migrationen'],
  },
}

interface MigratePageData {
  _id: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
}

interface HeroSection {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
  heroButtons?: Array<{ text: string; link: string }>
}

interface PlatformsSection {
  platformsItems?: Array<{ name?: string }>
}

async function fetchSections(language: string) {
  const pageData = await client
    .fetch<MigratePageData | null>(migratePageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)
  return normalizePageSections('migratePage', pageData)
}

/** Sections for the page language; a language without its own document renders the English one. */
async function loadSections(language: string) {
  const sections = await fetchSections(language)
  if (sections.length > 0 || language === 'no' || language === 'en') return sections
  return fetchSections('en')
}

export async function migrationMetadata(language: string): Promise<Metadata> {
  const l = serviceLang(language)
  const [doc, settings] = await Promise.all([
    getPageSeo({ type: 'migratePage', slug: SANITY_SLUG[l], language }),
    getSiteSettings(language),
  ])
  const seo = coalescePageSeo(doc, settings)
  // Canonical is the new URL, not the document's (old) slug.
  seo.docSlug = undefined
  seo.canonical = undefined
  return buildMetadata({ seo, settings, language, pathWithoutLang: MIGRATION_PATH[l] })
}

export default async function MigrationPage({ language }: { language: string }) {
  const copy = COPY[serviceLang(language)]
  const sections = await loadSections(language)

  const heroSection = sections.find((s) => s._type === 'migratePageHeroSection') as HeroSection | undefined
  const platforms = sections.find((s) => s._type === 'migratePagePlatformsSection') as PlatformsSection | undefined
  const fromPlatforms = platforms?.platformsItems?.map((p) => p.name).filter((n): n is string => Boolean(n))
  const depth = getServicesDepth('migrering', language)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero
          eyebrow={copy.eyebrow}
          title={heroSection?.heroTitle?.text || copy.fallbackTitle}
          highlight={heroSection?.heroTitle?.highlight || copy.fallbackHighlight}
          description={heroSection?.heroDescription}
          buttons={heroSection?.heroButtons?.map((b, i) => ({
            text: b.text,
            link: b.link,
            variant: i === 0 ? ('primary' as const) : ('secondary' as const),
          }))}
          highlights={copy.highlights}
          visual={<MigrationMockup fromPlatforms={fromPlatforms} />}
        />
        <ServiceFacts depth={depth} />
        <MigratePageSectionRenderer lang={language} sections={sections.filter((s) => s._type !== 'migratePageHeroSection' && s._type !== 'migratePageCtaSection')} />
        <ServiceDeliverables depth={depth} language={language} />
        <ServicePrerequisites depth={depth} language={language} />
        <ServiceIntegrations depth={depth} language={language} />
        <ServiceFaq depth={depth} />
        <ServiceLinks depth={depth} language={language} />
        <MigratePageSectionRenderer lang={language} sections={sections.filter((s) => s._type === 'migratePageCtaSection')} />
      </main>
      <FooterWrapper />
    </div>
  )
}
