interface NewsletterCtaData {
  title?: string
  description?: string
  emailPlaceholder?: string
  buttonText?: string
}

import NewsletterForm from '@/components/ui/NewsletterForm'

interface GetShopifyInsitesDeliveredProps {
  newsletterCta?: NewsletterCtaData
}

export default function GetShopifyInsitesDelivered({ newsletterCta }: GetShopifyInsitesDeliveredProps) {
  const title = newsletterCta?.title || 'One email a month. No tracking, no fluff — just what we shipped and what we learned.'
  const description = newsletterCta?.description
  const emailPlaceholder = newsletterCta?.emailPlaceholder || 'din@epost.no'
  const buttonText = newsletterCta?.buttonText || 'SUBSCRIBE'

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-14">
      <div className="section_container mx-auto page-padding-x">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Left: copy */}
          <div className="max-w-xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#11848C] mb-3">
              Notes from the studio
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#1F1D1D] leading-snug" style={{ letterSpacing: '-0.01em' }}>
              {title}
            </h3>
            {description && (
              <p className="mt-3 text-sm md:text-base text-[#4A4A4A] leading-relaxed">{description}</p>
            )}
          </div>

          {/* Right: form */}
          <NewsletterForm
            source="blog"
            emailPlaceholder={emailPlaceholder}
            buttonText={buttonText}
          />
        </div>
      </div>
    </section>
  )
}
