import ContactHero from '@/components/sections/contact/ContactHero'
import BookingSection from '@/components/sections/contact/BookingSection'
import MapSection from '@/components/sections/contact/MapSection'
import FAQ from '@/components/sections/contact/FAQ'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type Cards = Parameters<typeof ContactHero>[0]['cards']

/** Contact page: the cards section folds into the hero; booking, map and FAQ follow in document order. */
export function ContactPageSectionRenderer({ sections, lang = 'no' }: { sections: SanitySectionItem[]; lang?: string }) {
  const cards = (sections.find((s) => s._type === 'contactPageCardsSection') as (SanitySectionItem & { cards?: Cards }) | undefined)?.cards
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'contactPageHeroSection':
            return <ContactHero key={_key} hero={rest as Parameters<typeof ContactHero>[0]['hero']} cards={cards} eyebrow={lang === 'no' ? 'Kontakt' : 'Contact'} />
          case 'contactPageCardsSection':
            return null
          case 'contactPageBookingGroupSection': {
            const r = rest as { bookingSection?: Parameters<typeof BookingSection>[0]['bookingSection']; messageSection?: Parameters<typeof BookingSection>[0]['messageSection']; benefits?: Parameters<typeof BookingSection>[0]['benefits'] }
            return <BookingSection key={_key} lang={lang} bookingSection={r.bookingSection} messageSection={r.messageSection} benefits={r.benefits} />
          }
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
