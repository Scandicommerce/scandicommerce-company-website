import PackagesHero from '@/components/sections/services/all_packages/PackagesHero'
import PricingPackages from '@/components/sections/services/all_packages/PricingPackages'
import FAQ from '@/components/sections/services/all_packages/FAQ'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'
import { contactHref } from '@/lib/routes'

/** Closing band for visitors who have read the cards and are still unsure. */
function BookCallBand({ lang }: { lang: string }) {
  return (
    <section className="bg-sc-ink-900 text-white">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-6 px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex max-w-[620px] flex-col gap-2.5">
          <h2 className="m-0 text-[30px] font-bold leading-tight tracking-[-0.02em] lg:text-[36px]">Usikker på nivå?</h2>
          <p className="m-0 text-[17px] text-sc-ink-300">På 30 minutter går vi gjennom butikken din og anbefaler pakken som passer. Uforpliktende.</p>
        </div>
        <a href={contactHref(lang)} className="inline-flex min-h-[52px] items-center rounded-full bg-sc-cyan-300 px-7 font-semibold text-sc-ink-900 transition-colors hover:bg-sc-cyan-200">
          Book en samtale
        </a>
      </div>
    </section>
  )
}

export function AllPackagesPageSectionRenderer({ sections, lang }: { sections: SanitySectionItem[]; lang?: string }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'allPackagesPageHeroSection':
            return <PackagesHero key={_key} hero={rest as Parameters<typeof PackagesHero>[0]['hero']} eyebrow={lang === 'no' ? 'Pakker' : 'Packages'} />
          case 'allPackagesPagePackagesSection':
            return <PricingPackages key={_key} packages={rest as Parameters<typeof PricingPackages>[0]['packages']} lang={lang} />
          case 'allPackagesPageFaqSection':
            return <FAQ key={_key} faq={rest as Parameters<typeof FAQ>[0]['faq']} />
          default:
            return null
        }
      })}
      {lang === 'no' && <BookCallBand lang={lang} />}
    </>
  )
}
