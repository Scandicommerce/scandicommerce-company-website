import NewsletterForm from '@/components/ui/NewsletterForm'
import { normalizeVariant } from '@/lib/hubspot'

/** Fields of the Sanity `newsletterSignup` object. */
export interface NewsletterSignupData {
  variant?: string | null
  overskrift?: string | null
  undertekst?: string | null
  buttonText?: string | null
  successMessage?: string | null
}

interface NewsletterSignupBlockProps {
  data: NewsletterSignupData
  language?: string | null
}

/**
 * The reusable signup block for landing pages (`section`) and articles (`inline`).
 * The footer renders its own layout around the same <NewsletterForm />.
 */
export default function NewsletterSignupBlock({
  data,
  language,
}: NewsletterSignupBlockProps) {
  const variant = normalizeVariant(data.variant)
  const isNorwegian = language === 'no'
  const heading =
    data.overskrift ||
    (isNorwegian
      ? 'Meld deg på vårt nyhetsbrev'
      : 'Subscribe to our newsletter')

  const form = (
    <NewsletterForm
      variant={variant === 'footer' ? 'inline' : variant}
      language={language}
      buttonText={data.buttonText}
      successText={data.successMessage}
    />
  )

  if (variant === 'section') {
    return (
      <section className="border-y border-sc-ink-100 bg-sc-ink-50 py-14 lg:py-20">
        <div className="section_container mx-auto page-padding-x flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex max-w-[560px] flex-col gap-3">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-sc-cyan-600">
              {isNorwegian ? 'Nyhetsbrev' : 'Newsletter'}
            </div>
            <h2 className="m-0 text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-sc-ink-900 lg:text-[28px]">
              {heading}
            </h2>
            {data.undertekst && (
              <p className="m-0 text-base leading-relaxed text-sc-ink-600">
                {data.undertekst}
              </p>
            )}
          </div>
          <div className="w-full lg:max-w-[460px]">{form}</div>
        </div>
      </section>
    )
  }

  return (
    <aside className="rounded-xl border border-sc-ink-100 bg-sc-ink-50 p-5 sm:p-6">
      <h3 className="m-0 text-[18px] font-bold leading-snug text-sc-ink-900">
        {heading}
      </h3>
      {data.undertekst && (
        <p className="m-0 mt-1.5 text-[15px] leading-relaxed text-sc-ink-600">
          {data.undertekst}
        </p>
      )}
      <div className="mt-4">{form}</div>
    </aside>
  )
}
