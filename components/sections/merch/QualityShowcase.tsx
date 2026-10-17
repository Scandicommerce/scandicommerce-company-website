'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/components/sections/merch/ProductCard'
import { ui } from '@/components/integrations/labels'

interface SanityProduct {
  handle?: string
  name?: string
}

interface QualityShowcaseData {
  title?: string
  description?: string
  products?: SanityProduct[]
}

interface QualityShowcaseProps {
  products?: Product[]
  qualityShowcase?: QualityShowcaseData
}

/** Four picks on hairline cards; the editor's Sanity list wins, then "featured" tags, then the first in stock. */
export default function QualityShowcase({ products = [], qualityShowcase }: QualityShowcaseProps) {
  const title = qualityShowcase?.title || 'Quality You Can Feel'
  const description = qualityShowcase?.description || 'Every piece is carefully selected for comfort, durability, and that perfect Scandinavian aesthetic.'
  const sanityProducts = qualityShowcase?.products

  // If Sanity has specific products defined, filter and order based on those handles
  let displayProducts: Product[] = []

  if (sanityProducts && sanityProducts.length > 0) {
    // Get products in the order specified by Sanity
    displayProducts = sanityProducts
      .map(sanityProduct => {
        const shopifyProduct = products.find(p => p.slug === sanityProduct.handle)
        if (shopifyProduct) {
          return {
            ...shopifyProduct,
            // Override name if provided in Sanity
            name: sanityProduct.name || shopifyProduct.name,
          }
        }
        return null
      })
      .filter((p): p is Product => p !== null && p.image !== undefined)
      .slice(0, 4)
  }

  // If no Sanity products or none found, fall back to tag-based selection
  if (displayProducts.length === 0) {
    const featuredProducts = products
      .filter(product => {
        if (!product.availableForSale || !product.image) return false

        const tags = product.tags || []
        const isFeatured = tags.some(tag =>
          tag.toLowerCase() === 'featured' ||
          tag.toLowerCase() === 'quality-showcase' ||
          tag.toLowerCase() === 'quality'
        )

        return isFeatured
      })
      .slice(0, 4)

    displayProducts = featuredProducts.length > 0
      ? featuredProducts
      : products
        .filter(product => product.availableForSale && product.image)
        .slice(0, 4)
  }

  if (displayProducts.length === 0) {
    return null
  }

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>Quality</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{description}</p>
        </div>

        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4 lg:gap-5">
          {displayProducts.map((product, index) => (
            <li key={product.id}>
              <Link
                href={`/merch/${product.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    priority={index < 4}
                    unoptimized={product.image.endsWith('.svg')}
                  />
                </div>
                <div className="flex flex-col gap-1.5 border-t border-sc-ink-100 p-4">
                  <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-sc-ink-900" title={product.name}>
                    {product.name}
                  </span>
                  <span className="font-mono text-[13px] text-sc-ink-500">
                    {product.price} {product.currency}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
