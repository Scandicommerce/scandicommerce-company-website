'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { HiMinus, HiPlus, HiCheck, HiStar } from 'react-icons/hi2'
import AddToCartDropdown from './AddToCartDropdown'
import { ui } from '@/components/integrations/labels'

interface Variant {
  id: string
  title: string
  price: number
  currencyCode: string
  availableForSale: boolean
}

interface ProductHeroProps {
  product: {
    name: string
    subtitle: string
    price: number
    currency: string
    description: string
    images: string[]
    rating: number
    reviewCount: number
    isNewArrival?: boolean
    variants?: Variant[]
    productId?: string
  }
}

const badges = [
  { icon: HiCheck, text: 'Free Shipping' },
  { icon: HiCheck, text: '30-Day Returns' },
  { icon: HiCheck, text: 'Secure Checkout' },
]

/** Product hero on the service-hero surface: gallery in a hairline panel left, buy column right. */
export default function ProductHero({ product }: ProductHeroProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const handleVariantSelect = useCallback((variant: Variant | null) => {
    setSelectedVariant(variant)
  }, [])

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const nameParts = product.name.split(' ')
  const highlightPart = nameParts.slice(0, 2).join(' ')
  const restPart = nameParts.slice(2).join(' ')

  return (
    <section className="bg-white">
      <div className={`${ui.container} grid grid-cols-1 gap-10 pb-14 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-14`}>
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
              unoptimized={product.images[activeImage].endsWith('.svg')}
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-white transition-colors ${
                    activeImage === index ? 'border-sc-ink-900' : 'border-sc-ink-200 hover:border-sc-ink-400'
                  }`}
                  aria-label={`${product.name} view ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    unoptimized={image.endsWith('.svg')}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={ui.eyebrow}>Merch</span>
            {product.isNewArrival && <span className={ui.tag}>New arrival</span>}
          </div>

          <h1 className="mb-2 text-[32px] font-bold leading-[1.05] tracking-[-0.025em] text-sc-ink-900 sm:text-[40px] lg:text-[48px]">
            <span className="text-sc-cyan-500">{highlightPart}</span>
            {restPart && ` ${restPart}`}
          </h1>

          {product.subtitle && <p className="m-0 mb-5 text-sm text-sc-ink-500">{product.subtitle}</p>}

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="font-mono text-[28px] font-medium leading-none tracking-tight text-sc-ink-900">
              {selectedVariant ? selectedVariant.price : product.price} {selectedVariant ? selectedVariant.currencyCode : product.currency}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className={`h-4 w-4 ${i < product.rating ? 'text-sc-ink-900' : 'text-sc-ink-200'}`} />
                ))}
              </div>
              <span className="text-sm text-sc-ink-500">({product.reviewCount} reviews)</span>
            </div>
          </div>

          {product.description && <p className="m-0 mb-8 text-base leading-relaxed text-sc-ink-600">{product.description}</p>}

          {/* Quantity Selector */}
          <div className="mb-5">
            <span className="mb-2 block text-sm font-semibold text-sc-ink-900">Quantity</span>
            <div className="inline-flex items-center overflow-hidden rounded-lg border border-sc-ink-300">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="flex h-11 w-11 items-center justify-center text-sc-ink-900 transition-colors hover:bg-sc-ink-50"
                aria-label="Decrease quantity"
              >
                <HiMinus className="h-4 w-4" />
              </button>
              <div className="flex h-11 w-16 items-center justify-center border-x border-sc-ink-300 font-mono text-[15px] text-sc-ink-900">
                {quantity}
              </div>
              <button
                onClick={() => handleQuantityChange(1)}
                className="flex h-11 w-11 items-center justify-center text-sc-ink-900 transition-colors hover:bg-sc-ink-50"
                aria-label="Increase quantity"
              >
                <HiPlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Dropdown with Variant Selection */}
          <div className="mb-8">
            <AddToCartDropdown
              variants={product.variants || []}
              productTitle={product.name}
              quantity={quantity}
              onVariantSelect={handleVariantSelect}
            />
          </div>

          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 border-t border-sc-ink-200 p-0 pt-6 text-sm text-sc-ink-600">
            {badges.map((badge, index) => (
              <li key={index} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sc-cyan-500" />
                {badge.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
