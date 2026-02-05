'use client'

import React from 'react'
import Image from 'next/image'
import HubSpotFormEmbed from './HubSpotFormEmbed'

interface RevenueFormData {
  title?: string
  subtitle?: string
  testimonial?: {
    quote?: string
    authorName?: string
    authorRole?: string
    authorCompany?: string
    authorImageUrl?: string
  }
  form?: {
    formTitle?: string
    formSubtitle?: string
    formDescription?: string
    submitButtonText?: string
  }
}

interface RevenueFormProps {
  revenueForm?: RevenueFormData
}

export default function RevenueForm({ revenueForm }: RevenueFormProps) {
  const title = revenueForm?.title
  const subtitle = revenueForm?.subtitle
  const testimonial = revenueForm?.testimonial
  const form = revenueForm?.form

  return (
    <section className="relative overflow-hidden">
      {/* Full teal background */}
      <div className="bg-[#00BFC8]">
        {/* Top section with title and testimonial */}
        <div className="pt-16 pb-8 lg:pt-20 lg:pb-12">
          <div className="section_container mx-auto page-padding-x">
            {/* Title */}
            <div className="text-center mb-10">
              {title && (
                <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-white/90 text-sm lg:text-base max-w-lg mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Testimonial Card */}
            {testimonial && (
              <div className="w-full max-w-5xl lg:w-[75%] mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 bg-[#00A8B0] px-6 py-5">
                  {/* Profile photo with teal border */}
                  {testimonial.authorImageUrl && (
                    <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#00BFC8]">
                      <Image
                        src={testimonial.authorImageUrl}
                        alt={testimonial.authorName || 'Author'}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Name and title */}
                  <div className="flex-shrink-0 text-center sm:text-left">
                    {testimonial.authorName && (
                      <h4 className="text-[#1DEFFA] font-semibold text-lg mb-1">{testimonial.authorName}</h4>
                    )}
                    {testimonial.authorRole && (
                      <p className="text-white/80 text-sm">{testimonial.authorRole}</p>
                    )}
                    {testimonial.authorCompany && (
                      <p className="text-white font-bold text-sm">{testimonial.authorCompany}</p>
                    )}
                  </div>

                  {/* Quote */}
                  {testimonial.quote && (
                    <div className="flex-1">
                      <p className="text-white text-sm lg:text-base text-center sm:text-left leading-relaxed">
                        &quot;{testimonial.quote}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form section - white card */}
        <div className="pb-[4.5rem]">
          <div className="section_container mx-auto page-padding-x">
            <div className="w-full max-w-5xl lg:w-[75%] mx-auto bg-white shadow-2xl px-8 py-10 lg:px-12 lg:py-12">
              {/* Form header */}
              <div className="text-center mb-10">
                {form?.formTitle && (
                  <h3 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900 mb-3">
                    {form.formTitle}
                  </h3>
                )}
                {form?.formSubtitle && (
                  <p className="text-gray-400 text-sm mb-4">
                    {form.formSubtitle}
                  </p>
                )}
                {form?.formDescription && (
                  <p className="text-gray-600 text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[14px] xl:text-[16px]">
                    {form.formDescription}
                  </p>
                )}
              </div>

              {/* HubSpot form embed */}
              <div className="[&_.hs-form-frame]:min-h-[400px]">
                <HubSpotFormEmbed />
              </div>

              {/* Bottom section with HubSpot and trust signals - on white background */}
              <div className="mt-10 pt-8">
                <div className="flex flex-col sm:flex-row items-center">
                  {/* HubSpot branding - in light gray box */}
                  <div className="bg-[#F8F8F8] px-6 py-4 flex items-center gap-4 flex-shrink-0">
                    <div className="w-12 h-12 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/shopify/shopify_platform/Vector.svg"
                        alt="HubSpot"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Create your own free forms</p>
                      <p className="text-xs text-gray-500">to generate leads from your website.</p>
                    </div>
                  </div>

                  {/* Vertical divider */}
                  <div className="hidden sm:block w-px h-14 bg-gray-300 mx-6"></div>

                  {/* Trust signals */}
                  <div className="text-sm text-gray-600 text-center sm:text-left flex-1 mt-6 sm:mt-0">
                    <span>⚡ We respond within 2 hours</span>
                    <span className="mx-2">|</span>
                    <span>📞 Same-day consultation calls</span>
                    <br />
                    <span>🚀 24-hour implementation guaranteed</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom teal bar */}
      <div className="h-4 bg-[#00BFC8] w-full"></div>
    </section>
  )
}
