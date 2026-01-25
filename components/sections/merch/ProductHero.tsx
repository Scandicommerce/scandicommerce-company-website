'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { HiMinus, HiPlus, HiCheck, HiStar } from 'react-icons/hi2'
import AddToCartDropdown from './AddToCartDropdown'

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
    <section className="bg-[#F5F5F5] py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-12">
            <div className="space-y-4">
              <div className="relative aspect-square bg-[#FFFFFF] overflow-hidden">
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  priority
                  unoptimized={product.images[activeImage].endsWith('.svg')}
                />
              </div>

              <div className="flex justify-between w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[170px] overflow-x-auto pb-2 lg:gap-0 md:gap-2 sm:gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-[80px] sm:w-[100px] md:w-[120px] lg:w-1/4 h-full flex-shrink-0 overflow-hidden border-2 transition-all ${activeImage === index
                      ? 'border-[#03C1CA]'
                      : 'border-[#E5E5E5] hover:border-[#03C1CA]/50'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-contain p-1 sm:p-2"
                      unoptimized={image.endsWith('.svg')}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              {product.isNewArrival && (
                <span className="inline-flex items-center self-start px-3 py-1 text-xs font-medium bg-[#222222] text-white mb-4">
                  New Arrival
                </span>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] mb-2">
                <span className="text-[#03C1CA]">{highlightPart}</span>{' '}
                {restPart}
              </h1>

              <p className="text-sm text-[#666666] mb-4">{product.subtitle}</p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-[#222222] font-mono tracking-tight">
                  {selectedVariant ? selectedVariant.price : product.price} {selectedVariant ? selectedVariant.currencyCode : product.currency}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`w-5 h-5 ${i < product.rating ? 'text-[#F5A623]' : 'text-[#E5E5E5]'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#666666]">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <p className="text-[#666666] leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <span className="text-sm font-medium text-[#222222] mb-3 block">Quantity</span>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-12 h-12 flex items-center justify-center border text-black border-[#E5E5E5] hover:bg-[#F8F8F8] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <HiMinus className="w-4 h-4" />
                  </button>
                  <div className="w-20 h-12 flex items-center justify-center border border-[#E5E5E5] text-[#222222] font-medium font-mono">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 flex items-center justify-center border text-black border-[#E5E5E5] hover:bg-[#F8F8F8] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <HiPlus className="w-4 h-4" />
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

              <div className="flex flex-wrap justify-between items-center gap-4 sm:gap-6 pt-6 border-t border-[#5654544D]">
                {badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center border border-[#565454]">
                      <badge.icon className="w-3 h-3 text-[#565454]" />
                    </div>
                    <span className="text-sm text-[#565454]">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
