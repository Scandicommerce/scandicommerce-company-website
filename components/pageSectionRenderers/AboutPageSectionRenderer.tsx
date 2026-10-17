import AboutHero from '@/components/sections/about/AboutHero'
import MeetTheTeam from '@/components/sections/about/MeetTheTeam'
import OurStory from '@/components/sections/about/OurStory'
import OurValues from '@/components/sections/about/OurValues'
import TrustedPartnerships from '@/components/sections/about/TrustedPartnerships'
import WhyDifferent from '@/components/sections/about/WhyDifferent'
import WantWorkWithUs from '@/components/sections/about/WantWorkWithUs'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function AboutPageSectionRenderer({ sections, lang = 'no' }: { sections: SanitySectionItem[]; lang?: string }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'aboutPageHeroSection':
            return <AboutHero key={_key} hero={rest as Parameters<typeof AboutHero>[0]['hero']} eyebrow={lang === 'no' ? 'Om oss' : 'About us'} />
          case 'aboutPageWhyDifferentSection':
            return <WhyDifferent key={_key} whyDifferent={rest as Parameters<typeof WhyDifferent>[0]['whyDifferent']} />
          case 'aboutPageOurStorySection':
            return <OurStory key={_key} ourStory={rest as Parameters<typeof OurStory>[0]['ourStory']} />
          case 'aboutPageOurValuesSection':
            return <OurValues key={_key} ourValues={rest as Parameters<typeof OurValues>[0]['ourValues']} />
          case 'aboutPageMeetTheTeamSection':
            return <MeetTheTeam key={_key} meetTheTeam={rest as Parameters<typeof MeetTheTeam>[0]['meetTheTeam']} />
          case 'aboutPageTrustedPartnershipsSection':
            return (
              <TrustedPartnerships
                key={_key}
                trustedPartnerships={rest as Parameters<typeof TrustedPartnerships>[0]['trustedPartnerships']}
              />
            )
          case 'aboutPageCtaSection':
            return <WantWorkWithUs key={_key} cta={rest as Parameters<typeof WantWorkWithUs>[0]['cta']} lang={lang} />
          default:
            return null
        }
      })}
    </>
  )
}
