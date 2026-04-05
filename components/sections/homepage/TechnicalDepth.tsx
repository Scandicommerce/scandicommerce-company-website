'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export interface TechnicalDepthCapability {
  icon?: string
  title?: string
  description?: string
  tags?: string[]
}

export interface TechnicalDepthData {
  title?: string
  subtitle?: string
  capabilities?: TechnicalDepthCapability[]
}

interface TechnicalDepthProps {
  data?: TechnicalDepthData
}

export default function TechnicalDepth({ data }: TechnicalDepthProps) {
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, amount: 0.4 })
  const gridInView = useInView(gridRef, { once: true, amount: 0.15 })

  const title = data?.title
  const subtitle = data?.subtitle
  const capabilities = data?.capabilities?.filter(Boolean) ?? []

  if (!title && !subtitle && capabilities.length === 0) return null

  return (
    <section className="relative bg-white py-16 lg:py-24 overflow-hidden">
      <div className="section_container mx-auto page-padding-x">
        {(title || subtitle) && (
          <motion.div
            ref={titleRef}
            className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {title ? (
              <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900 leading-tight">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-4 text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#555555] leading-relaxed">
                {subtitle}
              </p>
            ) : null}
          </motion.div>
        )}

        {capabilities.length > 0 && (
          <motion.div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            initial="hidden"
            animate={gridInView ? 'visible' : 'hidden'}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.05 },
              },
            }}
          >
            {capabilities.map((cap, index) => (
              <motion.article
                key={`${cap.title ?? 'cap'}-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                  },
                }}
                className="flex flex-col h-full rounded-xl border border-gray-100 bg-gray-50 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow"
              >
                {cap.icon ? (
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal text-white text-xs font-semibold mb-4">
                    {cap.icon.slice(0, 3).toUpperCase()}
                  </span>
                ) : null}
                {cap.title ? (
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {cap.title}
                  </h3>
                ) : null}
                {cap.description ? (
                  <p className="text-sm sm:text-[15px] text-[#565454] leading-relaxed flex-grow">
                    {cap.description}
                  </p>
                ) : null}
                {cap.tags && cap.tags.length > 0 ? (
                  <ul className="flex flex-wrap gap-2 mt-4">
                    {cap.tags.map((tag) => (
                      <li
                        key={tag}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-white text-teal border border-teal/25"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
