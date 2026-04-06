'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export interface TechnicalDepthData {
  headline?: string
  body?: string
}

interface TechnicalDepthProps {
  data?: TechnicalDepthData
}

export default function TechnicalDepth({ data }: TechnicalDepthProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const headline = data?.headline
  const body = data?.body

  if (!headline && !body) return null

  return (
    <section className="relative bg-white py-16 lg:py-24" ref={ref}>
      <div className="section_container mx-auto page-padding-x max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {headline ? (
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-6">{headline}</h2>
          ) : null}
          {body ? (
            <p className="text-lg text-gray-600 whitespace-pre-wrap leading-relaxed">{body}</p>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
