'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/components/sections/merch/ProductCard'

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
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#222222] mb-4">
            {title}
          </h2>
          <p className="text-base lg:text-lg text-[#666666] max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/merch/${product.slug}`}
              className="group relative bg-white rounded-lg overflow-hidden aspect-square block"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                priority={index < 4}
                unoptimized={product.image.endsWith('.svg')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 px-4">
                <div className="w-full text-center">
                  <span
                    className="text-white font-medium text-sm block line-clamp-2 leading-tight"
                    title={product.name}
                  >
                    {product.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
