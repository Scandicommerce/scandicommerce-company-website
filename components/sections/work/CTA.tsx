import Link from 'next/link'
import { contactHref, ensureInternalHref, packagesHref } from '@/lib/routes'
import { ui } from '@/components/integrations/labels'

interface CTAData {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  hideSecondaryButton?: boolean
}

interface CTAProps {
  cta?: CTAData
  /** Page language, from the route (the language context can disagree on localhost). */
  lang: string
}

const T: Record<string, { title: string; primary: string; secondary: string }> = {
  no: { title: 'Klar for resultater som dette?', primary: 'Book en samtale', secondary: 'Se pakkene' },
  en: { title: 'Ready for results like these?', primary: 'Book a call', secondary: 'Browse packages' },
  sv: { title: 'Redo för resultat som dessa?', primary: 'Boka ett samtal', secondary: 'Se paketen' },
  da: { title: 'Klar til resultater som disse?', primary: 'Book en samtale', secondary: 'Se pakkerne' },
  de: { title: 'Bereit für solche Ergebnisse?', primary: 'Gespräch buchen', secondary: 'Pakete ansehen' },
}

/** Ink CTA band, the same block that closes the integrations and package pages. */
export default function CTA({ cta, lang }: CTAProps) {
  const t = T[lang] ?? T.en
  const title = cta?.title || t.title
  const buttonText = cta?.buttonText || t.primary
  const buttonLink = cta?.buttonLink ? ensureInternalHref(cta.buttonLink) : contactHref(lang)
  const secondaryText = cta?.secondaryButtonText || t.secondary
  const secondaryLink = cta?.secondaryButtonLink ? ensureInternalHref(cta.secondaryButtonLink) : packagesHref(lang)

  return (
    <section className="bg-sc-ink-900 py-16 text-white lg:py-20">
      <div className={`${ui.container} flex flex-wrap items-center justify-between gap-8`}>
        <div className="flex max-w-[640px] flex-col gap-3">
          <h2 className="m-0 text-[32px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]">{title}</h2>
          {cta?.description && <p className="m-0 text-lg leading-relaxed text-sc-ink-200">{cta.description}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={buttonLink}
            className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50"
          >
            {buttonText}
          </Link>
          {!cta?.hideSecondaryButton && (
            <Link
              href={secondaryLink}
              className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-sc-ink-600 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-ink-800"
            >
              {secondaryText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
