'use client'

import Image from 'next/image'

interface OurStoryData {
  title?: string
  description?: string
  imageUrl?: string
  imageAlt?: string
}

interface OurStoryProps {
  ourStory?: OurStoryData
}

export default function OurStory({ ourStory }: OurStoryProps) {
  const title = ourStory?.title || 'Our story'
  const description = ourStory?.description || "We started ScandiCommerce in 2018 after years of frustration with traditional agency models. Too many proposals, unclear pricing, and scope creep were the norm. We asked ourselves: What if buying agency services felt like buying products? Clear features, transparent pricing, and no BS. Today, we're Norway's most transparent Shopify agency. Our clients know exactly what they're getting, what it costs, and when it will be delivered. No surprises, just results."
  const imageUrl = ourStory?.imageUrl || '/images/about/story/banner.png'
  const imageAlt = ourStory?.imageAlt || 'ScandiCommerce office space'

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5F5F5] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="p-4 sm:p-8 lg:p-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#222222] mb-6 lg:mb-8">
              {title}
            </h2>
            <p className="text-xs sm:text-base lg:text-lg xl:text-2xl text-[#555555] leading-relaxed">
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
