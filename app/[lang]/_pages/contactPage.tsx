import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { ContactPageSectionRenderer } from '@/components/pageSectionRenderers/ContactPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { contactPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface ContactPageData {
  _id: string
  pageTitle?: string
  slug?: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
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

export default async function ContactPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData: ContactPageData = await client.fetch(
    contactPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  const sections = normalizePageSections('contactPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ContactPageSectionRenderer sections={sections} />
        <FooterWrapper />
      </main>
    </div>
  )
}
