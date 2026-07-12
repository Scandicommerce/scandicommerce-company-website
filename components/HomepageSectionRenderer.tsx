import Hero from '@/components/sections/homepage/Hero'
import TrustedBy from '@/components/sections/homepage/TrustedBy'
import PainPoints from '@/components/sections/homepage/PainPoints'
import ServicesPackaged from '@/components/sections/homepage/ServicesPackaged'
import Results from '@/components/sections/homepage/Results'
import HowWeWork from '@/components/sections/homepage/HowWeWork'
import Partners from '@/components/sections/homepage/Partners'
import CTA from '@/components/sections/homepage/CTA'
import TechnicalDepth from '@/components/sections/homepage/TechnicalDepth'
import BlogTeaser, { type TeaserPost } from '@/components/sections/homepage/BlogTeaser'
import Testimonial from '@/components/sections/services/shopify_development/Testimonial'
import type { HomepageSectionBlock, HomepageServicesShowcasePayload } from '@/lib/homepageSections'

type PackagesFallback = {
  packages?: {
    packagesItems?: Array<{
      title: string
      subtitle: string
      price: string
      priceType: string
      timeline: string
      rating: number
      ratingValue: string
      bestFor: string[]
      included: string[]
      description: string
      href: string
    }>
  }
}

/** CMS-entered internal paths must be root-relative, or they resolve against the current URL and 404. */
function normalizeHref(href: string): string {
  if (!href || /^(https?:|mailto:|tel:|#|\/)/.test(href)) return href
  return `/${href}`
}

function servicesPackagesFromSection(
  section: HomepageServicesShowcasePayload,
  allPackages: PackagesFallback | null | undefined
) {
  if (section.packages?.length) {
    return {
      packagesItems: section.packages.map((pkg) => ({
        title: pkg.title || '',
        subtitle: pkg.subtitle || '',
        price: pkg.price || '',
        priceType: pkg.priceType || '',
        timeline: pkg.timeline || '',
        rating: pkg.rating || 0,
        ratingValue: pkg.ratingValue || '',
        bestFor: pkg.bestFor || [],
        included: [],
        description: '',
        href: normalizeHref(pkg.buttonLink || ''),
        buttonText: pkg.buttonText || 'View Details',
      })),
    }
  }
  return allPackages?.packages
}

export function HomepageSectionRenderer({
  sections,
  allPackages,
  latestPosts,
  lang,
}: {
  sections: HomepageSectionBlock[]
  allPackages?: PackagesFallback | null
  latestPosts?: TeaserPost[]
  lang?: string
}) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section as HomepageSectionBlock & Record<string, unknown>

        switch (_type) {
          case 'heroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} />
          case 'trustedBySection':
            return <TrustedBy key={_key} trustedBy={rest as Parameters<typeof TrustedBy>[0]['trustedBy']} />
          case 'painPointsSection':
            return <PainPoints key={_key} painPoints={rest as Parameters<typeof PainPoints>[0]['painPoints']} />
          case 'servicesShowcaseSection':
            return (
              <ServicesPackaged
                key={_key}
                data={rest as Parameters<typeof ServicesPackaged>[0]['data']}
                packages={servicesPackagesFromSection(rest as HomepageServicesShowcasePayload, allPackages)}
              />
            )
          case 'resultsSection':
            return <Results key={_key} data={rest as Parameters<typeof Results>[0]['data']} />
          case 'homepageTestimonialSection':
            return (
              <Testimonial
                key={_key}
                testimonial={rest as Parameters<typeof Testimonial>[0]['testimonial']}
              />
            )
          case 'processSection':
            return <HowWeWork key={_key} process={rest as Parameters<typeof HowWeWork>[0]['process']} />
          case 'partnersSection':
            return <Partners key={_key} partners={rest as Parameters<typeof Partners>[0]['partners']} />
          case 'ctaSection':
            return <CTA key={_key} data={rest as Parameters<typeof CTA>[0]['data']} />
          case 'technicalDepthSection':
            return <TechnicalDepth key={_key} data={rest as Parameters<typeof TechnicalDepth>[0]['data']} />
          case 'blogTeaserSection':
            return <BlogTeaser key={_key} data={rest as Parameters<typeof BlogTeaser>[0]['data']} posts={latestPosts} lang={lang} />
          default:
            return null
        }
      })}
    </>
  )
}
