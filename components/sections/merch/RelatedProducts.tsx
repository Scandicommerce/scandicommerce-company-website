'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { ui } from '@/components/integrations/labels'

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

/** Related products as a scroll row of hairline cards with arrow controls in the section head. */
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

  const arrowClass =
    'flex h-10 w-10 items-center justify-center rounded-full border border-sc-ink-300 text-sc-ink-900 transition-colors hover:bg-sc-ink-50 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-8`}>
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>More merch</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll('left')} disabled={!canScrollLeft} className={arrowClass} aria-label="Previous products">
              <HiChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll('right')} disabled={!canScrollRight} className={arrowClass} aria-label="Next products">
              <HiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1"
        >
          {products.map(product => (
            <Link
              key={product.id}
              href={`/merch/${product.slug}`}
              className="group flex w-[240px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white transition-transform hover:-translate-y-1 sm:w-[260px]"
            >
              <div className="relative aspect-[3/4] bg-sc-ink-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  sizes="260px"
                  unoptimized={product.image?.endsWith('.svg')}
                />
              </div>
              <div className="flex flex-col gap-1.5 border-t border-sc-ink-100 p-4">
                <h3 className="m-0 line-clamp-2 text-[15px] font-semibold leading-snug text-sc-ink-900">{product.name}</h3>
                <span className="font-mono text-[13px] text-sc-ink-500">
                  {Math.round(product.price)} {product.currency}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
