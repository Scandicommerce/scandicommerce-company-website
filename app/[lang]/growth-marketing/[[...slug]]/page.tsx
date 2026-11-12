import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { GrowthHubPage, GrowthServicePage } from '@/components/sections/growth/GrowthPages'
import { getLanguageFromParams } from '@/lib/language'
import { findGrowthService, growthHub } from '@/lib/growthServices'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = { params: Promise<{ lang: string; slug?: string[] }> }

/**
 * Growth marketing hub and service pages (lib/growthServices.ts).
 * Norwegian only, like the IA that links here; every other language 404s.
 * `undefined` = not a growth page, `null` = the hub.
 */
function resolve(lang: string, slug?: string[]) {
  if (getLanguageFromParams({ lang }) !== 'no') return undefined
  const path = (slug ?? []).join('/').toLowerCase()
  if (!path) return null
  return findGrowthService(path)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const service = resolve(lang, slug)
  if (service === undefined) return {}
  const language = getLanguageFromParams({ lang })
  const settings = await getSiteSettings(language)
  const seo = coalescePageSeo(null, settings)
  seo.metaTitle = service ? service.title : growthHub.title
  seo.metaDescription = service ? service.lead : growthHub.lead
  // Placeholder pages: keep them out of the index until real copy is in
  seo.noIndex = true
  return buildMetadata({
    seo,
    settings,
    language,
    pathWithoutLang: ['growth-marketing', ...(service ? [service.slug] : [])].join('/'),
  })
}

export default async function GrowthMarketingPage({ params }: PageProps) {
  const { lang, slug } = await params
  const service = resolve(lang, slug)
  if (service === undefined) notFound()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        {service ? <GrowthServicePage service={service} /> : <GrowthHubPage />}
      </main>
      <FooterWrapper />
    </div>
  )
}
