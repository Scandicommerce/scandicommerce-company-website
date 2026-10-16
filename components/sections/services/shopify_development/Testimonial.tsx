import Link from 'next/link'
import { ui } from '@/components/integrations/labels'

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

/** One customer quote in a hairline card. */
export default function Testimonial({ testimonial }: TestimonialProps) {
  const rating = testimonial?.testimonialRating || 5
  const quote = testimonial?.testimonialQuote
  const authorName = testimonial?.testimonialAuthorName
  const authorTitle = testimonial?.testimonialAuthorTitle
  const buttonText = testimonial?.testimonialButtonText
  const buttonLink = testimonial?.testimonialButtonLink

  if (!quote) return null

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <figure className="m-0 flex flex-col gap-8 rounded-lg border border-sc-ink-100 bg-white p-7 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:p-10">
          <div className="flex max-w-[760px] flex-col gap-5">
            <div className={ui.eyebrow}>Kundeomtale</div>
            <div className="flex items-center gap-1" aria-label={`${rating} av 5 stjerner`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`h-4 w-4 ${star <= rating ? 'text-sc-ink-900' : 'text-sc-ink-200'}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="m-0 text-[20px] font-medium leading-snug tracking-[-0.01em] text-sc-ink-900 lg:text-[24px]">“{quote}”</blockquote>
            {(authorName || authorTitle) && (
              <figcaption className="text-[15px] text-sc-ink-600">
                {authorName && <span className="font-semibold text-sc-ink-900">{authorName}</span>}
                {authorName && authorTitle && ' · '}
                {authorTitle}
              </figcaption>
            )}
          </div>
          {buttonText && buttonLink && (
            <Link href={buttonLink} className={`${ui.btnPrimary} shrink-0 no-underline`}>
              {buttonText}
            </Link>
          )}
        </figure>
      </div>
    </section>
  )
}
