import NewsletterForm from '@/components/ui/NewsletterForm'
import { ui } from '@/components/integrations/labels'

interface NewsletterCtaData {
  title?: string
  description?: string
  emailPlaceholder?: string
  buttonText?: string
}

interface GetShopifyInsitesDeliveredProps {
  newsletterCta?: NewsletterCtaData
  lang?: string
}

/** Newsletter band under the blog archive: copy left, hairline form right. */
export default function GetShopifyInsitesDelivered({ newsletterCta, lang }: GetShopifyInsitesDeliveredProps) {
  const isNorwegian = lang === 'no'
  const title = newsletterCta?.title || (isNorwegian ? 'Én e-post i måneden. Det vi sendte og det vi lærte.' : 'One email a month. What we shipped and what we learned.')
  const description = newsletterCta?.description
  const emailPlaceholder = newsletterCta?.emailPlaceholder || 'din@epost.no'
  const buttonText = newsletterCta?.buttonText || (isNorwegian ? 'Meld meg på' : 'Subscribe')
  const eyebrow = isNorwegian ? 'Nyhetsbrev' : 'Newsletter'

  return (
    <section className="border-t border-sc-ink-100 bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center`}>
        <div className="flex max-w-[560px] flex-col gap-3">
          <div className={ui.eyebrow}>{eyebrow}</div>
          <h2 className="m-0 text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-sc-ink-900 lg:text-[28px]">{title}</h2>
          {description && <p className="m-0 text-base leading-relaxed text-sc-ink-600">{description}</p>}
        </div>
        <NewsletterForm
          source="blog"
          emailPlaceholder={emailPlaceholder}
          buttonText={buttonText}
          successText={isNorwegian ? 'Takk! Du er meldt på.' : 'Thanks! You are signed up.'}
          className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
          inputClassName="min-h-[46px] flex-1 rounded-lg border border-sc-ink-200 bg-white px-4 py-3 text-sm text-sc-ink-900 placeholder:text-sc-ink-400 focus:border-sc-ink-900 focus:outline-none sm:w-72"
          buttonClassName={`${ui.btnPrimary} whitespace-nowrap`}
        />
      </div>
    </section>
  )
}
