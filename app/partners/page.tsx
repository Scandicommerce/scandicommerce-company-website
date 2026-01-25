import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import WhyOurPartnership from '@/components/sections/partners/WhyOurPartnership'
import PartnersGrid from '@/components/sections/partners/PartnersGrid'
import BecomeAPartner from '@/components/sections/partners/BecomeAPartner'
import { client } from '@/sanity/lib/client'
import { partnersPageQuery } from '@/sanity/lib/queries'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PartnersPageData {
  _id: string
  pageTitle?: string
  slug?: string
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
  }
  whyOurPartnership?: {
    title?: string
    features?: {
      icon?: string
      title?: string
      description?: string
    }[]
  }
  partnersGrid?: {
    partners?: {
      name?: string
      category?: string
      description?: string
      benefits?: string[]
      imageUrl?: string
      logoUrl?: string
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

export default async function Partners() {
  const pageData: PartnersPageData = await client.fetch(
    partnersPageQuery,
    {},
    { next: { revalidate: 0 } }
  )

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData.hero} />
        <WhyOurPartnership whyOurPartnership={pageData?.whyOurPartnership} />
        <PartnersGrid partnersGrid={pageData?.partnersGrid} />
        <BecomeAPartner cta={pageData?.cta} />
        <FooterWrapper />
      </main>
    </div>
  )
}
