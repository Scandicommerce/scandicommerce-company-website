import Image from 'next/image'
import { ui } from '@/components/integrations/labels'
import { SHOPIFY_T, shopifyLang } from '@/components/sections/shopify/shared/labels'

interface CaseStudy {
  clientName?: string
  heading?: string
  description?: string
  imageUrl?: string
}

interface SuccessStoriesData {
  title?: string
  subtitle?: string
  caseStudies?: CaseStudy[]
}

interface SuccessStoriesProps {
  successStories?: SuccessStoriesData
  lang?: string
}

/** Case studies as hairline cards: image, mono client name, heading, text. */
export default function SuccessStories({ successStories, lang }: SuccessStoriesProps) {
  const t = SHOPIFY_T[shopifyLang(lang)]
  const title = successStories?.title
  const subtitle = successStories?.subtitle
  const caseStudies = (successStories?.caseStudies ?? []).filter((c) => c?.clientName || c?.heading || c?.description)
  if (!title && caseStudies.length === 0) return null

  return (
    <section id="kundecaser" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{t.casesEyebrow}</div>
          {title && <h2 className={ui.h2}>{title}</h2>}
          {subtitle && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{subtitle}</p>}
        </div>

        {caseStudies.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {caseStudies.map((study, index) => (
              <article key={index} className="flex flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white transition-transform hover:-translate-y-1">
                <div className="relative aspect-[4/3] w-full bg-sc-ink-50">
                  {study.imageUrl && (
                    <Image src={study.imageUrl} alt={study.clientName || ''} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-6">
                  {study.clientName && <div className={ui.mono}>{study.clientName}</div>}
                  {study.heading && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{study.heading}</h3>}
                  {study.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{study.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
