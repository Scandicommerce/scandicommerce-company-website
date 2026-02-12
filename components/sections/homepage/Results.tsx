'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

interface ResultsData {
  title?: string
  subtitle?: string
  items?: Array<{
    clientImage?: {
      asset?: {
        url?: string
      }
    }
    clientName: string
    stat: string
    metricName?: string
    description?: string
    ctaText?: string
    ctaLink?: string
  }>
}

interface ResultsProps {
  data?: ResultsData
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

const cardVariants = {
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

const statVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
      delay: 0.2
    }
  }
}

export default function Results({ data }: ResultsProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })
  const gridInView = useInView(gridRef, { once: true, amount: 0.2 })

  // Content variables from Sanity
  const title = data?.title
  const subtitle = data?.subtitle
  const items = data?.items

  return (
    <section className="relative bg-black py-16 lg:py-24 overflow-hidden">
      <div className="section_container mx-auto page-padding-x">
        {(title || subtitle) && (
          <motion.div 
            ref={headerRef}
            className="text-center mb-12 lg:mb-16 relative"
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
          >
            {title && (
              <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white leading-tight mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-gray-400">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {items && items.length > 0 && (
          <motion.div 
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={gridInView ? "visible" : "hidden"}
          >
            {items.map((study, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
              >
                <motion.div 
                  className="flex items-start justify-between mb-6"
                  initial={{ opacity: 0 }}
                  animate={gridInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="relative h-12 rounded-lg overflow-hidden">
                    {study.clientImage?.asset?.url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={study.clientImage.asset.url}
                        alt={study.clientName}
                        className="h-full w-auto object-contain"
                      />
                    ) : (
                      <div className="w-16 h-full flex items-center justify-center text-gray-500 bg-gray-700 rounded-lg">
                        <span className="text-2xl">👤</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">{study.clientName}</span>
                </motion.div>

                <div className="mb-4">
                  {study.stat && (
                    <motion.p 
                      className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-2 font-mono tracking-tight"
                      variants={statVariants}
                    >
                      {study.stat}
                    </motion.p>
                  )}
                  {study.metricName && (
                    <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white">{study.metricName}</p>
                  )}
                </div>

                {study.description && (
                  <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-gray-400 mb-6">{study.description}</p>
                )}

                {study.ctaLink && (
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      href={study.ctaLink}
                      className="inline-flex items-center gap-2 text-teal font-semibold hover:text-teal-light transition-colors"
                    >
                      {study.ctaText || 'Read case study'}
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
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
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
