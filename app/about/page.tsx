import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
// import Hero from '@/components/sections/about/Hero'
import MeetTheTeam from '@/components/sections/about/MeetTheTeam'
import OurStory from '@/components/sections/about/OurStory'
import OurValues from '@/components/sections/about/OurValues'
import TrustedPartnerships from '@/components/sections/about/TrustedPartnerships'
import WhyDifferent from '@/components/sections/about/WhyDifferent'
import WantWorkWithUs from '@/components/sections/about/WantWorkWithUs'
import { client } from '@/sanity/lib/client'
import { aboutPageQuery } from '@/sanity/lib/queries'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AboutPageData {
  _id: string
  pageTitle?: string
  slug?: string
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
    stats?: {
      value?: string
      label?: string
    }[]
  }
  whyDifferent?: {
    title?: string
    subtitle?: string
    features?: {
      icon?: string
      title?: string
      description?: string
    }[]
  }
  ourStory?: {
    title?: string
    description?: string
    imageUrl?: string
    imageAlt?: string
  }
  ourValues?: {
    title?: string
    values?: {
      title?: string
      description?: string
    }[]
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
    }[]
    buttonText?: string
    buttonLink?: string
  }
  trustedPartnerships?: {
    title?: string
    subtitle?: string
    partnerships?: {
      name?: string
      status?: string
      logoIcon?: string
    }[]
  }
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export default async function About() {
  const pageData: AboutPageData = await client.fetch(
    aboutPageQuery,
    {},
    { next: { revalidate: 0 } }
  )

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        {/* <Hero hero={pageData?.hero} /> */}
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
