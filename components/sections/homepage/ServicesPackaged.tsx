'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { HiShoppingCart, HiChartBar, HiChatBubbleBottomCenterText } from 'react-icons/hi2'

interface ServicesShowcaseData {
  title?: {
    text?: string
    highlight?: string
  }
  subtitle?: string
  categories?: Array<{
    title: string
    icon?: string
    description?: string
    price?: string
    link?: string
    linkText?: string
  }>
}

interface Package {
  title: string
  subtitle: string
  price: string
  priceType: string
  timeline: string
  rating: number
  ratingValue: string
  bestFor: string[]
  included: string[]
  description: string
  href: string
  buttonText?: string
}

interface PackagesData {
  packagesItems?: Package[]
}

interface ServicesPackagedProps {
  data?: ServicesShowcaseData
  packages?: PackagesData
}

const iconMap: Record<string, React.ReactNode> = {
  cart: <HiShoppingCart className="w-6 h-6" />,
  chart: <HiChartBar className="w-6 h-6" />,
  chat: <HiChatBubbleBottomCenterText className="w-6 h-6" />,
}

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

const categoryContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const categoryItemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

const packageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const packageItemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.svg
          key={star}
          className={`w-3 h-3 ${star <= Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: star * 0.1, duration: 0.3 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ))}
    </div>
  )
}

export default function ServicesPackaged({ data, packages: packagesData }: ServicesPackagedProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const packagesRef = useRef<HTMLDivElement>(null)
  
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })
  const categoriesInView = useInView(categoriesRef, { once: true, amount: 0.2 })
  const packagesInView = useInView(packagesRef, { once: true, amount: 0.2 })

  // Content variables from Sanity (section title/subtitle from Homepage)
  const titleText = data?.title?.text || 'Shopify services, packaged like products'
  const titleHighlight = data?.title?.highlight || 'packaged like products'
  const subtitle = data?.subtitle || 'Clear scope. Fixed price. Predictable delivery.'
  const categories = data?.categories
  
  // Use packages from All Packages page
  const displayPackages = packagesData?.packagesItems

  // Helper to render title with highlight
  const renderTitle = () => {
    if (!titleHighlight || !titleText.includes(titleHighlight)) {
      return titleText
    }
    const parts = titleText.split(titleHighlight)
    return (
      <>
        {parts[0]}
        <span className="text-teal">{titleHighlight}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <section id="packages" className="relative bg-white py-16 lg:py-24 overflow-hidden">
      <div className="section_container mx-auto page-padding-x">
        <motion.div 
          ref={headerRef}
          className="text-center mb-12 lg:mb-16 relative"
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
        >
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900 leading-tight mb-4">
            {renderTitle()}
          </h2>
          <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#555555] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {categories && categories.length > 0 && (
          <motion.div 
            ref={categoriesRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 lg:mb-20"
            variants={categoryContainerVariants}
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={categoryItemVariants}
                whileHover={{ y: -5 }}
                className="border-l border-r border-gray-200 px-6 lg:px-8 first:border-l-0 last:border-r-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-gray-900">{category.title}</h3>
                  <motion.div 
                    className="text-teal"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {iconMap[category.icon || 'cart'] || iconMap.cart}
                  </motion.div>
                </div>
                {category.description && (
                  <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#555555] mb-4">{category.description}</p>
                )}
                {category.price && (
                  <p className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#03C1CA] mb-6 font-mono tracking-tight">{category.price}</p>
                )}
                {category.link && (
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      href={category.link}
                      className="inline-flex items-center gap-2 text-teal font-semibold hover:text-teal-dark transition-colors"
                    >
                      {category.linkText || 'View services'}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {displayPackages && displayPackages.length > 0 && (
          <motion.div 
            ref={packagesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={packageContainerVariants}
            initial="hidden"
            animate={packagesInView ? "visible" : "hidden"}
          >
            {displayPackages.map((pkg, index) => {
              return (
              <motion.div
                key={index}
                variants={packageItemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="border-l border-r border-gray-200 px-6 lg:px-8 first:border-l-0 last:border-r-0 flex flex-col"
              >
                {/* Title & Subtitle */}
                <div className="mb-4">
                  <h4 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-gray-900 mb-1">
                    {pkg.title || 'Package Title'}
                  </h4>
                  {pkg.subtitle && (
                    <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#555555]">{pkg.subtitle}</p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#03C1CA] font-mono tracking-tight">
                      {pkg.price || 'Price'}
                    </span>
                    {pkg.priceType && (
                      <span className="text-xs text-gray-500 font-sans">{pkg.priceType}</span>
                    )}
                  </div>
                  {pkg.timeline && (
                    <p className="text-xs text-gray-600 mt-1 font-sans">Timeline: {pkg.timeline}</p>
                  )}
                </div>

                {/* Rating */}
                {(pkg.rating !== undefined && pkg.rating !== null && pkg.rating > 0) || pkg.ratingValue ? (
                  <div className="flex items-center gap-2 mb-4">
                    {pkg.rating !== undefined && pkg.rating !== null && pkg.rating > 0 && (
                      <StarRating rating={pkg.rating} />
                    )}
                    {pkg.ratingValue && (
                      <span className="text-sm font-medium text-gray-700">{pkg.ratingValue}</span>
                    )}
                  </div>
                ) : null}

                {/* Best For (limited to 3 items) */}
                {pkg.bestFor && pkg.bestFor.length > 0 && (
                  <ul className="space-y-2 mb-6 flex-grow">
                    {pkg.bestFor.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">
                        • {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* View Details Button */}
                {pkg.href && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={pkg.href}
                      className="inline-block bg-teal text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-dark transition-colors text-center w-full mt-auto"
                    >
                      {pkg.buttonText || 'View Details'}
                    </Link>
                  </motion.div>
                )}
              </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
