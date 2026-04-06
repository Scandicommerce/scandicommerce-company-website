import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { AboutPageSectionRenderer } from '@/components/pageSectionRenderers/AboutPageSectionRenderer'
import { getAboutPageDocumentCached } from '@/lib/sanity/cachedDocuments'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import type { Image as SanityImage } from 'sanity'

interface AboutPageData {
  _id: string
  pageTitle?: string
  slug?: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: {
    heroTitle?: { text?: string; highlight?: string }
    heroDescription?: string
    stats?: { value?: string; label?: string }[]
  }
  whyDifferent?: {
    title?: string
    subtitle?: string
    features?: { icon?: string; title?: string; description?: string }[]
  }
  ourStory?: {
    title?: string
    description?: string
    imageUrl?: string
    image?: SanityImage
    imageAlt?: string
  }
  ourValues?: {
    title?: string
    values?: { title?: string; description?: string }[]
  }
  meetTheTeam?: {
    title?: string
    subtitle?: string
    teamMembers?: {
      name?: string
      role?: string
      specialties?: string
      funFact?: string
      imageUrl?: string
      image?: SanityImage
    }[]
    buttonText?: string
    buttonLink?: string
  }
  trustedPartnerships?: {
    title?: string
    subtitle?: string
    partnerships?: { name?: string; status?: string; logoIcon?: string }[]
  }
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
  seo?: { metaTitle?: string; metaDescription?: string }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = (await getAboutPageDocumentCached(language)) as AboutPageData | null

  const sections = normalizePageSections('aboutPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <AboutPageSectionRenderer sections={sections} />
        <FooterWrapper />
      </main>
    </div>
  )
}
