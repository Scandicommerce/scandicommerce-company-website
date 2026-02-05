'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { Image as SanityImage } from 'sanity'

interface OurStoryData {
  title?: string
  description?: string
  imageUrl?: string
  image?: SanityImage
  imageAlt?: string
}

interface OurStoryProps {
  ourStory?: OurStoryData
}

export default function OurStory({ ourStory }: OurStoryProps) {
  const title = ourStory?.title || 'Our story'
  const description = ourStory?.description || "We started ScandiCommerce in 2018 after years of frustration with traditional agency models. Too many proposals, unclear pricing, and scope creep were the norm. We asked ourselves: What if buying agency services felt like buying products? Clear features, transparent pricing, and no BS. Today, we're Norway's most transparent Shopify agency. Our clients know exactly what they're getting, what it costs, and when it will be delivered. No surprises, just results."
  const imageUrl = ourStory?.image
    ? urlFor(ourStory.image).url()
    : ourStory?.imageUrl || '/images/about/story/banner.png'
  const imageAlt = ourStory?.imageAlt || 'ScandiCommerce office space'

  return (
    <section className="py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="bg-[#F5F5F5] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="p-4 sm:p-8 lg:p-12">
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-6 lg:mb-8">
              {title}
            </h2>
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#555555] leading-relaxed">
              {description}
            </p>
          </div>

          {/* Right Column - Image */}
          <div className="relative w-full h-[400px] lg:h-[550px]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
