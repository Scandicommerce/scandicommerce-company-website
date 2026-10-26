import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { PortableText } from '@/sanity'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { templatePageBySlugQuery } from '@/sanity/lib/templateQueries'
import { getLanguageFromParams } from '@/lib/language'
import { hrefFor, publicPath } from '@/lib/routes'
import { sanityImg, sanityImgSize } from '@/lib/sanityImage'
import { CapabilityMatrix, DataFlowLegend, type FlowStep, type FlowSystem } from '@/components/integrations/DataFlow'
import DataFlowAnimation from '@/components/integrations/DataFlowAnimation'
import { Breadcrumb, CtaBand, Faq, LinkList, type LinkDoc } from '@/components/integrations/LinkBlocks'
import { DIRECTION_LABEL, METHOD_LABEL, STATUS_LABEL, T, lang, ui } from '@/components/integrations/labels'

/**
 * Integration detail page (/integrasjoner/<vendor>). Order of sections follows
 * the design brief: breadcrumb and hero → data flow → what it is and why →
 * capability matrix → implementation steps → prerequisites and named clients →
 * long-form sections with TOC → case studies → FAQ → related integrations →
 * CTA → read next. JSON-LD comes from lib/seo/pageJsonLd.ts as before.
 */

interface IntegrationDoc {
  _id: string
  _type: 'integrationPage'
  _updatedAt?: string
  language: string
  pageTitle: string
  slug: string
  definition?: string
  intro?: unknown[]
  heroImage?: { url?: string; alt?: string } | null
  author?: { name?: string; role?: string; slug?: string } | null
  integrationName?: string
  vendorUrl?: string
  whatItIs?: unknown[]
  whyItMatters?: unknown[]
  implementationSteps?: { name: string; text: string }[]
  dataFlow?: { url?: string; alt?: string } | null
  prerequisites?: string[]
  namedClients?: string[]
  logo?: { url?: string; alt?: string } | null
  category?: { _id: string; title: string; key: string; slug: string } | null
  shortDescription?: string
  integrationMethod?: 'make' | 'code' | 'app' | 'connector'
  status?: 'live' | 'pilot'
  syncDirection?: 'one-way' | 'two-way'
  capabilities?: string[]
  notIncluded?: string[]
  systems?: FlowSystem[]
  dataFlowSteps?: FlowStep[]
  sections?: { _key: string; heading: string; anchor?: string; body: unknown[] }[]
  faq?: { question: string; answer: string }[]
  cta?: { heading: string; text?: string; buttonLabel: string; buttonHref: string }
  pillar?: LinkDoc | null
  clusterLinks?: LinkDoc[] | null
  relatedPages?: LinkDoc[] | null
  relatedCaseStudies?: { _id: string; _type: string; language?: string; title?: string; slug?: string; excerpt?: string; industry?: string; heroImageUrl?: string }[] | null
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default async function IntegrationDetailPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang: langParam, slug } = await params
  const language = getLanguageFromParams({ lang: langParam })
  if (!slug) notFound()
  const doc = await sanityPageFetch<IntegrationDoc | null>(templatePageBySlugQuery, { slug, language }, { next: { revalidate: 0 } })
  if (!doc || doc._type !== 'integrationPage') notFound()

  const l = lang(language)
  const t = T[l]
  const isNo = l === 'no'
  const updated = doc._updatedAt ? new Date(doc._updatedAt) : null
  const steps = doc.dataFlowSteps ?? []
  const systems = doc.systems ?? []
  const sections = (doc.sections ?? []).map((s) => ({ ...s, id: s.anchor || slugify(s.heading) }))
  const method = doc.integrationMethod ? METHOD_LABEL[doc.integrationMethod]?.[l] : null
  const direction = doc.syncDirection ? DIRECTION_LABEL[doc.syncDirection]?.[l] : null
  const pillarHref = doc.pillar?.slug ? hrefFor({ _type: 'pillarPage', slug: doc.pillar.slug, language }, language) : publicPath(language, isNo ? 'integrasjoner' : 'integrations')
  const crumbs = [
    { label: t.pillarCrumb, href: pillarHref },
    ...(doc.category ? [{ label: doc.category.title, href: hrefFor({ _type: 'integrationCategory', slug: doc.category.slug, language }, language) }] : []),
    { label: doc.integrationName ?? doc.pageTitle },
  ]
  const toc = [
    { id: 'hva-det-er', label: t.whatIs, show: !!doc.whatItIs },
    { id: 'hvorfor', label: t.why, show: !!doc.whyItMatters },
    { id: 'kapabiliteter', label: t.whatFlows, show: steps.length > 0 },
    { id: 'implementering', label: t.steps, show: !!doc.implementationSteps?.length },
    { id: 'forutsetninger', label: t.prereq, show: !!doc.prerequisites?.length },
    ...sections.map((s) => ({ id: s.id, label: s.heading, show: true })),
    { id: 'faq', label: t.faq, show: !!doc.faq?.length },
  ].filter((i) => i.show)

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white text-sc-ink-900">
        {/* 1 + 2: breadcrumb and hero */}
        <section className={`${ui.container} pb-14 pt-12`}>
          <Breadcrumb items={crumbs} />
          <div className="mt-6 grid items-start gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
            <div className="flex flex-col gap-[18px]">
              <div className="flex flex-wrap items-center gap-4">
                {doc.logo?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doc.logo.url} alt={doc.logo.alt ?? doc.integrationName ?? ''} {...sanityImgSize(doc.logo.url)} className="h-9 w-auto max-w-[200px] object-contain object-left" />
                )}
                {doc.category && <div className={ui.eyebrow}>{doc.category.title}</div>}
              </div>
              <h1 className="text-[40px] font-bold leading-[1.02] tracking-[-0.028em] lg:text-[56px]">{doc.pageTitle}</h1>
              {doc.definition && <p className="text-lg leading-7 text-sc-ink-600">{doc.definition}</p>}
              <div className="text-sm text-sc-ink-500">
                {doc.author?.name && (
                  <>
                    {t.by} <span className="font-medium text-sc-ink-900">{doc.author.name}</span>
                    {doc.author.role ? `, ${doc.author.role}` : ''}
                  </>
                )}
                {updated && (
                  <>
                    {' · '}
                    {t.updated} <time dateTime={updated.toISOString()}>{updated.toLocaleDateString(isNo ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  </>
                )}
                {doc.vendorUrl && (
                  <>
                    {' · '}
                    <a href={doc.vendorUrl} rel="noopener nofollow" target="_blank" className="text-sc-cyan-700 underline">
                      {t.vendor} {doc.integrationName} →
                    </a>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {method && <span className={ui.tag}>{method}</span>}
                {doc.status === 'pilot' && <span className={ui.tagOutline}>{STATUS_LABEL.pilot[l]}</span>}
                {direction && (
                  <span className={ui.tagOutline}>
                    {direction}
                    {steps[0] ? ` · ${steps[0].from} ${doc.syncDirection === 'two-way' ? '⇄' : '→'} ${steps[0].to}` : ''}
                  </span>
                )}
              </div>
            </div>
            <aside className="flex flex-col gap-4 rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-7">
              {doc.prerequisites?.length ? (
                <>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">{t.prereq}</div>
                  <ul className="flex flex-col gap-2.5 text-[15px] leading-relaxed text-sc-ink-600">
                    {doc.prerequisites.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="font-semibold text-sc-cyan-500">—</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {doc.cta && (
                <Link href={doc.cta.buttonHref} className={ui.btnPrimary}>
                  {doc.cta.buttonLabel}
                </Link>
              )}
            </aside>
          </div>
        </section>

        {/* 3: data flow poster + legend */}
        {(steps.length > 0 || doc.dataFlow?.url) && (
          <section className={`${ui.container} pb-16`}>
            {steps.length > 0 ? (
              <DataFlowAnimation
                variant={doc.integrationMethod === 'make' ? 'make' : doc.integrationMethod === 'code' ? 'code' : 'direct'}
                systems={systems}
                steps={steps}
                language={language}
                twoWay={doc.syncDirection === 'two-way'}
                vendorName={doc.integrationName}
                vendorLogoUrl={doc.logo?.url}
              />
            ) : (
              doc.dataFlow?.url && <Image src={sanityImg(doc.dataFlow.url, 1400) as string} alt={doc.dataFlow.alt ?? ''} width={1400} height={800} className="h-auto w-full rounded-lg" />
            )}
            <div className="mt-5">
              <DataFlowLegend steps={steps} language={language} />
            </div>
          </section>
        )}

        {/* 4: what it is / why it matters */}
        {(doc.whatItIs || doc.whyItMatters) && (
          <section className={`${ui.container} grid gap-12 pb-16 lg:grid-cols-2`}>
            {doc.whatItIs && (
              <div>
                <h2 id="hva-det-er" className="mb-3.5 text-[28px] font-bold leading-tight tracking-[-0.02em]">
                  {t.whatIs}
                </h2>
                <div className="prose prose-lg max-w-none text-sc-ink-600 prose-a:text-sc-cyan-600">
                  <PortableText value={doc.whatItIs as never} />
                </div>
              </div>
            )}
            {doc.whyItMatters && (
              <div>
                <h2 id="hvorfor" className="mb-3.5 text-[28px] font-bold leading-tight tracking-[-0.02em]">
                  {t.why}
                </h2>
                <div className="prose prose-lg max-w-none text-sc-ink-600 prose-a:text-sc-cyan-600">
                  <PortableText value={doc.whyItMatters as never} />
                </div>
              </div>
            )}
          </section>
        )}

        {/* 5: capability matrix */}
        {(steps.length > 0 || doc.notIncluded?.length) && (
          <section className={`${ui.container} pb-16`}>
            <h2 id="kapabiliteter" className="mb-5 text-[28px] font-bold leading-tight tracking-[-0.02em]">
              {t.whatFlows}
            </h2>
            <CapabilityMatrix steps={steps} notIncluded={doc.notIncluded} language={language} />
          </section>
        )}

        {/* 6: implementation steps */}
        {doc.implementationSteps?.length ? (
          <section className="bg-sc-ink-50 py-16 lg:py-20">
            <div className={ui.container}>
              <h2 id="implementering" className="mb-8 text-[28px] font-bold leading-tight tracking-[-0.02em]">
                {t.steps}
              </h2>
              <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {doc.implementationSteps.map((s, i) => (
                  <li key={s.name} className="flex flex-col gap-2.5 rounded-lg border border-sc-ink-100 bg-white p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sc-cyan-500 font-mono text-sm font-medium text-white">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-lg font-semibold">{s.name}</span>
                    <span className="text-[15px] leading-relaxed text-sc-ink-600">{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        {/* 7: named clients */}
        {doc.namedClients?.length ? (
          <section className={`${ui.container} pt-16`}>
            <div className="flex flex-col gap-4 rounded-lg bg-sc-ink-900 p-8 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-300">{t.clients}</div>
              <div className="text-xl leading-relaxed">{doc.namedClients.join(' · ')}</div>
            </div>
          </section>
        ) : null}

        {/* 8: long-form sections with TOC */}
        {sections.length > 0 && (
          <section className={`${ui.container} flex flex-wrap gap-12 py-16 lg:py-20`}>
            <aside className="flex max-w-[260px] flex-[1_1_220px] flex-col gap-2.5 text-sm lg:sticky lg:top-24 lg:self-start">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">{t.contents}</div>
              {toc.map((i) => (
                <a key={i.id} href={`#${i.id}`} className="text-sc-ink-600 hover:text-sc-ink-900">
                  {i.label}
                </a>
              ))}
            </aside>
            <article className="flex min-w-0 max-w-[760px] flex-[999_1_560px] flex-col gap-10">
              {sections.map((s) => (
                <section key={s._key} id={s.id}>
                  <h2 className="mb-3.5 text-[28px] font-bold leading-tight tracking-[-0.02em]">{s.heading}</h2>
                  <div className="prose prose-lg max-w-none text-sc-ink-600 prose-headings:tracking-[-0.02em] prose-a:text-sc-cyan-600">
                    <PortableText value={s.body as never} />
                  </div>
                </section>
              ))}
            </article>
          </section>
        )}

        {/* 9: case studies */}
        {doc.relatedCaseStudies?.length ? (
          <section className={`${ui.container} pb-16`}>
            <div className={`${ui.eyebrow} mb-5`}>{t.cases}</div>
            <div className="grid gap-6 sm:grid-cols-2">
              {doc.relatedCaseStudies.map((c) => (
                <Link key={c._id} href={hrefFor({ _type: 'caseStudy', slug: c.slug ?? '', language: c.language ?? language }, language)} className="flex flex-col gap-3 text-sc-ink-900">
                  {c.heroImageUrl ? (
                    <Image src={sanityImg(c.heroImageUrl, 900) as string} alt={c.title ?? ''} width={900} height={506} className="aspect-video w-full rounded-lg object-cover" />
                  ) : (
                    <span className="aspect-video w-full rounded-lg border border-dashed border-sc-ink-200 bg-sc-ink-50" />
                  )}
                  <span className="text-xl font-semibold">{c.title}</span>
                  {c.industry && <span className="text-sm text-sc-ink-500">{c.industry}</span>}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* 10: FAQ */}
        <Faq items={doc.faq} heading={t.faq} />

        {/* 11: related integrations */}
        <LinkList items={doc.clusterLinks} pageLanguage={language} eyebrow={t.siblings} />

        {/* 12: CTA + read next */}
        {doc.cta && <CtaBand heading={doc.cta.heading} text={doc.cta.text} buttonLabel={doc.cta.buttonLabel} buttonHref={doc.cta.buttonHref} />}
        <LinkList items={doc.relatedPages} pageLanguage={language} eyebrow={t.related} />
      </main>
      <FooterWrapper />
    </div>
  )
}
