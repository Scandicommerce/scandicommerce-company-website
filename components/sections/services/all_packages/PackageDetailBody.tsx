import type { Package } from '@/lib/packages'
import type { PackageTier } from '@/lib/packageMatrix'
import PackageIncludes from './PackageIncludes'

interface PackageDetailBodyProps {
  pkg: Package
  /** Set when the package is one of the matrix tiers. */
  tier?: PackageTier
  lang?: string
}

const T = {
  no: { included: 'Hva er inkludert', idealFor: 'Passer for' },
  en: { included: "What's included", idealFor: 'Ideal for' },
  sv: { included: 'Det här ingår', idealFor: 'Passar för' },
  da: { included: 'Det får du', idealFor: 'Passer til' },
  de: { included: 'Das ist enthalten', idealFor: 'Geeignet für' },
} as const

/** Section heading shared by every block, so the page reads as one rhythm. */
function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-6 scroll-mt-24 text-[22px] font-bold tracking-[-0.01em] text-sc-ink-900 lg:text-[28px]"
    >
      {children}
    </h2>
  )
}

/**
 * The whole package, laid out in full. Nothing is behind a tab: a buyer
 * comparing packages can read or search the entire offer in one pass, and the
 * anchor bar keeps the longer tiers navigable.
 */
export default function PackageDetailBody({ pkg, tier, lang = 'en' }: PackageDetailBodyProps) {
  const t = T[lang as keyof typeof T] ?? T.en
  const isNo = lang === 'no'

  const hasIdealFor = Boolean(pkg.idealFor?.length)

  const anchors = [
    { id: 'inkludert', label: t.included, show: true },
    { id: 'passer-for', label: t.idealFor, show: hasIdealFor },
  ].filter((a) => a.show)

  return (
    <>
      {/* Anchor bar: navigation only, nothing is hidden behind it */}
      {anchors.length > 1 && (
        <nav className="sticky top-14 z-20 border-b border-sc-ink-100 bg-white/95 backdrop-blur-md lg:top-[62px]">
          <div className="section_container mx-auto max-w-[1320px] page-padding-x">
            <ul className="flex gap-6 overflow-x-auto py-3.5 text-[13.5px] font-medium">
              {anchors.map((a) => (
                <li key={a.id}>
                  <a
                    href={`#${a.id}`}
                    className="whitespace-nowrap text-sc-ink-500 transition-colors hover:text-sc-ink-900"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      <div className="bg-white">
        <div className="section_container mx-auto max-w-[1320px] page-padding-x py-14 lg:py-20">
          <div className="mx-auto max-w-5xl space-y-16 lg:space-y-20">
            {/* What's included */}
            <section>
              <SectionHeading id="inkludert">{t.included}</SectionHeading>
              {tier && isNo ? (
                <PackageIncludes tier={tier} />
              ) : pkg.includedCategories?.length ? (
                <div className="space-y-10">
                  {pkg.includedCategories.map((category, i) => (
                    <div key={i}>
                      <h3 className="mb-4 border-b border-sc-ink-100 pb-2 text-[17px] font-bold text-sc-ink-900 lg:text-[19px]">
                        {category.category}
                      </h3>
                      <ul className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                        {category.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-[14.5px] text-sc-ink-700">
                            <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-sc-cyan-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                  {pkg.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-sc-ink-700">
                      <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-sc-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Ideal for */}
            {hasIdealFor && (
              <section>
                <SectionHeading id="passer-for">{t.idealFor}</SectionHeading>
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {pkg.idealFor.map((item, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-sc-ink-100 bg-sc-ink-50 px-4 py-3.5 text-[14.5px] leading-relaxed text-sc-ink-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
