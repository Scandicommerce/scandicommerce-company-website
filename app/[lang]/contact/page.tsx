import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import ContactCards from '@/components/sections/contact/ContactCards'
import BookingSection from '@/components/sections/contact/BookingSection'
import MapSection from '@/components/sections/contact/MapSection'
import FAQ from '@/components/sections/contact/FAQ'
import { client } from '@/sanity/lib/client'
import { contactPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ContactPageData {
  _id: string
  pageTitle?: string
  slug?: string
  hero?: { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string }
  contactCards?: {
    cards?: { icon?: string; title?: string; subtitle?: string; detail?: string; href?: string }[]
  }
  bookingSection?: {
    enabled?: boolean
    useCalendly?: boolean
    calendlySchedulingUrl?: string | null
    label?: string
    title?: string
    description?: string
    meetingTypes?: { title?: string; description?: string; durationMinutes?: number }[]
    availableSlots?: { date?: string; times?: string[] }[]
    confirmButtonText?: string
  }
  messageSection?: {
    label?: string
    title?: string
    description?: string
    submitButtonText?: string
  }
  benefits?: { icon?: string; text?: string }[]
  mapSection?: { title?: string; description?: string }
  faq?: {
    title?: string
    subtitle?: string
    faqs?: { question?: string; answer?: string }[]
  }
  seo?: { metaTitle?: string; metaDescription?: string }
}

export async function generateMetadata() {
  const alternates = getAlternateLanguagesForMetadata('contact')
  return { alternates: Object.keys(alternates).length ? { languages: alternates } : undefined }
}

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData: ContactPageData = await client.fetch(
    contactPageQuery,
    getQueryParams({}, language),
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
