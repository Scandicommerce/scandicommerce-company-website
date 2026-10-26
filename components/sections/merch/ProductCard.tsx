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

/** Product on the hairline card: image panel on ink-50, name, mono price, short description. */
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white transition-transform hover:-translate-y-1">
      <Link href={`/merch/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-sc-ink-50">
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
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="m-0 line-clamp-2 text-[17px] font-semibold leading-snug text-sc-ink-900">{product.name}</h3>
        <span className="font-mono text-[13px] text-sc-ink-900">
          {product.price} {product.currency}
        </span>
        <p className="m-0 line-clamp-3 text-[14px] leading-relaxed text-sc-ink-600">{product.description}</p>
        <Link
          href={`/merch/${product.slug}`}
          className="group/link mt-auto inline-flex items-center pt-2 text-sm font-semibold text-sc-ink-900 transition-colors hover:text-sc-cyan-600"
        >
          View product
          <HiArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
