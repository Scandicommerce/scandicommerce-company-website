import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import Platforms from '@/components/sections/services/migrate/Platforms'
import RisksAndProtection from '@/components/sections/services/migrate/RisksAndProtection'
import MigrationProcess from '@/components/sections/services/migrate/MigrationProcess'
import RealMigrationResults from '@/components/sections/services/migrate/RealMigrationResults'
import MigrationCTA from '@/components/sections/services/migrate/MigrationCTA'
import { client } from '@/sanity/lib/client'
import { migratePageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import Hero from '@/components/layout/Hero'
import { Button } from '@/components/ui'

interface MigratePageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: { text?: string; highlight?: string }
    heroDescription?: string
    heroButtons?: Array<{ text: string; link: string; variant?: string }>
  }
  platforms?: { platformsTitle?: string; platformsItems?: Array<{ name: string; duration: string }> }
  risksProtection?: { risksTitle?: string; risksItems?: Array<{ text: string }>; protectionTitle?: string; protectionItems?: Array<{ title: string; description: string }> }
  process?: { processTitle?: string; processSubtitle?: string; processPhases?: Array<{ week: string; title: string; activities: string[] }> }
  results?: { resultsTitle?: string; resultsItems?: Array<{ metric: string; title: string; description: string }> }
  cta?: { ctaTitle?: string; ctaDescription?: string; ctaButtonText?: string; ctaButtonLink?: string }
}

export default async function MigratePage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client.fetch<MigratePageData | null>(migratePageQuery, getQueryParams({}, language), { next: { revalidate: 0 } }).catch(() => null)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero}>
          <div className="grid sm:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
            {pageData?.hero?.heroButtons?.map((button, index) => (
              <Button key={index} type={button.variant === 'primary' ? 'primary' : 'default'} href={button.link}>
                {button.text}
              </Button>
            ))}
          </div>
        </Hero>
        <Platforms platforms={pageData?.platforms} />
        <RisksAndProtection risksProtection={pageData?.risksProtection} />
        <MigrationProcess process={pageData?.process} />
        <RealMigrationResults results={pageData?.results} />
        <MigrationCTA cta={pageData?.cta} />
        <FooterWrapper />
      </main>
    </div>
  )
}
