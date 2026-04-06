import Hero from '@/components/layout/Hero'
import CaseStudies from '@/components/sections/work/CaseStudies'
import CTA from '@/components/sections/work/CTA'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function WorkPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'workPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} />
          case 'workPageCaseStudiesSection':
            return <CaseStudies key={_key} caseStudies={rest as Parameters<typeof CaseStudies>[0]['caseStudies']} />
          case 'workPageCtaSection':
            return <CTA key={_key} cta={rest as Parameters<typeof CTA>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
