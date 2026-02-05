'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

interface PartnersData {
  partnersBadges?: Array<{
    text: string
    link?: string
  }>
  partnersDescription?: string
}

interface PartnersProps {
  partners?: PartnersData
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const badgeVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
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

const descriptionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

export default function Partners({ partners }: PartnersProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Content variables from Sanity
  const badges = partners?.partnersBadges
  const description = partners?.partnersDescription

  return (
    <section className="relative bg-gray-50 py-12 md:py-16 lg:py-24 overflow-hidden" ref={ref}>
      <div className="section_container mx-auto page-padding-x">
        {badges && badges.length > 0 && (
          <motion.div 
            className="flex flex-col md:grid md:grid-cols-3 max-w-4xl mx-auto mb-8 md:mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                variants={badgeVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  transition: { duration: 0.2 }
                }}
              >
                <Link
                  href={badge.link || '#'}
                  className="block border-t md:border-t-0 md:border-l border-gray-300 py-4 text-center last:border-b md:last:border-b-0 md:last:border-r"
                >
                  <span className="text-gray-900 font-semibold text-base md:text-lg hover:text-teal transition-colors">
                    {badge.text}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {description && (
          <motion.div 
            className="text-center"
            variants={descriptionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4 md:px-0">
              {description}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
