'use client'

import React, { useState } from 'react'
import Image from 'next/image'

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title */}
            <div className="text-center mb-10">
              {title && (
                <h2 className="text-3xl lg:text-4xl xl:text-[42px] font-bold text-white mb-4">
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl lg:w-[75%] mx-auto bg-white shadow-2xl px-8 py-10 lg:px-12 lg:py-12">
              {/* Form header */}
              <div className="text-center mb-10">
                {form?.formTitle && (
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {form.formTitle}
                  </h3>
                )}
                {form?.formSubtitle && (
                  <p className="text-gray-400 text-sm mb-4">
                    {form.formSubtitle}
                  </p>
                )}
                {form?.formDescription && (
                  <p className="text-gray-600 text-sm">
                    {form.formDescription}
                  </p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* First Name / Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-[#00BFC8] bg-transparent text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-[#00BFC8] bg-transparent text-gray-900"
                    />
                  </div>
                </div>

                {/* Email / Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-[#00BFC8] bg-transparent text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Mobile Phone Number*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-[#00BFC8] bg-transparent text-gray-900"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="mb-8 sm:w-1/2">
                  <label className="block text-sm text-gray-700 mb-2">
                    Company name*
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-[#00BFC8] bg-transparent text-gray-900"
                  />
                </div>

                {/* reCAPTCHA and Privacy */}
                <div className="flex flex-col sm:flex-row items-start gap-8 mb-10">
                  {/* reCAPTCHA badge */}
                  <div className="flex items-stretch flex-shrink-0">
                    <div className="bg-[#1A9FD9] px-6 py-4">
                      <p className="font-bold text-white text-base">protected by reCAPTCHA</p>
                      <p className="text-sm text-[#00E5CC]">Privacy - Terms</p>
                    </div>
                    <div className="bg-[#F5F5F5] px-5 flex items-center justify-center">
                      <Image
                        src="/images/shopify/shopify_platform/RecaptchaLogo.svg 1.png"
                        alt="reCAPTCHA"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>

                  {/* Privacy text */}
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">
                    scandicommerce.no needs the contact information you provide to us to contact you about our products and services. You may unsubscribe from these communications at any time. For information on how to unsubscribe, as well as our privacy practices and commitment to protecting your privacy, please review our Privacy Policy.
                  </p>
                </div>

                {/* Submit button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full sm:w-[70%] lg:w-[60%] bg-[#00BFC8] text-white py-4 px-6 font-semibold text-lg hover:bg-[#00A8B0] transition-colors"
                  >
                    {form?.submitButtonText || 'Submit'}
                  </button>
                </div>
              </form>

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
