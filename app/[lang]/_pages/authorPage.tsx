import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { PortableText } from '@/sanity'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { authorBySlugQuery, authorArticlesQuery } from '@/sanity/lib/queries'
import { getLanguageFromParams } from '@/lib/language'

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
  _type: 'blogPost' | 'post' | 'caseStudy'
  language?: string
  title?: string
  slug?: string
  excerpt?: string
  category?: string
  publishedAt?: string
  imageUrl?: string
}

/** Same-language links stay bare (production locale is domain-based); cross-language
 * links get a locale prefix, which middleware resolves to the right domain. */
function articleHref(article: AuthorArticle, pageLang: string): string {
  if (!article.slug) return '#'
  const clean = article.slug.replace(/^\/+/, '')
  const path = clean.startsWith('resources/') ? clean : `resources/${clean}`
  if (article.language && article.language !== pageLang) return `/${article.language}/${path}`
  return `/${path}`
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

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        {/* Profile hero */}
        <section className="bg-[#EFEFEF] py-16 lg:py-20">
          <div className="section_container mx-auto page-padding-x">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl">
              {author.imageUrl && (
                <div className="relative w-36 h-36 md:w-44 md:h-44 flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#03C1CA]/20 relative">
                    <Image
                      src={author.imageUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="176px"
                    />
                  </div>
                </div>
              )}
              <div className="text-center md:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-[#1F1D1D] mb-1">{author.name}</h1>
                {author.role && <p className="text-lg text-[#03C1CA] font-semibold mb-3">{author.role}</p>}
                {author.bio && <p className="text-[#565454] leading-relaxed mb-4">{author.bio}</p>}
                {author.expertise && author.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {author.expertise.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-white text-[#565454] text-sm font-medium rounded-full border border-gray-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-semibold text-[#03C1CA] hover:underline"
                  >
                    LinkedIn →
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Full bio */}
        {author.longBio && author.longBio.length > 0 && (
          <section className="py-12">
            <div className="section_container mx-auto page-padding-x">
              <div className="max-w-3xl prose text-[#565454] [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1F1D1D] [&_h2]:mt-8 [&_h2]:mb-3">
                <PortableText value={author.longBio} />
              </div>
            </div>
          </section>
        )}

        {/* Articles by this author */}
        {articles.length > 0 && (
          <section className="py-12 lg:py-16 border-t border-gray-100">
            <div className="section_container mx-auto page-padding-x">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F1D1D] mb-8">
                {language === 'no' ? `Artikler av ${author.name}` : `Articles by ${author.name}`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <Link
                    key={a._id}
                    href={articleHref(a, language)}
                    className="group flex flex-col rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full h-44 bg-gray-100">
                      {a.imageUrl && (
                        <Image
                          src={a.imageUrl}
                          alt={a.title || ''}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#03C1CA] mb-2">
                        {a._type === 'caseStudy'
                          ? language === 'no' ? 'Kundecase' : 'Case study'
                          : a.category || (language === 'no' ? 'Artikkel' : 'Article')}
                      </span>
                      <h3 className="text-lg font-bold text-[#1F1D1D] mb-2 line-clamp-2 group-hover:text-[#03C1CA] transition-colors">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-sm text-[#565454] line-clamp-3">{a.excerpt}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <FooterWrapper />
      </main>
    </div>
  )
}
