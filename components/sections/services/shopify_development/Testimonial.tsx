'use client'

import Link from 'next/link'

interface TestimonialData {
  testimonialRating?: number
  testimonialQuote?: string
  testimonialAuthorName?: string
  testimonialAuthorTitle?: string
  testimonialButtonText?: string
  testimonialButtonLink?: string
}

interface TestimonialProps {
  testimonial?: TestimonialData
}

export default function Testimonial({ testimonial }: TestimonialProps) {
  // Content variables from Sanity
  const rating = testimonial?.testimonialRating || 5
  const quote = testimonial?.testimonialQuote
  const authorName = testimonial?.testimonialAuthorName
  const authorTitle = testimonial?.testimonialAuthorTitle
  const buttonText = testimonial?.testimonialButtonText
  const buttonLink = testimonial?.testimonialButtonLink

  return (
    <section className="bg-[#F8F8F8] py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg sm:rounded-xl p-5 sm:p-8 lg:p-12 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8 lg:gap-10">
            {/* Left Content */}
            <div className="flex-1">
              {/* Star Rating */}
              <div className="flex items-center gap-0.5 sm:gap-1 mb-4 sm:mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      star <= rating ? 'text-amber-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              {quote && (
                <p className="text-gray-600 text-sm sm:text-lg lg:text-xl leading-relaxed mb-5 sm:mb-8">
                  &quot;{quote}&quot;
                </p>
              )}

              {/* Author */}
              {(authorName || authorTitle) && (
                <div>
                  {authorName && (
                    <p className="font-bold text-gray-900 text-base sm:text-lg">
                      {authorName}
                    </p>
                  )}
                  {authorTitle && (
                    <p className="text-gray-500 text-sm sm:text-base">
                      {authorTitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Content - Button */}
            {buttonText && buttonLink && (
              <div className="lg:flex-shrink-0">
                <Link
                  href={buttonLink}
                  className="inline-block w-full sm:w-auto text-center bg-[#03C1CA] hover:bg-[#02a9b1] text-white font-semibold py-3 sm:py-4 px-8 sm:px-10 transition-colors duration-200"
                >
                  {buttonText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
