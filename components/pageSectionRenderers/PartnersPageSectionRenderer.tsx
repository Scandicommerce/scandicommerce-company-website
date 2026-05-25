import Hero from '@/components/layout/Hero'
import WhyOurPartnership from '@/components/sections/partners/WhyOurPartnership'
import PartnersGrid from '@/components/sections/partners/PartnersGrid'
import BecomeAPartner from '@/components/sections/partners/BecomeAPartner'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'
import type { PartnerCategoryItem } from '@/lib/partnersCategories'

export function PartnersPageSectionRenderer({
  sections,
  categoryList,
  lang,
}: {
  sections: SanitySectionItem[]
  categoryList?: PartnerCategoryItem[]
  lang?: string
}) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'partnersPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} />
          case 'partnersPageWhyOurPartnershipSection':
            return (
              <WhyOurPartnership key={_key} whyOurPartnership={rest as Parameters<typeof WhyOurPartnership>[0]['whyOurPartnership']} />
            )
          case 'partnersPagePartnersGridSection':
            return (
              <PartnersGrid
                key={_key}
                partnersGrid={rest as Parameters<typeof PartnersGrid>[0]['partnersGrid']}
                categoryList={categoryList}
                lang={lang}
              />
            )
          case 'partnersPageCtaSection':
            return <BecomeAPartner key={_key} cta={rest as Parameters<typeof BecomeAPartner>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
