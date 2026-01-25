'use client'

import Link from 'next/link'

interface ScenariosData {
  scenariosTitle?: string
  scenariosItems?: Array<{
    title: string
    description: string
    link?: string
  }>
}

interface CommonScenariosProps {
  scenarios?: ScenariosData
}

export default function CommonScenarios({ scenarios }: CommonScenariosProps) {
  // Content variables from Sanity
  const title = scenarios?.scenariosTitle
  const items = scenarios?.scenariosItems

  return (
    <section className="bg-[#F8F8F8] py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {title && (
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
        )}

        {/* Scenarios Grid */}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {items.map((scenario, index) => (
              <div
                key={index}
                className={`py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-10 border-l-2 border-[#03C1CA] ${
                  index % 2 === 0 ? 'md:border-r md:border-r-gray-200' : ''
                } ${
                  index < 2 ? 'border-b border-b-gray-200' : ''
                } ${
                  index >= 2 && index < items.length ? 'max-md:border-b max-md:border-b-gray-200' : ''
                } ${
                  index === items.length - 1 ? 'max-md:border-b-0' : ''
                }`}
              >
                {scenario.title && (
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {scenario.title}
                  </h3>
                )}
                {scenario.description && (
                  <p className="text-xs sm:text-sm lg:text-base text-gray-500 mb-4 sm:mb-6 leading-relaxed">
                    {scenario.description}
                  </p>
                )}
                {scenario.link && (
                  <Link
                    href={scenario.link}
                    className="inline-flex items-center text-[#03C1CA] text-xs sm:text-sm font-semibold hover:underline"
                  >
                    See how we help
                    <svg
                      className="ml-1.5 sm:ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
