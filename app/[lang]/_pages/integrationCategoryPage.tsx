import Link from 'next/link'
import { notFound } from 'next/navigation'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { PortableText } from '@/sanity'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { integrationCategoryBySlugQuery } from '@/sanity/lib/templateQueries'
import { getLanguageFromParams } from '@/lib/language'
import { hrefFor, publicPath } from '@/lib/routes'
import IntegrationGrid from '@/components/integrations/IntegrationGrid'
import { Breadcrumb, CtaBand, Faq, LinkList, type LinkDoc } from '@/components/integrations/LinkBlocks'
import { T, lang, ui, type CategorySummary, type IntegrationCard } from '@/components/integrations/labels'

interface CategoryDoc {
  _id: string
  _updatedAt?: string
  language: string
  title: string
  key: string
  slug: string
  definition?: string
  intro?: unknown[]
  faq?: { question: string; answer: string }[]
  cta?: { heading?: string; text?: string; buttonLabel?: string; buttonHref?: string }
  relatedPages?: LinkDoc[] | null
  integrations: IntegrationCard[]
  siblings: CategorySummary[]
  pillar?: LinkDoc | null
}

/** Category page (/integrasjoner/erp): hero, integrations in the category, sibling categories, FAQ, CTA. */
export default async function IntegrationCategoryPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang: langParam, slug } = await params
  const language = getLanguageFromParams({ lang: langParam })
  if (!slug) notFound()
  const doc = await sanityPageFetch<CategoryDoc | null>(integrationCategoryBySlugQuery, { slug, language }, { next: { revalidate: 0 } })
  if (!doc) notFound()
  const l = lang(language)
  const t = T[l]
  const pillarHref = doc.pillar?.slug ? hrefFor({ _type: 'pillarPage', slug: doc.pillar.slug, language }, language) : publicPath(language, l === 'no' ? 'integrasjoner' : 'integrations')

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white text-sc-ink-900">
        <section className={`${ui.container} pb-16 pt-12`}>
          <Breadcrumb items={[{ label: t.pillarCrumb, href: pillarHref }, { label: doc.title }]} />
          <div className="mt-5 flex max-w-[880px] flex-col gap-5">
            <div className={ui.eyebrow}>{doc.title}</div>
            <h1 className="text-[40px] font-bold leading-[1.02] tracking-[-0.028em] lg:text-[56px]">
              {l === 'no' ? `${doc.title} for Shopify` : `${doc.title} for Shopify`}
            </h1>
            {doc.definition && <p className="text-lg leading-7 text-sc-ink-600">{doc.definition}</p>}
            {Array.isArray(doc.intro) && doc.intro.length > 0 && (
              <div className="prose prose-lg max-w-none text-sc-ink-600 prose-a:text-sc-cyan-600">
                <PortableText value={doc.intro as never} />
              </div>
            )}
          </div>
        </section>

        <section className="bg-sc-ink-50 py-16 lg:py-20">
          <div className={ui.container}>
            <div className="mb-8 flex flex-col gap-2.5">
              <div className={ui.eyebrow}>{t.integrationsCount(doc.integrations.length)}</div>
              <h2 className={ui.h2}>{t.inThisCategory}</h2>
            </div>
            <IntegrationGrid items={doc.integrations} language={language} />
          </div>
        </section>

        {doc.siblings?.length ? (
          <section className={`${ui.container} py-16`}>
            <div className={`${ui.eyebrow} mb-5`}>{t.otherCategories}</div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {doc.siblings.map((s) => (
                <li key={s._id}>
                  <Link href={hrefFor({ _type: 'integrationCategory', slug: s.slug, language }, language)} className="flex flex-col gap-2 rounded-lg border border-sc-ink-100 p-5 hover:border-sc-cyan-500">
                    <span className="text-lg font-semibold">{s.title}</span>
                    <span className="text-sm text-sc-ink-500">{t.integrationsCount(s.count ?? 0)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <Faq items={doc.faq} heading={t.faq} />
        {doc.cta?.heading && doc.cta.buttonLabel && doc.cta.buttonHref && (
          <CtaBand heading={doc.cta.heading} text={doc.cta.text} buttonLabel={doc.cta.buttonLabel} buttonHref={doc.cta.buttonHref} />
        )}
        <LinkList items={doc.relatedPages} pageLanguage={language} eyebrow={t.related} />
      </main>
      <FooterWrapper />
    </div>
  )
}
