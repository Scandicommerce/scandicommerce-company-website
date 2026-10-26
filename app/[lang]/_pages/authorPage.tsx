import Image from 'next/image'
import { sanityImg } from '@/lib/sanityImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { PortableText } from '@/sanity'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { authorBySlugQuery, authorArticlesQuery } from '@/sanity/lib/queries'
import { getLanguageFromParams } from '@/lib/language'
import { hrefFor } from '@/lib/routes'
import { ui } from '@/components/integrations/labels'

interface AuthorData {
  _id: string
  name: string
  role?: string
  slug: string
  bio?: string
  longBio?: unknown[]
  expertise?: string[]
  linkedin?: string
  imageUrl?: string
  seo?: { metaTitle?: string; metaDescription?: string }
}

interface AuthorArticle {
  _id: string
  _type: 'post' | 'caseStudy'
  language?: string
  title?: string
  slug?: string
  excerpt?: string
  category?: string
  publishedAt?: string
  imageUrl?: string
}

/** Same-language links are relative; other languages get an absolute URL on their own origin. */
function articleHref(article: AuthorArticle, pageLang: string): string {
  if (!article.slug) return '#'
  return hrefFor({ _type: article._type, slug: article.slug, language: article.language ?? pageLang }, pageLang)
}

function formatDate(d: string | undefined, language: string): string {
  if (!d) return ''
  const parsed = new Date(d)
  if (isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString(language === 'no' ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ lang: string; slug?: string }>
}) {
  const { lang, slug } = await params
  const language = getLanguageFromParams({ lang })
  if (!slug) notFound()

  const author: AuthorData | null = await sanityPageFetch(
    authorBySlugQuery,
    { slug },
    { next: { revalidate: 0 } }
  )
  if (!author) notFound()

  const articles: AuthorArticle[] = await sanityPageFetch(
    authorArticlesQuery,
    { authorId: author._id },
    { next: { revalidate: 0 } }
  )

  // Person structured data for E-E-A-T
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.imageUrl ? { image: author.imageUrl } : {}),
    ...(author.expertise?.length ? { knowsAbout: author.expertise } : {}),
    ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
    worksFor: { '@type': 'Organization', name: 'Scandicommerce' },
  }

  const isNorwegian = language === 'no'
  const eyebrow = isNorwegian ? 'Teamet' : 'The team'
  const articlesHeading = isNorwegian ? `Artikler av ${author.name}` : `Articles by ${author.name}`
  const caseLabel = isNorwegian ? 'Kundecase' : 'Case study'
  const articleLabel = isNorwegian ? 'Artikkel' : 'Article'

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        {/* Profile hero, on the services hero: copy left, portrait right in a hairline panel. */}
        <section className="bg-white">
          <div className={`${ui.container} grid grid-cols-1 items-center gap-10 pb-14 pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-20`}>
            <div className="order-2 lg:order-1">
              <div className={`${ui.eyebrow} mb-4`}>{eyebrow}</div>
              <h1 className="mb-3 text-[36px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 sm:text-[44px] lg:text-[60px]">{author.name}</h1>
              {author.role && <p className="m-0 mb-5 text-lg font-semibold text-sc-cyan-500">{author.role}</p>}
              {author.bio && <p className="m-0 max-w-[580px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{author.bio}</p>}
              {author.expertise && author.expertise.length > 0 && (
                <ul className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0">
                  {author.expertise.map((topic) => (
                    <li key={topic} className={ui.chip}>
                      {topic}
                    </li>
                  ))}
                </ul>
              )}
              {author.linkedin && (
                <div className="mt-8">
                  <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className={`${ui.btnSecondary} no-underline`}>
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
            {author.imageUrl && (
              <div className="order-1 lg:order-2">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
                  <Image
                    src={sanityImg(author.imageUrl, 900) as string}
                    alt={author.name}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Full bio */}
        {author.longBio && author.longBio.length > 0 && (
          <section className="border-t border-sc-ink-100 bg-white py-12 lg:py-16">
            <div className={ui.container}>
              <div className="max-w-[720px] text-[17px] leading-[1.7] text-sc-ink-600 [&_a]:text-sc-cyan-600 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:tracking-[-0.02em] [&_h2]:text-sc-ink-900 [&_h2:first-child]:mt-0 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-sc-ink-900 [&_p]:mb-5 [&_p:last-child]:mb-0 [&_strong]:text-sc-ink-900 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5">
                <PortableText value={author.longBio} />
              </div>
            </div>
          </section>
        )}

        {/* Articles by this author */}
        {articles.length > 0 && (
          <section className="border-t border-sc-ink-100 bg-sc-ink-50 py-16 lg:py-20">
            <div className={ui.container}>
              <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="m-0 text-[28px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 md:text-[32px]">{articlesHeading}</h2>
                <span className="font-mono text-[13px] text-sc-ink-400">{articles.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => {
                  const date = formatDate(a.publishedAt, language)
                  return (
                    <Link
                      key={a._id}
                      href={articleHref(a, language)}
                      data-cross-locale={a.language && a.language !== language ? true : undefined}
                      className="group flex flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white no-underline transition-transform hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] w-full bg-sc-ink-100">
                        {a.imageUrl && (
                          <Image
                            src={sanityImg(a.imageUrl, 800) as string}
                            alt={a.title || ''}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <div>
                          <span className={ui.tag}>{a._type === 'caseStudy' ? caseLabel : a.category || articleLabel}</span>
                        </div>
                        <h3 className="m-0 line-clamp-2 text-[18px] font-bold leading-[1.3] tracking-[-0.01em] text-sc-ink-900 transition-colors group-hover:text-sc-cyan-600">{a.title}</h3>
                        {a.excerpt && <p className="m-0 line-clamp-3 text-[14px] leading-relaxed text-sc-ink-600">{a.excerpt}</p>}
                        {date && <div className={`${ui.mono} mt-auto`}>{date}</div>}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        <FooterWrapper />
      </main>
    </div>
  )
}
