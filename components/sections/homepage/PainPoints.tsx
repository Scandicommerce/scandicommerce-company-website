'use client'

import React from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { HiXMark } from 'react-icons/hi2'

interface PainPointsData {
  painPointsTitle?: {
    text?: string
    highlight?: string
  }
  painPointsItems?: Array<{
    text: string
  }>
  painPointsBottomText?: string
  painPointsCta?: {
    text?: string
    url?: string
  }
}

interface PainPointsProps {
  painPoints?: PainPointsData
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: 15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

const titleVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

export default function PainPoints({ painPoints }: PainPointsProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  
  const titleInView = useInView(titleRef, { once: true, amount: 0.5 })
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.3 })
  const bottomInView = useInView(bottomRef, { once: true, amount: 0.5 })
  
  // Content variables from Sanity
  const titleText = painPoints?.painPointsTitle?.text
  const titleHighlight = painPoints?.painPointsTitle?.highlight
  const items = painPoints?.painPointsItems
  const bottomText = painPoints?.painPointsBottomText
  const ctaText = painPoints?.painPointsCta?.text
  const ctaUrl = painPoints?.painPointsCta?.url

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
        <motion.span 
          className="text-teal inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={titleInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {titleHighlight}
        </motion.span>
        {parts[1]}
      </>
    )
  }

  return (
    <section className="relative bg-gray-50 py-16 lg:py-24 overflow-hidden" ref={sectionRef}>
      <div className="section_container mx-auto page-padding-x">
        {titleText && (
          <motion.div 
            ref={titleRef}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            variants={titleVariants}
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight px-2">
              {renderTitle()}
            </h2>
          </motion.div>
        )}

        {items && items.length > 0 && (
          <motion.div 
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            style={{ perspective: 1000 }}
          >
            {items.map((point, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="bg-white p-4 sm:p-6 shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center gap-3 sm:gap-4 min-h-[140px] sm:h-40 origin-bottom"
              >
                <motion.div 
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-teal rounded-full flex-shrink-0"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={cardsInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5, type: "spring" }}
                  whileHover={{ rotate: 180, scale: 1.1 }}
                >
                  <HiXMark className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                <motion.p 
                  className="text-[#565454] font-semibold text-xs sm:text-sm text-center leading-tight"
                  initial={{ opacity: 0 }}
                  animate={cardsInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                >
                  {point.text}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div ref={bottomRef}>
          {bottomText && (
            <motion.div 
              className="text-center mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={bottomInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="text-base sm:text-lg lg:text-xl text-gray-900">
                {bottomText}
              </p>
            </motion.div>
          )}

          {ctaText && ctaUrl && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={bottomInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div
                whileHover={{ x: 8, scale: 1.02 }}
                className="inline-block"
              >
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center gap-2 text-defaultText font-semibold text-base sm:text-lg hover:text-teal-dark transition-colors"
                >
                  {ctaText}
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </motion.svg>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
