import { Faq } from '@/components/integrations/LinkBlocks'
import { ui } from '@/components/integrations/labels'
import { ImpactPanel, resolveHref } from './IntegratingPIM'
import { ProseQuote } from './WhatIsPIM'

interface Step {
  title?: string
  description?: string
}

interface FAQItem {
  question?: string
  answer?: string
}

interface CombinedSectionData {
  choosingPim?: {
    title?: string
    description?: string
    leftColumnTitle?: string
    leftColumnDescription?: string
    selectionCriteria?: string[]
    impactParagraph1?: string
    impactParagraph2?: string
    linkText?: string
    linkSlug?: string | null
    linkHref?: string | null
  }
  gettingStarted?: {
    title?: string
    description?: string
    steps?: Step[]
    bottomNote?: string
  }
  faq?: {
    title?: string
    items?: FAQItem[]
  }
  transformExperience?: {
    title?: string
    paragraph1?: string
    paragraph2?: string
    quoteText?: string
  }
}

interface CombinedSectionProps {
  combinedSection?: CombinedSectionData
  lang?: string
}

/** Four blocks from one Sanity object: choosing a PIM, getting started, FAQ and the closing prose. */
export default function CombinedSection({ combinedSection, lang = 'no' }: CombinedSectionProps) {
  const isNo = lang === 'no'
  const choosingPim = combinedSection?.choosingPim
  const gettingStarted = combinedSection?.gettingStarted
  const faq = combinedSection?.faq
  const transformExperience = combinedSection?.transformExperience

  const steps = (gettingStarted?.steps ?? []).filter((s) => s?.title || s?.description)
  const faqItems = (faq?.items ?? []).filter((f): f is { question: string; answer: string } => !!f?.question && !!f?.answer)
  const stepCols = steps.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'

  return (
    <>
      {choosingPim && (
        <ImpactPanel
          eyebrow={isNo ? 'Velg riktig PIM' : 'Choosing a PIM'}
          title={choosingPim.title}
          description={choosingPim.description}
          leftTitle={choosingPim.leftColumnTitle}
          leftDescription={choosingPim.leftColumnDescription}
          points={choosingPim.selectionCriteria}
          impactTitle={isNo ? 'Effekten' : 'The impact'}
          impactParagraph1={choosingPim.impactParagraph1}
          impactParagraph2={choosingPim.impactParagraph2}
          linkText={choosingPim.linkText}
          href={resolveHref(choosingPim.linkSlug, choosingPim.linkHref)}
        />
      )}

      {gettingStarted && (gettingStarted.title || steps.length > 0) && (
        <section className="bg-white py-16 lg:py-20">
          <div className={`${ui.container} flex flex-col gap-10`}>
            <div className="flex max-w-[680px] flex-col gap-2.5">
              <div className={ui.eyebrow}>{isNo ? 'Kom i gang' : 'Getting started'}</div>
              {gettingStarted.title && <h2 className={ui.h2}>{gettingStarted.title}</h2>}
              {gettingStarted.description && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{gettingStarted.description}</p>}
            </div>
            {steps.length > 0 && (
              <ol className={`m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 ${stepCols} lg:gap-8`}>
                {steps.map((step, i) => (
                  <li key={i} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                    <span className={ui.mono}>{String(i + 1).padStart(2, '0')}</span>
                    {step.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{step.title}</h3>}
                    {step.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{step.description}</p>}
                  </li>
                ))}
              </ol>
            )}
            {gettingStarted.bottomNote && <p className="m-0 max-w-[760px] text-[15px] leading-relaxed text-sc-ink-500">{gettingStarted.bottomNote}</p>}
          </div>
        </section>
      )}

      {faqItems.length > 0 && <Faq heading={faq?.title || (isNo ? 'Vanlige spørsmål' : 'Frequently asked questions')} items={faqItems} />}

      {transformExperience && (
        <ProseQuote
          eyebrow={isNo ? 'Resultatet' : 'The result'}
          title={transformExperience.title}
          paragraphs={[transformExperience.paragraph1, transformExperience.paragraph2]}
          quote={transformExperience.quoteText ? { text: transformExperience.quoteText } : undefined}
        />
      )}
    </>
  )
}
