import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import ContactCards from '@/components/sections/contact/ContactCards'
import BookingSection from '@/components/sections/contact/BookingSection'
import MapSection from '@/components/sections/contact/MapSection'
import FAQ from '@/components/sections/contact/FAQ'
import { client } from '@/sanity/lib/client'
import { contactPageQuery } from '@/sanity/lib/queries'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ContactPageData {
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
  contactCards?: {
    cards?: {
      icon?: string
      title?: string
      subtitle?: string
      detail?: string
      href?: string
    }[]
  }
  bookingSection?: {
    label?: string
    title?: string
    description?: string
    meetingTypes?: {
      title?: string
      description?: string
    }[]
    confirmButtonText?: string
  }
  messageSection?: {
    label?: string
    title?: string
    description?: string
    submitButtonText?: string
  }
  benefits?: {
    icon?: string
    text?: string
  }[]
  mapSection?: {
    title?: string
    description?: string
  }
  faq?: {
    title?: string
    subtitle?: string
    faqs?: {
      question?: string
      answer?: string
    }[]
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export default async function Contact() {
  const pageData: ContactPageData = await client.fetch(
    contactPageQuery,
    {},
    { next: { revalidate: 0 } }
  )

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData.hero} />
        <ContactCards contactCards={pageData?.contactCards} />
        <BookingSection 
          bookingSection={pageData?.bookingSection}
          messageSection={pageData?.messageSection}
          benefits={pageData?.benefits}
        />
        <MapSection mapSection={pageData?.mapSection} />
        <FAQ faq={pageData?.faq} />
        <FooterWrapper />
      </main>
    </div>
  )
}
