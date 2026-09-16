import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { PortableText } from '@/sanity'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { templatePageBySlugQuery } from '@/sanity/lib/templateQueries'
import { getLanguageFromParams } from '@/lib/language'
import { hrefFor, docHref } from '@/lib/routes'
import { sanityImg } from '@/lib/sanityImage'

/**
 * Renderer for the three SEO templates (SITE-SEO-ARCHITECTURE §7):
 * pillar, integration and migration pages. One component, three shapes.
 *
 * Structure (in order): H1 → 40–60 word definition → intro → template-specific
 * blocks → sections (with TOC) → FAQ → cluster links → related case studies →
 * CTA → related pages. JSON-LD (Service/Article, FAQPage, HowTo, Breadcrumb)
 * is emitted by `lib/seo/pageJsonLd.ts`.
 */

interface LinkDoc {
  _id: string
  _type: string
  language?: string | null
  slug?: string | null
  title?: string | null
  excerpt?: string | null
}

interface TemplateDoc {
  _id: string
  _type: 'pillarPage' | 'integrationPage' | 'migrationPage'
  _createdAt?: string
  _updatedAt?: string
  language: string
  pageTitle: string
  slug: string
  definition?: string
  intro?: unknown[]
  heroImage?: { url?: string; alt?: string } | null
  author?: { name?: string; role?: string; slug?: string; imageUrl?: string } | null
  integrationName?: string
  vendorUrl?: string
  whatItIs?: unknown[]
  whyItMatters?: unknown[]
  implementationSteps?: { name: string; text: string }[]
  dataFlow?: { url?: string; alt?: string } | null
  prerequisites?: string[]
  pricingSignal?: string
  namedClients?: string[]
  sourcePlatform?: string
  whatTransfers?: string[]
  whatDoesNot?: string[]
  timeline?: string
  risks?: unknown[]
  costBand?: string
  namedCase?: LinkDoc | null
  sections?: { _key: string; heading: string; anchor?: string; body?: unknown[] }[]
  faq?: { question: string; answer: string }[]
  cta?: { heading: string; text?: string; buttonLabel: string; buttonHref: string }
  pillar?: LinkDoc | null
  clusterLinks?: LinkDoc[] | null
  relatedPages?: LinkDoc[] | null
  relatedCaseStudies?: (LinkDoc & { industry?: string; heroImageUrl?: string })[] | null
  children?: LinkDoc[] | null
}

const T = {
  no: { toc: 'Innhold', faq: 'Vanlige spørsmål', cluster: 'Les også', children: 'Sider i denne serien', cases: 'Kundecaser', related: 'Relaterte sider', steps: 'Slik implementerer vi det', prereq: 'Forutsetninger', pricing: 'Pris', clients: 'Kunder som bruker dette', vendor: 'Gå til', whatIs: 'Hva det er', why: 'Hvorfor det betyr noe', transfers: 'Dette flyttes med', not: 'Dette flyttes ikke', timeline: 'Tidslinje', risks: 'Risiko og hvordan vi håndterer den', cost: 'Kostnad', namedCase: 'Slik gjorde vi det for', updated: 'Oppdatert', by: 'Av' },
  en: { toc: 'Contents', faq: 'Frequently asked questions', cluster: 'Read next', children: 'Pages in this cluster', cases: 'Case studies', related: 'Related pages', steps: 'How we implement it', prereq: 'Prerequisites', pricing: 'Pricing', clients: 'Clients using this', vendor: 'Go to', whatIs: 'What it is', why: 'Why it matters', transfers: 'What transfers', not: 'What does not transfer', timeline: 'Timeline', risks: 'Risks and how we handle them', cost: 'Cost', namedCase: 'How we did it for', updated: 'Updated', by: 'By' },
} as const

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function LinkList({ items, pageLanguage, heading }: { items?: LinkDoc[] | null; pageLanguage: string; heading: string }) {
  const list = (items ?? []).filter((i) => i && i.slug && i.title)
  if (!list.length) return null
  return (
    <section className="max-w-[880px] mx-auto px-5 lg:px-8 my-14">
      <h2 className="text-2xl font-bold text-sc-ink-900 mb-5">{heading}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((item) => {
          const cross = item.language && item.language !== pageLanguage
          return (
            <li key={item._id}>
              <Link
                href={hrefFor({ _type: item._type, slug: item.slug!, language: item.language ?? pageLanguage }, pageLanguage)}
                data-cross-locale={cross || undefined}
                className="block rounded-lg border border-sc-ink-100 p-4 hover:border-sc-cyan-500 transition-colors"
              >
                <span className="font-semibold text-sc-ink-900">{item.title}</span>
                {item.excerpt && <span className="block mt-1 text-sm text-sc-ink-600 line-clamp-2">{item.excerpt}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Bullets({ items, heading }: { items?: string[]; heading: string }) {
  if (!items?.length) return null
  return (
    <div>
      <h3 className="text-lg font-semibold text-sc-ink-900 mb-2">{heading}</h3>
      <ul className="list-disc pl-5 space-y-1 text-sc-ink-700">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  )
}

export default async function TemplatePage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang, slug } = await params
  const language = getLanguageFromParams({ lang })
  if (!slug) notFound()
  const doc = await sanityPageFetch<TemplateDoc | null>(templatePageBySlugQuery, { slug, language }, { next: { revalidate: 0 } })
  if (!doc) notFound()
  const t = language === 'no' ? T.no : T.en
  const sections = (doc.sections ?? []).map((s) => ({ ...s, id: s.anchor || slugify(s.heading) }))
  const updated = doc._updatedAt ? new Date(doc._updatedAt) : null
  const isNo = language === 'no'

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow bg-white">
        {/* Hero */}
        <header className="max-w-[880px] mx-auto px-5 lg:px-8 pt-14 lg:pt-20 pb-10">
          {doc.pillar?.slug && (
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-3">
              <Link href={docHref({ _type: doc.pillar._type, slug: doc.pillar.slug, language })}>{doc.pillar.title}</Link>
            </p>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-sc-ink-900 mb-6">{doc.pageTitle}</h1>
          {doc.definition && (
            <p className="text-lg lg:text-xl leading-relaxed text-sc-ink-700 max-w-[720px]" data-definition>
              {doc.definition}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sc-ink-500">
            {doc.author?.name && (
              <span>
                {t.by}{' '}
                {doc.author.slug ? (
                  <Link href={docHref({ _type: 'author', slug: doc.author.slug, language })} className="font-medium text-sc-ink-900 hover:text-sc-cyan-500">
                    {doc.author.name}
                  </Link>
                ) : (
                  <span className="font-medium text-sc-ink-900">{doc.author.name}</span>
                )}
                {doc.author.role ? `, ${doc.author.role}` : ''}
              </span>
            )}
            {updated && (
              <time dateTime={updated.toISOString()}>
                {t.updated} {updated.toLocaleDateString(isNo ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            )}
          </div>
          {doc._type === 'integrationPage' && doc.vendorUrl && (
            <p className="mt-4 text-sm">
              <a href={doc.vendorUrl} rel="noopener nofollow" target="_blank" className="text-sc-cyan-600 underline">
                {t.vendor} {doc.integrationName} →
              </a>
            </p>
          )}
        </header>

        {doc.heroImage?.url && (
          <div className="max-w-[1100px] mx-auto px-5 lg:px-8 mb-12">
            <Image
              src={sanityImg(doc.heroImage.url, 1600) as string}
              alt={doc.heroImage.alt ?? doc.pageTitle}
              width={1600}
              height={900}
              priority
              className="w-full h-auto rounded-[10px] object-cover"
            />
          </div>
        )}

        <article className="max-w-[880px] mx-auto px-5 lg:px-8 prose prose-lg prose-headings:tracking-[-0.02em] prose-a:text-sc-cyan-600">
          {Array.isArray(doc.intro) && doc.intro.length > 0 && <PortableText value={doc.intro} />}

          {/* Template-specific blocks */}
          {doc._type === 'integrationPage' && (
            <>
              {doc.whatItIs && (
                <section>
                  <h2 id="hva-det-er">{t.whatIs}</h2>
                  <PortableText value={doc.whatItIs} />
                </section>
              )}
              {doc.whyItMatters && (
                <section>
                  <h2 id="hvorfor">{t.why}</h2>
                  <PortableText value={doc.whyItMatters} />
                </section>
              )}
              {doc.implementationSteps?.length ? (
                <section>
                  <h2 id="implementering">{t.steps}</h2>
                  <ol>
                    {doc.implementationSteps.map((s) => (
                      <li key={s.name}>
                        <strong>{s.name}.</strong> {s.text}
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
              {doc.dataFlow?.url && (
                <figure>
                  <Image src={sanityImg(doc.dataFlow.url, 1400) as string} alt={doc.dataFlow.alt ?? ''} width={1400} height={800} className="w-full h-auto" />
                  {doc.dataFlow.alt && <figcaption>{doc.dataFlow.alt}</figcaption>}
                </figure>
              )}
              <div className="not-prose grid gap-8 sm:grid-cols-2 my-10">
                <Bullets items={doc.prerequisites} heading={t.prereq} />
                <div>
                  {doc.pricingSignal && (
                    <>
                      <h3 className="text-lg font-semibold text-sc-ink-900 mb-2">{t.pricing}</h3>
                      <p className="text-sc-ink-700">{doc.pricingSignal}</p>
                    </>
                  )}
                  {doc.namedClients?.length ? (
                    <>
                      <h3 className="text-lg font-semibold text-sc-ink-900 mt-6 mb-2">{t.clients}</h3>
                      <p className="text-sc-ink-700">{doc.namedClients.join(', ')}</p>
                    </>
                  ) : null}
                </div>
              </div>
            </>
          )}

          {doc._type === 'migrationPage' && (
            <>
              <div className="not-prose grid gap-8 sm:grid-cols-2 my-10">
                <Bullets items={doc.whatTransfers} heading={t.transfers} />
                <Bullets items={doc.whatDoesNot} heading={t.not} />
                {doc.timeline && (
                  <div>
                    <h3 className="text-lg font-semibold text-sc-ink-900 mb-2">{t.timeline}</h3>
                    <p className="text-sc-ink-700">{doc.timeline}</p>
                  </div>
                )}
                {doc.costBand && (
                  <div>
                    <h3 className="text-lg font-semibold text-sc-ink-900 mb-2">{t.cost}</h3>
                    <p className="text-sc-ink-700">{doc.costBand}</p>
                  </div>
                )}
              </div>
              {doc.risks && (
                <section>
                  <h2 id="risiko">{t.risks}</h2>
                  <PortableText value={doc.risks} />
                </section>
              )}
              {doc.namedCase?.slug && (
                <p>
                  {t.namedCase}{' '}
                  <Link href={hrefFor({ _type: doc.namedCase._type, slug: doc.namedCase.slug, language: doc.namedCase.language ?? language }, language)} data-cross-locale={doc.namedCase.language && doc.namedCase.language !== language ? true : undefined}>
                    {doc.namedCase.title}
                  </Link>
                </p>
              )}
            </>
          )}

          {/* TOC */}
          {sections.length > 2 && (
            <nav aria-label={t.toc} className="not-prose my-10 rounded-lg bg-sc-ink-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-sc-ink-500 mb-3">{t.toc}</p>
              <ol className="space-y-1 text-sc-ink-700">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="hover:text-sc-cyan-600">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {sections.map((s) => (
            <section key={s._key} id={s.id}>
              <h2>{s.heading}</h2>
              {Array.isArray(s.body) && <PortableText value={s.body} />}
            </section>
          ))}

          {/* FAQ */}
          {doc.faq?.length ? (
            <section id="faq">
              <h2>{t.faq}</h2>
              {doc.faq.map((f) => (
                <details key={f.question} className="group border-b border-sc-ink-100 py-3" open>
                  <summary className="cursor-pointer font-semibold text-sc-ink-900">
                    <h3 className="inline text-lg m-0">{f.question}</h3>
                  </summary>
                  <p className="mt-2 text-sc-ink-700">{f.answer}</p>
                </details>
              ))}
            </section>
          ) : null}
        </article>

        <LinkList items={doc.children} pageLanguage={language} heading={t.children} />
        <LinkList items={doc.clusterLinks} pageLanguage={language} heading={t.cluster} />
        <LinkList items={doc.relatedCaseStudies as LinkDoc[] | undefined} pageLanguage={language} heading={t.cases} />

        {doc.cta && (
          <section className="max-w-[880px] mx-auto px-5 lg:px-8 my-16">
            <div className="rounded-[10px] bg-sc-ink-950 text-white p-8 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">{doc.cta.heading}</h2>
              {doc.cta.text && <p className="text-[#d6dade] mb-6 max-w-[560px]">{doc.cta.text}</p>}
              <Link href={doc.cta.buttonHref} className="inline-flex items-center rounded-lg bg-sc-cyan-500 hover:bg-sc-cyan-600 px-6 py-3 font-semibold text-white transition-colors">
                {doc.cta.buttonLabel}
              </Link>
            </div>
          </section>
        )}

        <LinkList items={doc.relatedPages} pageLanguage={language} heading={t.related} />
      </main>
      <FooterWrapper />
    </div>
  )
}
