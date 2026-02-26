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
                <p className="text-white/90 max-w-2xl mx-auto leading-relaxed text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[14px] xl:text-[16px]" >
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
            <div className="w-full max-w-5xl lg:w-[75%] mx-auto bg-white shadow-2xl px-8 py-10 lg:px-16 lg:py-16">
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
              <div className="mt-10 pt-8 pb-[4.5rem] hidden">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* HubSpot branding - in light gray box */}
                  <div className="bg-[#F8F8F8] px-6 py-4 flex items-center gap-4 flex-shrink-0">
                    <div className="w-12 h-12 flex-shrink-0">
                      <svg width="67" height="69" viewBox="0 0 67 69" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fillRule="evenodd" clipRule="evenodd" d="M48.0435 49.4068C42.9204 49.4068 38.768 45.2981 38.768 40.2313C38.768 35.1633 42.9204 31.0553 48.0435 31.0553C53.1665 31.0553 57.319 35.1633 57.319 40.2313C57.319 45.2981 53.1665 49.4068 48.0435 49.4068ZM50.8201 22.5652V14.4029C52.9739 13.3961 54.4829 11.241 54.4829 8.73956V8.55069C54.4829 5.09865 51.6275 2.27385 48.1379 2.27385H47.9484C44.4588 2.27385 41.6034 5.09865 41.6034 8.55069V8.73956C41.6034 11.241 43.1118 13.3973 45.2656 14.4035V22.5652C42.0593 23.0562 39.1294 24.3644 36.713 26.2899L14.0583 8.85587C14.2078 8.28804 14.3129 7.70332 14.3135 7.08858C14.3172 3.17939 11.1185 0.0050075 7.1655 4.53568e-06C3.21378 -0.0043731 0.00438212 3.16063 4.48785e-06 7.07107C-0.00437314 10.9809 3.1944 14.1553 7.14736 14.1596C8.435 14.1615 9.62758 13.7994 10.6726 13.2116L32.957 30.3624C31.0622 33.1922 29.9515 36.5817 29.9515 40.2313C29.9515 44.0517 31.1722 47.5857 33.2334 50.4924L26.4569 57.197C25.921 57.0375 25.3657 56.9268 24.7766 56.9268C21.529 56.9268 18.8956 59.5315 18.8956 62.744C18.8956 65.9578 21.529 68.5625 24.7766 68.5625C28.0247 68.5625 30.6575 65.9578 30.6575 62.744C30.6575 62.1631 30.5456 61.6127 30.3843 61.0824L37.0876 54.451C40.1306 56.748 43.9204 58.1288 48.0435 58.1288C58.0356 58.1288 66.1342 50.1153 66.1342 40.2313C66.1342 31.2829 59.4896 23.8904 50.8201 22.5652Z" fill="#FF7A59"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Create your own free forms</p>
                      <p className="text-xs text-gray-500">to generate leads from your website.</p>
                    </div>
                  </div>

                  {/* Vertical divider */}
                  <div className="hidden sm:block w-px h-14 bg-gray-300 mx-6"></div>

                  {/* Trust signals */}
                  <div className="text-sm text-gray-600 text-center sm:text-left flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span>⭐</span>
                      <span>We respond within 2 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>Same-day consultation calls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🚀</span>
                      <span>24-hour implementation guaranteed</span>
                    </div>
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
