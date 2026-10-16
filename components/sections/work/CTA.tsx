import Image from 'next/image'
import Link from 'next/link'
import { contactHref, ensureInternalHref, packagesHref } from '@/lib/routes'

interface CTAData {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

interface CTAProps {
  cta?: CTAData
  /** Page language, from the route (the language context can disagree on localhost). */
  lang: string
}

const BROWSE_PACKAGES: Record<string, string> = {
  no: 'Bla gjennom pakker',
  en: 'Browse packages',
  sv: 'Se paketen',
  da: 'Se pakkerne',
  de: 'Pakete ansehen',
}

export default function CTA({ cta, lang: currentLanguage }: CTAProps) {
  const title = cta?.title || 'Ready for results like these?'
  const description = cta?.description
  const buttonText = cta?.buttonText || 'Book Discovery Call'
  const buttonLink = cta?.buttonLink ? ensureInternalHref(cta.buttonLink) : contactHref(currentLanguage)

  return (
    <section className="bg-sc-ink-900 text-white">
      <div className="section_container mx-auto page-padding-x py-7 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3.5 md:gap-5">
          <Image
            src="/images/brand/logo-white-text.png"
            alt=""
            aria-hidden="true"
            width={808}
            height={193}
            className="h-6 md:h-7 w-auto self-start md:self-center"
          />
          <div>
            <h2 className="m-0 text-[22px] leading-[1.2] font-bold tracking-[-0.02em]">{title}</h2>
            {description && <p className="m-0 mt-1 text-sm text-sc-ink-300">{description}</p>}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:shrink-0">
          <Link
            href={buttonLink}
            className="text-center bg-sc-cyan-500 hover:bg-sc-cyan-600 text-sc-ink-900 font-bold text-[15px] md:text-sm px-5 py-3.5 md:py-3 rounded-full shadow-[0_10px_30px_rgba(22,167,179,0.25)] transition-colors"
          >
            {buttonText}
          </Link>
          <Link
            href={packagesHref(currentLanguage)}
            className="text-center text-white font-semibold text-[15px] md:text-sm px-5 py-3.5 md:py-3 border border-sc-ink-600 hover:border-sc-ink-400 rounded-full transition-colors"
          >
            {BROWSE_PACKAGES[currentLanguage] ?? BROWSE_PACKAGES.en}
          </Link>
        </div>
      </div>
    </section>
  )
}
