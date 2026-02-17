'use client'

import { useState } from 'react'
import { Package } from '@/lib/packages'
import IdealFor from './IdealFor'

interface PackageTabsProps {
  pkg: Package
}

export default function PackageTabs({ pkg }: PackageTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'included', label: "What's Included" },
    { id: 'process', label: 'Process' },
    { id: 'faq', label: 'FAQ' },
    { id: 'reviews', label: 'Reviews' },
  ]

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8 overflow-x-auto">
            <div className="flex w-full min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-auto min-w-[120px] sm:min-w-[150px] shrink-0 p-2 sm:p-4 text-sm sm:text-base font-medium transition-colors duration-200 border-l border-gray-200 first:border-l-0 whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-[#03C1CA] text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div
            className={`p-4 sm:p-8 lg:p-12 min-h-[400px] ${activeTab === 'reviews'
              ? 'bg-gradient-to-b from-[#F0F9FA] to-[#E0F4F6]'
              : 'bg-[#F0F9FA]'
              }`}
          >
            {activeTab === 'overview' && <IdealFor idealFor={pkg.idealFor} />}

            {activeTab === 'included' && (
              <div className="space-y-10">
                {pkg.includedCategories ? (
                  // Categorized view
                  pkg.includedCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-gray-900 mb-6">
                        {category.category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="bg-white p-5 border border-gray-100 shadow-sm"
                          >
                            <span className="text-gray-700 text-[4vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[20px]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>  
                  ))
                ) : (
                  // Fallback to simple list
                  <div>
                    <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-gray-900 mb-6">
                      What&apos;s Included
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pkg.included.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white p-5 border border-gray-100 shadow-sm"
                        >
                          <span className="text-gray-700 text-[4vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[20px]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'process' && (
              <div>
                {pkg.processSteps ? (
                  <div className="space-y-4">
                    {pkg.processSteps.map((step, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100 flex sm:flex-row flex-col items-start gap-6"
                      >
                        {/* Week label on the left */}
                        <div className="flex-shrink-0">
                          <div className="bg-gray-100 px-3 py-1.5 rounded text-sm font-medium text-gray-600">
                            {step.week}
                          </div>
                        </div>
                        {/* Title and description */}
                        <div className="flex-1">
                          <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-gray-900 mb-1">
                            {step.title}
                          </h3>
                          <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[14px] xl:text-[16px] text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pkg.process ? (
                  <div className="space-y-6">
                    {pkg.process.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#03C1CA] text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-gray-700 text-lg">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Process details coming soon.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'faq' && (
              <div>
                {pkg.faq && pkg.faq.length > 0 ? (
                  <div className="space-y-4">
                    {pkg.faq.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                      >
                        <h4 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[20px] font-bold text-gray-900 mb-3">
                          {item.question}
                        </h4>
                        <p className="text-gray-600 text-[4vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[20px] leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">FAQ coming soon.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {pkg.reviews && pkg.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {pkg.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                      >
                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-6 h-6 ${star <= review.rating
                                ? 'text-amber-400'
                                : 'text-gray-300'
                                }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        {/* Review Text */}
                        <p className="text-gray-900 text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[20px] mb-4 leading-relaxed">
                          &quot;{review.comment}&quot;
                        </p>
                        {/* Reviewer Name */}
                        <p className="font-bold text-gray-900 text-lg mb-1">
                          {review.name}
                        </p>
                        {/* Reviewer Title/Company */}
                        {review.title && (
                          <p className="text-gray-500 text-[4vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[20px]">
                            {review.title}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Reviews coming soon.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

