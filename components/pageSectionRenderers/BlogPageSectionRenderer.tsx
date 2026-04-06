import Hero from '@/components/layout/Hero'
import FeaturedArticle from '@/components/sections/resources/FeaturedArticle'
import ArticlesGrid from '@/components/sections/resources/ArticlesGrid'
import GetShopifyInsitesDelivered from '@/components/sections/resources/GetShopifyInsitesDelivered'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function BlogPageSectionRenderer({
  sections,
  lang,
}: {
  sections: SanitySectionItem[]
  lang: string
}) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'blogPageHeroSection': {
            const hero = rest as Parameters<typeof Hero>[0]['hero'] & { searchPlaceholder?: string }
            return (
              <Hero
                key={_key}
                hero={{ ...hero, searchPlaceholder: hero.searchPlaceholder ?? 'Search for a package' }}
                searchable={true}
              />
            )
          }
          case 'blogPageFeaturedArticleSection':
            return (
              <FeaturedArticle
                key={_key}
                featuredArticle={rest as Parameters<typeof FeaturedArticle>[0]['featuredArticle']}
                lang={lang}
              />
            )
          case 'blogPageArticlesGridSection':
            return (
              <ArticlesGrid key={_key} articlesGrid={rest as Parameters<typeof ArticlesGrid>[0]['articlesGrid']} lang={lang} />
            )
          case 'blogPageNewsletterCtaSection':
            return (
              <GetShopifyInsitesDelivered
                key={_key}
                newsletterCta={rest as Parameters<typeof GetShopifyInsitesDelivered>[0]['newsletterCta']}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
