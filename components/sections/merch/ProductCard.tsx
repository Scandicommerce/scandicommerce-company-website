'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'

export interface Collection {
  id: string
  title: string
  handle: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  collections: Collection[]
  slug: string
  availableForSale?: boolean
  tags?: string[]
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white border-r border-b border-[#E5E5E5] last:border-r-0">
      <Link href={`/merch/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized={product.image.endsWith('.svg')}
          />
        </div>
      </Link>
      <div className="p-5 border-t border-[#E5E5E5]">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-[#222222] leading-tight font-sans">
            {product.name}
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#222222] text-white whitespace-nowrap font-mono">
            {product.price} {product.currency}
          </span>
        </div>
        <p className="text-sm text-[#666666] mb-3 line-clamp-3">{product.description}</p>
        <Link
          href={`/merch/${product.slug}`}
          className="inline-flex items-center text-sm font-medium text-[#03C1CA] hover:text-[#02A8B0] transition-colors group/link"
        >
          View product
          <HiArrowRight className="ml-1 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
