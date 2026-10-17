import Image from 'next/image'
import { Article } from '@/lib/articles'
import { ui } from '@/components/integrations/labels'
import TableOfContents from './TableOfContents'

interface ArticleContentProps {
  article: Article
  lang?: string
}

const PRO_TIP: Record<string, string> = { no: 'Tips', en: 'Pro tip' }

const BODY = 'text-[17px] leading-[1.7] text-sc-ink-600 [&_a]:text-sc-cyan-600 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-sc-ink-900'

/**
 * Article body on the case-study page rhythm: hero image in a hairline frame,
 * the table of contents sticky beside a 720px reading column, sections with
 * the body type scale, tips as cyan panels and app picks as hairline cards.
 */
export default function ArticleContent({ article, lang = 'no' }: ArticleContentProps) {
  const image = article.featuredImage || article.image
  const hasToc = article.tableOfContents.length > 0

  return (
    <section className="bg-white pb-16 lg:pb-20">
      {image && (
        <div className={`${ui.container} mb-12 lg:mb-16`}>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
            <Image src={image} alt={article.title} fill priority className="object-cover" sizes="(max-width: 1100px) 100vw, 1036px" />
          </div>
        </div>
      )}

      <div className={`${ui.container} grid grid-cols-1 gap-10 ${hasToc ? 'lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14' : ''}`}>
        {hasToc && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <TableOfContents items={article.tableOfContents} lang={lang} />
          </aside>
        )}

        <div className="flex max-w-[720px] flex-col gap-10">
          {article.introduction && <p className="m-0 text-[19px] leading-[1.6] text-sc-ink-900 lg:text-[21px]">{article.introduction}</p>}

          {article.sections.map((section, index) => (
            <div key={section.id || index} id={section.id} className="flex scroll-mt-24 flex-col gap-5">
              {section.title && <h2 className="m-0 text-[24px] font-bold leading-snug tracking-[-0.02em] text-sc-ink-900 md:text-[28px]">{section.title}</h2>}

              {section.content && <p className={`m-0 whitespace-pre-line ${BODY}`}>{section.content}</p>}

              {section.proTip && (
                <aside className="rounded-lg bg-sc-cyan-50 p-6 lg:p-8">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-700">{PRO_TIP[lang] ?? PRO_TIP.en}</div>
                  {section.proTip.title && <h3 className="m-0 mb-2 text-lg font-bold leading-snug text-sc-ink-900">{section.proTip.title}</h3>}
                  <p className="m-0 text-base leading-relaxed text-sc-ink-700">{section.proTip.content}</p>
                </aside>
              )}

              {section.apps && section.apps.length > 0 && (
                <ol className="m-0 flex list-none flex-col gap-4 p-0">
                  {section.apps.map((app, appIndex) => (
                    <li key={`${app.name}-${appIndex}`} className="flex flex-col gap-3.5 rounded-lg border border-sc-ink-100 bg-white p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="m-0 flex items-baseline gap-3 text-lg font-bold leading-snug text-sc-ink-900">
                          <span className="font-mono text-[13px] font-medium text-sc-ink-400">{String(appIndex + 1).padStart(2, '0')}</span>
                          {app.name}
                        </h3>
                        {app.category && <span className={ui.tag}>{app.category}</span>}
                      </div>
                      {app.description && <p className="m-0 text-base leading-relaxed text-sc-ink-600">{app.description}</p>}
                      {app.features.length > 0 && (
                        <ul className="m-0 flex list-none flex-col gap-2 p-0">
                          {app.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-sc-ink-700">
                              <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sc-cyan-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
