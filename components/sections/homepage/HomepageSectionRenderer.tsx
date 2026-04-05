'use client'

import React from 'react'
import Hero from '@/components/sections/homepage/Hero'
import TrustedBy from '@/components/sections/homepage/TrustedBy'
import PainPoints from '@/components/sections/homepage/PainPoints'
import ServicesPackaged from '@/components/sections/homepage/ServicesPackaged'
import Results from '@/components/sections/homepage/Results'
import HowWeWork from '@/components/sections/homepage/HowWeWork'
import Partners from '@/components/sections/homepage/Partners'
import CTA from '@/components/sections/homepage/CTA'
import TechnicalDepth from '@/components/sections/homepage/TechnicalDepth'
import TestimonialSection, {
  type TestimonialItem,
} from '@/components/sections/homepage/TestimonialSection'
import LatestInsightsSection from '@/components/sections/homepage/LatestInsightsSection'
import type { LatestInsightPost } from '@/lib/homepageLatestInsights'
import type { HomepageData, HomepageSectionBlock } from '@/types/homepage'

function blockPayload(block: HomepageSectionBlock): Record<string, unknown> {
  const { _type: _t, _key: _k, ...rest } = block
  return rest
}

export type PackagesFallback = {
  packagesItems?: Array<{
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
  }>
}

export interface HomepageSectionRendererProps {
  sections: NonNullable<HomepageData['sections']>
  /** When a services block has no packages, same fallback as legacy homepage */
  packagesFallback?: PackagesFallback
  /** Resolved in page.tsx for each `latestInsightsSection` block `_key` */
  latestInsightsByKey?: Record<string, LatestInsightPost[]>
  /** Path locale, e.g. `no` — used for latest-insights links */
  lang: string
}

export default function HomepageSectionRenderer({
  sections,
  packagesFallback,
  latestInsightsByKey,
  lang,
}: HomepageSectionRendererProps) {
  return (
    <>
      {sections.map((block) => {
        const key = block._key
        const p = blockPayload(block)

        switch (block._type) {
          case 'heroSection':
            return <Hero key={key} hero={p as HomepageData['hero']} />
          case 'trustedBySection':
            return (
              <TrustedBy key={key} trustedBy={p as HomepageData['trustedBy']} />
            )
          case 'painPointsSection':
            return (
              <PainPoints key={key} painPoints={p as HomepageData['painPoints']} />
            )
          case 'servicesShowcaseSection': {
            const showcase = p as HomepageData['servicesShowcase']
            const mappedPackages =
              showcase?.packages?.length && showcase.packages.length > 0
                ? {
                    packagesItems: showcase.packages.map((pkg) => ({
                      title: pkg.title || '',
                      subtitle: pkg.subtitle || '',
                      price: pkg.price || '',
                      priceType: pkg.priceType || '',
                      timeline: pkg.timeline || '',
                      rating: pkg.rating || 0,
                      ratingValue: pkg.ratingValue || '',
                      bestFor: pkg.bestFor || [],
                      included: [],
                      description: '',
                      href: pkg.buttonLink || '',
                      buttonText: pkg.buttonText || 'View Details',
                    })),
                  }
                : packagesFallback
            return (
              <ServicesPackaged
                key={key}
                data={showcase}
                packages={mappedPackages}
              />
            )
          }
          case 'resultsSection':
            return <Results key={key} data={p as HomepageData['results']} />
          case 'processSection':
            return (
              <HowWeWork key={key} process={p as HomepageData['process']} />
            )
          case 'partnersSection':
            return (
              <Partners key={key} partners={p as HomepageData['partners']} />
            )
          case 'ctaSection':
            return <CTA key={key} data={p as HomepageData['cta']} />
          case 'technicalDepthSection':
            return (
              <TechnicalDepth
                key={key}
                data={
                  p as {
                    title?: string
                    subtitle?: string
                    capabilities?: Array<{
                      icon?: string
                      title?: string
                      description?: string
                      tags?: string[]
                    }>
                  }
                }
              />
            )
          case 'testimonialSection':
            return (
              <TestimonialSection
                key={key}
                theme={
                  (p.theme as 'dark' | 'light' | 'teal' | undefined) || 'dark'
                }
                testimonials={(p.testimonials as TestimonialItem[]) || []}
              />
            )
          case 'latestInsightsSection':
            return (
              <LatestInsightsSection
                key={key}
                title={p.title as string | undefined}
                subtitle={p.subtitle as string | undefined}
                ctaText={p.ctaText as string | undefined}
                ctaLink={p.ctaLink as string | undefined}
                posts={latestInsightsByKey?.[key] ?? []}
                lang={lang}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
