import Hero from '@/components/sections/work/Hero'
import CaseStudies, { buildCaseItems, type CaseStudiesData } from '@/components/sections/work/CaseStudies'
import type { CaseCard } from '@/components/sections/work/CaseStudiesGrid'
import CTA from '@/components/sections/work/CTA'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function WorkPageSectionRenderer({
  sections,
  allCases,
  lang = 'no',
}: {
  sections: SanitySectionItem[]
  allCases?: CaseCard[]
  lang?: string
}) {
  // The hero's jump links and the case cards come from the same list.
  const caseSection = sections.find((s) => s._type === 'workPageCaseStudiesSection') as CaseStudiesData | undefined
  const items = buildCaseItems(caseSection, allCases, lang)
  const jumpLinks = items.map((item) => ({ id: item.id, label: item.client || item.category || item.title }))

  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'workPageHeroSection':
            return (
              <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} jumpLinks={jumpLinks} lang={lang} />
            )
          case 'workPageCaseStudiesSection':
            return <CaseStudies key={_key} caseStudies={rest as CaseStudiesData} items={items} lang={lang} />
          case 'workPageCtaSection':
            return <CTA key={_key} cta={rest as Parameters<typeof CTA>[0]['cta']} lang={lang} />
          default:
            return null
        }
      })}
    </>
  )
}
