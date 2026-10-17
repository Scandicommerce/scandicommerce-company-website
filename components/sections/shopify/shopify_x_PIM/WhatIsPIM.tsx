import { ui } from '@/components/integrations/labels'

interface Quote {
  text?: string
  author?: string
}

interface ProseQuoteProps {
  eyebrow?: string
  title?: string
  paragraphs?: Array<string | undefined>
  quote?: Quote
  tone?: 'white' | 'ink'
}

/** Heading on the left, prose and an optional quote on the right: the "what it is" block on the integrations pages. */
export function ProseQuote({ eyebrow, title, paragraphs, quote, tone = 'white' }: ProseQuoteProps) {
  const copy = (paragraphs ?? []).filter((p): p is string => !!p)
  if (!title && copy.length === 0 && !quote?.text) return null
  return (
    <section className={`${tone === 'ink' ? 'bg-sc-ink-50' : 'bg-white'} py-16 lg:py-20`}>
      <div className={`${ui.container} grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
        <div className="flex flex-col gap-2.5">
          {eyebrow && <div className={ui.eyebrow}>{eyebrow}</div>}
          {title && <h2 className={ui.h2}>{title}</h2>}
        </div>
        <div className="flex flex-col gap-5">
          {copy.map((p, i) => (
            <p key={i} className="m-0 text-base leading-relaxed text-sc-ink-600 lg:text-lg">
              {p}
            </p>
          ))}
          {quote?.text && (
            <figure className="m-0 mt-2 rounded-lg border border-sc-ink-100 border-l-2 border-l-sc-cyan-500 bg-sc-ink-50 p-6">
              <blockquote className="m-0 text-lg leading-relaxed text-sc-ink-900">&ldquo;{quote.text}&rdquo;</blockquote>
              {quote.author && <figcaption className={`mt-3 ${ui.mono}`}>&mdash; {quote.author}</figcaption>}
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}

interface WhatIsPimData {
  title?: string
  paragraph1?: string
  paragraph2?: string
  quote?: Quote
}

export default function WhatIsPIM({ whatIsPim, lang = 'no' }: { whatIsPim?: WhatIsPimData; lang?: string }) {
  return (
    <ProseQuote
      eyebrow={lang === 'no' ? 'Hva PIM er' : 'What PIM is'}
      title={whatIsPim?.title}
      paragraphs={[whatIsPim?.paragraph1, whatIsPim?.paragraph2]}
      quote={whatIsPim?.quote}
    />
  )
}
