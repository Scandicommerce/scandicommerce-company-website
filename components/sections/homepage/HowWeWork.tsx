'use client'

import React from 'react'

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

export default function HowWeWork({ process }: HowWeWorkProps) {
  // Content variables from Sanity
  const title = process?.processTitle
  const subtitle = process?.processSubtitle
  const steps = process?.processSteps

  return (
    <section className="relative bg-white py-10 lg:py-24 overflow-hidden">
      <div className="section_container max-w-[1320px] mx-auto page-padding-x">
        <div className="mb-[18px] lg:mb-8">
          <div className="text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-2 lg:mb-2.5">
            Prosess
          </div>
          {title && (
            <h2 className="text-[26px] lg:text-[40px] font-bold text-sc-ink-900 tracking-[-0.02em] leading-tight m-0">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm lg:text-base text-sc-ink-600 mt-2 lg:mt-3 m-0">
              {subtitle}
            </p>
          )}
        </div>

        {steps && steps.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 border border-sc-ink-100 rounded-[10px] overflow-hidden">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1
              const borderClasses = [
                // mobile 2x2 grid: right divider on left column, bottom divider on all but last row
                index % 2 === 0 && !isLast ? 'border-r' : '',
                index < steps.length - 2 ? 'border-b lg:border-b-0' : '',
                // desktop 4 columns: right divider on all but last
                !isLast ? 'lg:border-r' : '',
              ]
                .filter(Boolean)
                .join(' ')
              const number = String(step.number || index + 1).padStart(2, '0')

              return (
                <div
                  key={index}
                  className={`p-4 lg:px-7 lg:py-8 border-sc-ink-100 ${borderClasses}`}
                >
                  <div className="text-xs lg:text-[13px] font-semibold text-sc-cyan-600 mb-1.5 lg:mb-2">
                    {number} · {step.title}
                  </div>
                  {step.description && (
                    <p className="text-xs lg:text-sm leading-normal text-sc-ink-600 m-0">
                      {step.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
