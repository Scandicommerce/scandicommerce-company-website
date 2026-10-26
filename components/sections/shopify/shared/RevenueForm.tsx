import Image from 'next/image'
import { ui } from '@/components/integrations/labels'
import HubSpotFormEmbed from './HubSpotFormEmbed'
import { SHOPIFY_T, shopifyLang } from './labels'

export interface RevenueFormData {
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
  data?: RevenueFormData
  /** HubSpot form id; differs between the platform and POS pages. */
  formId: string
  portalId?: string
  lang?: string
  eyebrow?: string
  id?: string
}

/**
 * "Revenue form" for the platform and POS pages: heading and testimonial on
 * the left, the HubSpot form in a hairline card on the right.
 */
export default function RevenueForm({ data, formId, portalId, lang, eyebrow, id }: RevenueFormProps) {
  const t = SHOPIFY_T[shopifyLang(lang)]
  const testimonial = data?.testimonial
  // Editors often paste the quote with its own quotation marks; keep one pair.
  const quote = testimonial?.quote?.trim().replace(/^["\u201c\u201d']+|["\u201c\u201d']+$/g, '')
  const hasTestimonial = Boolean(quote || testimonial?.authorName)
  const form = data?.form

  return (
    <section id={id ?? 'kontakt-skjema'} className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16`}>
        <div className="flex flex-col gap-8">
          <div className="flex max-w-[560px] flex-col gap-2.5">
            <div className={ui.eyebrow}>{eyebrow ?? t.formEyebrow}</div>
            {data?.title && <h2 className={ui.h2}>{data.title}</h2>}
            {data?.subtitle && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{data.subtitle}</p>}
          </div>

          {hasTestimonial && (
            <figure className="m-0 flex flex-col gap-5 rounded-lg border border-sc-ink-100 bg-white p-6">
              {quote && <blockquote className="m-0 text-[17px] leading-relaxed text-sc-ink-700">&ldquo;{quote}&rdquo;</blockquote>}
              {(testimonial?.authorName || testimonial?.authorRole || testimonial?.authorCompany) && (
                <figcaption className="flex items-center gap-3">
                  {testimonial?.authorImageUrl && (
                    <Image
                      src={testimonial.authorImageUrl}
                      alt={testimonial.authorName || ''}
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div className="flex min-w-0 flex-col">
                    {testimonial?.authorName && <span className="text-sm font-semibold text-sc-ink-900">{testimonial.authorName}</span>}
                    {(testimonial?.authorRole || testimonial?.authorCompany) && (
                      <span className="text-sm text-sc-ink-500">
                        {[testimonial?.authorRole, testimonial?.authorCompany].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                </figcaption>
              )}
            </figure>
          )}
        </div>

        <div className="flex flex-col gap-6 rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-8">
          {(form?.formTitle || form?.formSubtitle || form?.formDescription) && (
            <div className="flex flex-col gap-2">
              {form?.formSubtitle && <div className={ui.mono}>{form.formSubtitle}</div>}
              {form?.formTitle && <h3 className="m-0 text-[24px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[28px]">{form.formTitle}</h3>}
              {form?.formDescription && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{form.formDescription}</p>}
            </div>
          )}
          <HubSpotFormEmbed formId={formId} portalId={portalId} />
        </div>
      </div>
    </section>
  )
}
