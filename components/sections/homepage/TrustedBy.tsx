'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import Marquee from 'react-fast-marquee'

interface Brand {
  name: string
  logo?: {
    asset?: {
      url?: string
    }
    alt?: string
  }
  alt?: string
  link?: string
}

interface TrustedByData {
  title?: string
  brands?: Brand[]
}

interface TrustedByProps {
  trustedBy?: TrustedByData
}

// Default brands fallback
const defaultBrands: Brand[] = [
  { name: 'Telenor Group', logo: { asset: { url: '/images/brands/telenor.png' } }, alt: 'Telenor Group logo' },
  { name: 'Yara', logo: { asset: { url: '/images/brands/yara.png' } }, alt: 'Yara logo' },
  { name: 'Gjensidige', logo: { asset: { url: '/images/brands/gjensidige.png' } }, alt: 'Gjensidige logo' },
  { name: 'AkerBP', logo: { asset: { url: '/images/brands/akerbp.png' } }, alt: 'AkerBP logo' },
  { name: 'DNB', logo: { asset: { url: '/images/brands/dnb.png' } }, alt: 'DNB logo' },
  { name: 'SpareBank 1', logo: { asset: { url: '/images/brands/sparebank1.png' } }, alt: 'SpareBank 1 logo' },
  { name: 'KLP', logo: { asset: { url: '/images/brands/klp.png' } }, alt: 'KLP logo' },
  { name: 'Lerøy', logo: { asset: { url: '/images/brands/leroy.png' } }, alt: 'Lerøy logo' },
]

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

const scrollVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

export default function TrustedBy({ trustedBy }: TrustedByProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const title = trustedBy?.title || 'Trusted by 50+ Norwegian brands'
  const brands = trustedBy?.brands && trustedBy.brands.length > 0
    ? trustedBy.brands
    : defaultBrands

  const renderBrandLogo = (brand: Brand, index: number) => {
    const logoUrl = brand.logo?.asset?.url
    const altText = brand.alt || brand.name || 'Brand logo'

    if (!logoUrl) return null

    return (
      <div
        key={`brand-${index}`}
        className="relative flex items-center justify-center flex-shrink-0 mx-2 sm:mx-6 lg:mx-8"
      >
        {brand.link ? (
          <Link 
            href={brand.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block transition-transform hover:scale-110 duration-200"
          >
            <div className="relative h-[70px] w-auto">
              <Image
                src={logoUrl}
                alt={altText}
                width={300}
                height={150}
                className="h-[50px] sm:h-[70px] w-auto object-contain"
                unoptimized={logoUrl.startsWith('/')}
              />
            </div>
          </Link>
        ) : (
          <div className="relative h-[70px] w-auto">
            <Image
              src={logoUrl}
              alt={altText}
              width={300}
              height={150}
              className="h-[50px] sm:h-[70px] w-auto object-contain"
              unoptimized={logoUrl.startsWith('/')}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="bg-teal py-12 lg:py-16 overflow-hidden" ref={ref}>
      <div className="section_container mx-auto page-padding-x">
        <motion.div
          className="text-center mb-8 lg:mb-12"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white">
            {title}
          </h2>
        </motion.div>
        <motion.div
          className="relative w-full overflow-hidden"
          variants={scrollVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Marquee
            speed={50}
            gradient={false}
            pauseOnHover={true}
            className="overflow-hidden"
          >
            {brands.map((brand, index) => renderBrandLogo(brand, index))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  )
}
