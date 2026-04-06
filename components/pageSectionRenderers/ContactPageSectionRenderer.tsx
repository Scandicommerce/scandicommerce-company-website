import Hero from '@/components/layout/Hero'
import ContactCards from '@/components/sections/contact/ContactCards'
import BookingSection from '@/components/sections/contact/BookingSection'
import MapSection from '@/components/sections/contact/MapSection'
import FAQ from '@/components/sections/contact/FAQ'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function ContactPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'contactPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} />
          case 'contactPageCardsSection':
            return <ContactCards key={_key} contactCards={rest as Parameters<typeof ContactCards>[0]['contactCards']} />
          case 'contactPageBookingGroupSection':
            return (
              <BookingSection
                key={_key}
                bookingSection={
                  (rest as { bookingSection?: Parameters<typeof BookingSection>[0]['bookingSection'] }).bookingSection
                }
                messageSection={
                  (rest as { messageSection?: Parameters<typeof BookingSection>[0]['messageSection'] }).messageSection
                }
                benefits={(rest as { benefits?: Parameters<typeof BookingSection>[0]['benefits'] }).benefits}
              />
            )
          case 'contactPageMapSection':
            return <MapSection key={_key} mapSection={rest as Parameters<typeof MapSection>[0]['mapSection']} />
          case 'contactPageFaqSection':
            return <FAQ key={_key} faq={rest as Parameters<typeof FAQ>[0]['faq']} />
          default:
            return null
        }
      })}
    </>
  )
}
