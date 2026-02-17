'use client'

import Image from 'next/image'
import { ReactNode, useState, useRef, useEffect, useLayoutEffect } from 'react'

const COLLAPSE_DURATION_MS = 800
const TRANSITION_DURATION_MS = 800
const COLLAPSED_CONTENT_HEIGHT = 120

export interface Partner {
  id: number
  name: string
  category: string
  /** Multiple tags (e.g. ERP, OMS, Shipping); first is used as primary for section grouping */
  categories?: string[]
  description: string
  benefits: string[]
  image: string
  logo?: string | ReactNode
}

interface PartnerCardProps {
  partner: Partner
  imageSizes?: string
  /** Called when expand/collapse toggles so the parent can raise z-index (e.g. above other cards/sections, below header). */
  onExpandChange?: (expanded: boolean) => void
  /** External control: whether this card should be expanded */
  isExpanded?: boolean
}

const BENEFITS_COLLAPSED = 2

export default function PartnerCard({
  partner,
  imageSizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  onExpandChange,
  isExpanded: externalIsExpanded,
}: PartnerCardProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false)
  const [isCollapsing, setIsCollapsing] = useState(false)
  const [expandedContentHeight, setExpandedContentHeight] = useState(0)
  const collapseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  // Use external state if provided, otherwise use internal state
  const isExpanded = externalIsExpanded ?? internalIsExpanded

  // Sync external collapse with internal state
  useEffect(() => {
    if (externalIsExpanded === false && internalIsExpanded) {
      // External state says we should close
      setInternalIsExpanded(false)
      setIsCollapsing(true)
      if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current)
      collapseTimeoutRef.current = setTimeout(() => {
        setIsCollapsing(false)
        collapseTimeoutRef.current = null
      }, COLLAPSE_DURATION_MS)
    }
  }, [externalIsExpanded, internalIsExpanded])

  const toggleExpanded = () => {
    if (isExpanded) {
      setInternalIsExpanded(false)
      setIsCollapsing(true)
      if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current)
      collapseTimeoutRef.current = setTimeout(() => {
        setIsCollapsing(false)
        onExpandChange?.(false)
        collapseTimeoutRef.current = null
      }, COLLAPSE_DURATION_MS)
    } else {
      setIsCollapsing(false)
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current)
        collapseTimeoutRef.current = null
      }
      setInternalIsExpanded(true)
      onExpandChange?.(true)
    }
  }

  const isPanelFloating = isExpanded || isCollapsing

  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current)
    }
  }, [])

  // Measure expanded content height on mount so first open also animates (hidden clone)
  useLayoutEffect(() => {
    if (measureRef.current && expandedContentHeight === 0) {
      setExpandedContentHeight(measureRef.current.offsetHeight)
    }
  }, [partner.id, partner.description, partner.benefits, expandedContentHeight])

  const benefitsToShow = isExpanded
    ? partner.benefits
    : partner.benefits.slice(0, BENEFITS_COLLAPSED)

  return (
    <div className="bg-white flex flex-col">
      {/* Partner Image - aspect shrinks (4/3 → 5/3) when expanded for more content focus */}
      <div
        className={`relative w-full min-h-[200px] sm:min-h-[240px] aspect-[17/8.95]`}
        style={{ transition: 'aspect-ratio 300ms ease-in-out' }}
      >
        <Image
          src={partner.image}
          alt={partner.name}
          fill
          className="object-contain object-bottom transition-opacity duration-300"
          sizes={imageSizes}
        />

        {partner.logo && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative max-w-[75%] max-h-[60%] w-full aspect-[2/1]">
              {typeof partner.logo === 'string' ? (
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain"
                />
              ) : (
                partner.logo
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative flex-grow flex flex-col min-h-[281px] overflow-visible">
        <div
          className={`p-6 flex flex-col border border-[#565454] bg-white border-t-0 transition-[box-shadow] duration-[800ms] ease-in-out ${isPanelFloating ? 'absolute top-0 left-0 w-full z-10 shadow-xl' : ''
            }`}
        >
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap w-full">
            <h3 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#03C1CA]">
              {partner.name}
            </h3>
            <div className="flex flex-wrap gap-1.5 shrink-0 justify-end">
              {(partner.categories?.length ? partner.categories : [partner.category]).filter(Boolean).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#1F1D1D33] text-[#565454] text-xs sm:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hidden clone to measure expanded height on mount so first open animates */}
          <div
            ref={measureRef}
            aria-hidden
            className="absolute left-0 right-0 top-0 pointer-events-none overflow-hidden"
            style={{ visibility: 'hidden' }}
          >
            <p className="text-xs lg:text-sm text-[#565454] leading-relaxed mb-4">
              {partner.description}
            </p>
            <div className="flex-grow">
              <h4 className="text-sm lg:text-base font-semibold text-[#1F1D1D] mb-3">
                Key benefits:
              </h4>
              <ul className="space-y-1">
                {partner.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="text-xs lg:text-sm text-[#565454] flex items-start gap-2 leading-tight"
                  >
                    <span className="shrink-0 mt-0.5 text-[#565454]">•</span>
                    <span className="min-w-0 break-words">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Collapsible content: height + text opacity transition (800ms) */}
          <div
            ref={contentWrapperRef}
            className="relative overflow-hidden ease-in-out"
            style={{
              height:
                isExpanded && expandedContentHeight > 0
                  ? expandedContentHeight
                  : isExpanded
                    ? 'auto'
                    : COLLAPSED_CONTENT_HEIGHT,
              transition: `height ${TRANSITION_DURATION_MS}ms ease-in-out`,
            }}
          >
            {/* Collapsed view: fades out when opening, fades in when closing */}
            <div
              className="ease-in-out"
              style={{
                opacity: isExpanded ? 0 : 1,
                transition: `opacity ${TRANSITION_DURATION_MS}ms ease-in-out`,
              }}
            >
              <p className="text-xs lg:text-sm text-[#565454] leading-relaxed mb-4 line-clamp-1">
                {partner.description}
              </p>
              <div className="flex-grow">
                <h4 className="text-sm lg:text-base font-semibold text-[#1F1D1D] mb-3">
                  Key benefits:
                </h4>
                <ul className="space-y-1">
                  {partner.benefits.slice(0, BENEFITS_COLLAPSED).map((benefit, index) => (
                    <li
                      key={index}
                      className="text-xs lg:text-sm text-[#565454] flex items-start gap-2 leading-tight"
                    >
                      <span className="shrink-0 mt-0.5 text-[#565454]">•</span>
                      <span className="min-w-0 line-clamp-1">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Expanded view: fades in when opening, fades out when closing (overlays collapsed) */}
            <div
              className="absolute inset-x-0 top-0 ease-in-out"
              style={{
                opacity: isExpanded ? 1 : 0,
                transition: `opacity ${TRANSITION_DURATION_MS}ms ease-in-out`,
              }}
            >
              <p className="text-xs lg:text-sm text-[#565454] leading-relaxed mb-4">
                {partner.description}
              </p>
              <div className="flex-grow">
                <h4 className="text-sm lg:text-base font-semibold text-[#1F1D1D] mb-3">
                  Key benefits:
                </h4>
                <ul className="space-y-1">
                  {partner.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="text-xs lg:text-sm text-[#565454] flex items-start gap-2 leading-tight"
                    >
                      <span className="shrink-0 mt-0.5 text-[#565454]">•</span>
                      <span className="min-w-0 break-words">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleExpanded}
            className="w-full mt-5 px-5 py-2.5 text-sm font-semibold border-2 border-[#03C1CA] text-[#03C1CA] bg-white hover:bg-[#03C1CA] hover:text-white rounded transition-colors duration-200 self-start"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        </div>
      </div>
    </div>
  )
}
