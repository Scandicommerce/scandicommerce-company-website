'use client'

import Link from 'next/link'
import Image from 'next/image'

interface FeaturesData {
  title?: string
  paragraphs?: string[]
  demoStore?: {
    text?: string
    url?: string
    password?: string
  }
  productImage?: {
    src?: string
    alt?: string
  }
}

interface FeaturesProps {
  features?: FeaturesData
}

const defaultParagraphs = [
  'Your customers will get an easier shopping experience with Quick Checkout for Vipps, both at product level and in the cart.',
  'The integration is fully integrated with Shopify\'s backend, and supports capture, refund and cancel.',
  'Automatically integrated with your shipping options, also supports discount codes, different VAT rates and tracking of purchase events.',
  'Easily add quick checkout buttons to cart and product page yourself with visual theme editor in Shopify. There you can change both color, shape and placement.'
]

export default function Features({ features }: FeaturesProps) {
  const title = features?.title || 'Accept payments with Quick Checkout for Vipps in your online store'
  const paragraphs = features?.paragraphs && features.paragraphs.length > 0 ? features.paragraphs : defaultParagraphs
  const demoStore = features?.demoStore || {
    text: 'Check out our demo store here:',
    url: 'https://scandicommerce-demo.myshopify.com/',
    password: 'demo123'
  }
  const productImage = features?.productImage || {
    src: '/images/shopify/vipps_hurtigkasse/product_details.png',
    alt: 'Vipps Quick Checkout on product page'
  }

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] text-center mb-8 lg:mb-12">
            {title}
          </h2>

          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base lg:text-lg text-[#565454] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Product Details Image */}
          {productImage.src && (
            <div className="mt-10 lg:mt-14">
              <div className="relative w-full overflow-hidden shadow-lg border border-gray-200">
                <Image
                  src={productImage.src}
                  alt={productImage.alt || 'Vipps Hurtigkasse demo'}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          {demoStore.url && (
            <div className="mt-10 p-6 lg:p-8 bg-[#1DEFFA15] border-l-4 border-[#03C1CA]">
              <p className="text-base lg:text-lg text-[#222222] font-medium mb-2">
                {demoStore.text}
              </p>
              <Link
                href={demoStore.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#03C1CA] hover:underline font-medium break-all"
              >
                {demoStore.url}
              </Link>
              {demoStore.password && (
                <p className="text-sm text-[#565454] mt-2">
                  Password: <span className="font-mono bg-gray-100 px-2 py-1">{demoStore.password}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
