'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ServiceCard from '@/components/ui/ServiceCard'
import TorusKnotAnimation from '@/components/ui/TorusKnotAnimation'
import { Button } from '@/components/ui'

interface HeroData {
  heroBadge?: string
  heroTitle?: {
    text?: string
    highlight?: string
  }
  heroDescription?: string
  heroButtons?: Array<{
    text: string
    link: string
    variant?: 'primary' | 'secondary'
  }>
  heroTagline?: string
  heroPackages?: Array<{
    title: string
    price?: string
  }>
}

interface HeroProps {
  hero?: HeroData
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
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

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, x: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

export default function Hero({ hero }: HeroProps) {
  // Content variables from Sanity
  const badge = hero?.heroBadge
  const titleText = hero?.heroTitle?.text
  const titleHighlight = hero?.heroTitle?.highlight
  const description = hero?.heroDescription
  const buttons = hero?.heroButtons
  const tagline = hero?.heroTagline
  const packages = hero?.heroPackages

  // Helper to render title with highlight
  const renderTitle = () => {
    if (!titleText) return null
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
    <section className="relative bg-[#F8F8F8] py-16 lg:py-24 overflow-hidden min-h-[calc(100vh-80px)] flex items-center justify-center">
      {/* Three.js Torus Knot Animation */}
      <TorusKnotAnimation className="opacity-70 lg:right-[-25%] sm:top-0 top-[27vw] xs:top-2 lg:w-[100%] lg:h-[100%] md:w-[55vw] sm:w-[70vw] sm:h-[65vw] xs:w-[60%] xs:h-[40%] w-[90%] flex justify-center sm:justify-start`" />
      <div className="section_container mx-auto page-padding-x">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-16">
          <motion.div
            className="relative space-y-8 lg:space-y-14 w-full lg:w-3/5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            {badge && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-4 px-4 sm:px-5 py-3 sm:py-4 relative z-10 backdrop-blur-md border border-[#48c5cb]/30"
                style={{
                  backgroundColor: 'rgba(29, 239, 250, 0.15)',
                  // boxShadow: '0px 0px 4px 0px #48c5cb',
                }}
              >
                <span className="text-[10px] sm:text-sm font-bold text-[#00b3bb] uppercase tracking-wide">
                  {badge}
                </span>
                {/* Shopify Plus Partner Logo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/shopifyPlus.svg"
                  alt="Shopify Plus Partner"
                  className="h-9 sm:h-10 w-auto"
                />
              </motion.div>
            )}

            {titleText && (
              <motion.h1
                variants={itemVariants}
                className="text-[6.3vw] xs:text-[24px] sm:text-[32px] md:text-[40px] lg:text-[46px] xl:text-[52px] 2xl:text-[64px] lg:text-start text-center font-bold text-gray-900 leading-[130%] tracking-[0%] pr-0 sm:pr-8 lg:pr-[78px] relative z-10"
              >
                {renderTitle()}
              </motion.h1>
            )}

            {description && (
              <motion.p
                variants={itemVariants}
                className="text-[3.7vw] xs:text-sm sm:text-base lg:text-lg lg:text-start text-center text-gray-600 leading-relaxed pr-0 sm:pr-8 lg:pr-12 relative z-10"
              >
                {description}
              </motion.p>
            )}

            {buttons && buttons.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:justify-center gap-3.5 sm:gap-5 lg:gap-7 relative z-10"
              >
                {buttons.map((button, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button href={button.link || '#'} type={button.variant === 'primary' || index === 0 ? 'primary' : 'default'}>{button.text}</Button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {tagline && (
              <motion.p
                variants={itemVariants}
                className="text-xs xs:text-sm text-gray-500 relative z-10 lg:text-start text-center"
              >
                {tagline}
              </motion.p>
            )}
          </motion.div>

          {packages && packages.length > 0 && (
            <motion.div
              className="space-y-4 w-full lg:w-2/5 z-10"
              variants={cardContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {packages.map((pkg, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    x: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <ServiceCard
                    title={pkg.title}
                    price={pkg.price || ''}
                    isOdd={index % 2 === 0}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
