import Hero from '@/components/layout/Hero'
import MeetTheTeam from '@/components/sections/about/MeetTheTeam'
import OurStory from '@/components/sections/about/OurStory'
import OurValues from '@/components/sections/about/OurValues'
import TrustedPartnerships from '@/components/sections/about/TrustedPartnerships'
import WhyDifferent from '@/components/sections/about/WhyDifferent'
import WantWorkWithUs from '@/components/sections/about/WantWorkWithUs'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function AboutPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'aboutPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} isStats={true} />
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
            return <WantWorkWithUs key={_key} cta={rest as Parameters<typeof WantWorkWithUs>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
