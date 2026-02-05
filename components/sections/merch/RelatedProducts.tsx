'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

interface RelatedProduct {
  id: string
  name: string
  price: number
  currency: string
  image: string
  slug: string
}

interface RelatedProductsSettingsData {
  title?: string
}

interface RelatedProductsProps {
  products?: RelatedProduct[]
  relatedProductsSettings?: RelatedProductsSettingsData
}

export default function RelatedProducts({
  products = [],
  relatedProductsSettings,
}: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const title = relatedProductsSettings?.title || 'You Might Also Like'

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      window.addEventListener('resize', checkScrollability)
      return () => {
        container.removeEventListener('scroll', checkScrollability)
        window.removeEventListener('resize', checkScrollability)
      }
    }
  }, [products])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const firstChild = container.firstElementChild as HTMLElement

      if (firstChild) {
        const cardWidth = firstChild.offsetWidth
        const gap = 16
        const scrollAmount = cardWidth + gap

        const targetScroll = direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount

        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth',
        })
      }
    }
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-12 lg:py-20">
      <div className="section_container mx-auto page-padding-x">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#222222] text-center mb-10 lg:mb-12">
          {title}
        </h2>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
              aria-label="Previous products"
            >
              <HiChevronLeft className="w-6 h-6 text-[#222222]" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          >
            {products.map(product => (
              <Link
                key={product.id}
                href={`/merch/${product.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg flex-shrink-0 snap-start w-[280px] sm:w-[300px] lg:w-[320px]"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={product.image?.endsWith('.svg')}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {product.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-black/50 backdrop-blur-sm rounded text-sm text-white font-mono">
                    {Math.round(product.price)} {product.currency}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
              aria-label="Next products"
            >
              <HiChevronRight className="w-6 h-6 text-[#222222]" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
