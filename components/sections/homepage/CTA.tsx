'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

interface CTAData {
  title?: string
  subtitle?: string
  buttons?: Array<{
    text: string
    link: string
    variant?: 'primary' | 'secondary'
  }>
}

interface CTAProps {
  data?: CTAData
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

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

const buttonContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4
    }
  }
}

const buttonVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

export default function CTA({ data }: CTAProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Content variables from Sanity
  const title = data?.title
  const subtitle = data?.subtitle
  const buttons = data?.buttons

  return (
    <section className="relative bg-teal py-16 lg:py-44 overflow-hidden" ref={ref}>
       <div className="section_container mx-auto page-padding-x">
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {title && (
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4"
              variants={itemVariants}
            >
              {title}
            </motion.h2>
          )}

          {subtitle && (
            <motion.p 
              className="text-lg text-gray-100 mb-8 lg:mb-12"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>
          )}

          {buttons && buttons.length > 0 && (
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={buttonContainerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {buttons.map((button, index) => (
                <motion.div
                  key={index}
                  variants={buttonVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -3,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={button.link || '#'}
                    className={`block px-8 py-3 font-semibold transition-colors text-center ${
                      button.variant === 'primary' || index === 0
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {button.text}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
