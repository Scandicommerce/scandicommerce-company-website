import PartnersHero from '@/components/sections/partners/PartnersHero'
import HowWeChoose from '@/components/sections/partners/HowWeChoose'
import CorePartners from '@/components/sections/partners/CorePartners'
import PartnerCatalog from '@/components/sections/partners/PartnerCatalog'
import PartnersCtas from '@/components/sections/partners/PartnersCtas'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'
import { localizePartners, mergePartners, partnerCatalog, partnerCategories, type SanityPartner } from '@/lib/partnersCatalog'
import { urlFor } from '@/sanity/lib/image'
import { CONTACT_SLUG } from '@/lib/routes'

type SanityImage = { asset?: { _id?: string; url?: string }; crop?: unknown; hotspot?: unknown }
type GridPartner = { name?: string; category?: string; description?: string; benefits?: string[]; url?: string; logo?: SanityImage }

/**
 * Sanity sections → the partner pages. The hero, "why" title and CTA copy
 * come from the document; the partner list is the code catalog with any
 * Sanity description or logo laid on top (see mergePartners), then swapped
 * to English copy for non-Norwegian pages (see localizePartners).
 */
export function PartnersPageSectionRenderer({ sections, lang = 'no' }: { sections: SanitySectionItem[]; lang?: string }) {
  const contactHref = `/${(CONTACT_SLUG as Record<string, string>)[lang] ?? 'kontakt'}`
  const grid = sections.find((s) => s._type === 'partnersPagePartnersGridSection') as (SanitySectionItem & { partners?: GridPartner[] }) | undefined
  const sanityPartners: SanityPartner[] = (grid?.partners ?? []).map((p) => ({
    name: p.name,
    category: p.category,
    description: p.description,
    benefits: p.benefits,
    url: p.url,
    logoUrl: p.logo?.asset ? urlFor(p.logo).width(160).height(160).fit('crop').url() : null,
  }))
  const partners = localizePartners(mergePartners(partnerCatalog, sanityPartners), lang)
  const categoryCount = new Set(partners.map((p) => p.category)).size || partnerCategories.length

  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'partnersPageHeroSection': {
            const hero = rest as { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string }
            return (
              <PartnersHero
                key={_key}
                title={hero.heroTitle?.text || (lang === 'no' ? 'Partnere vi faktisk bruker' : 'Partners we actually use')}
                highlight={hero.heroTitle?.highlight}
                description={hero.heroDescription}
                partners={partners}
                categoryCount={categoryCount}
                lang={lang}
              />
            )
          }
          case 'partnersPageWhyOurPartnershipSection':
            return <HowWeChoose key={_key} title={(rest as { title?: string }).title} contactHref={contactHref} lang={lang} />
          case 'partnersPagePartnersGridSection':
            return (
              <div key={_key}>
                <CorePartners partners={partners} lang={lang} />
                <PartnerCatalog partners={partners} lang={lang} contactHref={contactHref} />
              </div>
            )
          case 'partnersPageCtaSection':
            return <PartnersCtas key={_key} cta={rest as Parameters<typeof PartnersCtas>[0]['cta']} contactHref={contactHref} lang={lang} />
          default:
            return null
        }
      })}
    </>
  )
}
