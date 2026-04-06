import { Fragment } from 'react'
import Hero from '@/components/layout/Hero'
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
          case 'merchPageHeroSection':
            return (
              <Fragment key={_key}>
                <Hero hero={rest as Parameters<typeof Hero>[0]['hero']} />
                <ProductGrid initialProducts={shopifyProducts} />
              </Fragment>
            )
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
