'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ProcessData {
  processTitle?: string
  processSubtitle?: string
  processSteps?: Array<{
    number?: number
    title: string
    description?: string
  }>
}

interface HowWeWorkProps {
  process?: ProcessData
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
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const stepVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
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

const numberVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
}

export default function HowWeWork({ process }: HowWeWorkProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.2 })

  // Content variables from Sanity
  const title = process?.processTitle
  const subtitle = process?.processSubtitle
  const steps = process?.processSteps

  return (
    <section className="relative bg-white py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div 
            ref={headerRef}
            className="text-center mb-12 lg:mb-16 relative"
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
          >
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {steps && steps.length > 0 && (
          <motion.div 
            ref={stepsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={stepsInView ? "visible" : "hidden"}
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                variants={stepVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <motion.div 
                  className="flex items-center justify-center w-16 h-16 bg-teal rounded-full mx-auto mb-6"
                  variants={numberVariants}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <span className="text-2xl font-bold text-white">{step.number || index + 1}</span>
                </motion.div>

                {step.title && (
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0 }}
                    animate={stepsInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {step.title}
                  </motion.h3>
                )}

                {step.description && (
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={stepsInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {step.description}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
