'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export interface TestimonialItem {
  quote?: string
  authorName?: string
  authorRole?: string
  companyName?: string
  companyLogo?: { asset?: { url?: string } }
}

export interface TestimonialSectionProps {
  theme?: 'dark' | 'light' | 'teal'
  testimonials?: TestimonialItem[]
}

const sectionShell: Record<NonNullable<TestimonialSectionProps['theme']>, string> = {
  dark: 'bg-[#0d1117] text-white',
  light: 'bg-white text-[#1F1D1D] border-y border-[#5654544D]',
  teal: 'bg-[#03C1CA] text-white',
}

const muted: Record<NonNullable<TestimonialSectionProps['theme']>, string> = {
  dark: 'text-[#9ca3af]',
  light: 'text-[#565454]',
  teal: 'text-white/90',
}

const ROTATE_MS = 8000

export default function TestimonialSection({ theme = 'dark', testimonials = [] }: TestimonialSectionProps) {
  const items = testimonials.filter((t) => (t.quote || '').trim().length > 0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [items.length])

  if (items.length === 0) return null

  const current = items[Math.min(index, items.length - 1)]!
  const shell = sectionShell[theme] ?? sectionShell.dark
  const sub = muted[theme] ?? muted.dark

  return (
    <section className={`relative py-16 lg:py-24 overflow-hidden ${shell}`}>
      <div className="section_container mx-auto page-padding-x max-w-4xl text-center">
        <blockquote className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug tracking-tight mb-10">
          &ldquo;{current.quote?.trim()}&rdquo;
        </blockquote>

        <div className="flex flex-col items-center gap-4">
          {current.companyLogo?.asset?.url ? (
            <div className="relative h-10 w-32 opacity-90">
              <Image
                src={current.companyLogo.asset.url}
                alt={current.companyName || 'Company'}
                fill
                className="object-contain grayscale"
                sizes="128px"
              />
            </div>
          ) : null}
          <div>
            <p className="text-base font-semibold">{current.authorName}</p>
            <p className={`text-sm ${sub}`}>
              {[current.authorRole, current.companyName].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>

        {items.length > 1 ? (
          <div className="flex justify-center gap-2 mt-10" role="tablist" aria-label="Testimonials">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`h-2.5 w-2.5 rounded-full transition-opacity ${
                  i === index ? 'opacity-100 bg-current' : 'opacity-35 bg-current'
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
