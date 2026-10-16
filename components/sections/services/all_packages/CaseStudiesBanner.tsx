import Link from 'next/link'

interface CaseStudiesBannerData {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

interface CaseStudiesBannerProps {
  packageName: string
  caseStudiesBanner?: CaseStudiesBannerData
}

/** Ink CTA band, the same block that closes the integrations pages. */
export default function CaseStudiesBanner({ packageName, caseStudiesBanner }: CaseStudiesBannerProps) {
  const title = caseStudiesBanner?.title || 'See how others succeeded with this package'
  const description = caseStudiesBanner?.description || `Read real case studies from brands that chose the ${packageName} package`
  const buttonText = caseStudiesBanner?.buttonText || 'View Case Studies'
  const buttonLink = caseStudiesBanner?.buttonLink || '/work'

  return (
    <section className="bg-sc-ink-900 py-16 text-white lg:py-20">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-8 px-5 lg:px-8">
        <div className="flex max-w-[640px] flex-col gap-3">
          <h2 className="text-[32px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]">{title}</h2>
          <p className="text-lg leading-relaxed text-sc-ink-200">{description}</p>
        </div>
        <Link
          href={buttonLink}
          className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
