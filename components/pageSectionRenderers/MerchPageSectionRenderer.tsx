import { Fragment } from 'react'
import ServiceHero from '@/components/sections/services/ServiceHero'
import ProductGrid from '@/components/sections/merch/ProductGrid'
import QualityShowcase from '@/components/sections/merch/QualityShowcase'
import Newsletter from '@/components/sections/merch/Newsletter'
import type { Product } from '@/components/sections/merch/ProductCard'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function MerchPageSectionRenderer({
  sections,
  shopifyProducts,
}: {
  sections: SanitySectionItem[]
  shopifyProducts: Product[]
}) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'merchPageHeroSection': {
            const hero = rest as {
              heroTitle?: { text?: string; highlight?: string }
              heroDescription?: string
            }
            return (
              <Fragment key={_key}>
                <ServiceHero eyebrow="Merch" title={hero.heroTitle?.text ?? ''} highlight={hero.heroTitle?.highlight} description={hero.heroDescription} />
                <ProductGrid initialProducts={shopifyProducts} />
              </Fragment>
            )
          }
          case 'merchPageQualityShowcaseSection':
            return (
              <QualityShowcase
                key={_key}
                products={shopifyProducts}
                qualityShowcase={rest as Parameters<typeof QualityShowcase>[0]['qualityShowcase']}
              />
            )
          case 'merchPageNewsletterSection':
            return <Newsletter key={_key} newsletter={rest as Parameters<typeof Newsletter>[0]['newsletter']} />
          default:
            return null
        }
      })}
    </>
  )
}
