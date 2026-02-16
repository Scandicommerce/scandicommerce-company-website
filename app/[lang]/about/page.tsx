import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import MeetTheTeam from '@/components/sections/about/MeetTheTeam'
import OurStory from '@/components/sections/about/OurStory'
import OurValues from '@/components/sections/about/OurValues'
import TrustedPartnerships from '@/components/sections/about/TrustedPartnerships'
import WhyDifferent from '@/components/sections/about/WhyDifferent'
import WantWorkWithUs from '@/components/sections/about/WantWorkWithUs'
import { client } from '@/sanity/lib/client'
import { aboutPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'
import Hero from '@/components/layout/Hero'
import type { Image as SanityImage } from 'sanity'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AboutPageData {
  _id: string
  pageTitle?: string
  slug?: string
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

export async function generateMetadata() {
  const alternates = getAlternateLanguagesForMetadata('about')
  return { alternates: Object.keys(alternates).length ? { languages: alternates } : undefined }
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData: AboutPageData = await client.fetch(
    aboutPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero} isStats={true} />
        <WhyDifferent whyDifferent={pageData?.whyDifferent} />
        <OurStory ourStory={pageData?.ourStory} />
        <OurValues ourValues={pageData?.ourValues} />
        <MeetTheTeam meetTheTeam={pageData?.meetTheTeam} />
        <TrustedPartnerships trustedPartnerships={pageData?.trustedPartnerships} />
        <WantWorkWithUs cta={pageData?.cta} />
        <FooterWrapper />
      </main>
    </div>
  )
}
