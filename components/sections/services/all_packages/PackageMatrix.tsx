import { PACKAGE_SECTIONS, PACKAGE_TIERS, packageCards, packageServices, type PackageTier } from '@/lib/packageMatrix'
import { ui } from '@/components/integrations/labels'

const tierIndex = (t: PackageTier) => PACKAGE_TIERS.indexOf(t)

function Check({ on, first }: { on: boolean; first: boolean }) {
  if (!on) return <span className="text-sc-ink-300" aria-label="Ikke inkludert">–</span>
  return (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${first ? 'bg-sc-cyan-500 text-sc-ink-900' : 'bg-sc-ink-100 text-sc-ink-700'}`} aria-label={first ? 'Nytt i denne pakken' : 'Inkludert'}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    </span>
  )
}

/**
 * Every service in the package matrix against every tier. Desktop: one table
 * with a sticky tier header. Phones: one accordion per section, each service
 * tagged with the lowest package that includes it.
 */
export default function PackageMatrix({ prices }: { prices?: Partial<Record<PackageTier, string>> }) {
  const cards = PACKAGE_TIERS.map((t) => packageCards.find((c) => c.tier === t)!)
  const label = (t: PackageTier) => `Fra ${cards[tierIndex(t)].name}`
  return (
    <section id="sammenlign" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>Sammenlign</div>
            <h2 className={ui.h2}>Alt som inngår, tjeneste for tjeneste</h2>
          </div>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">
            {packageServices.length} tjenester fordelt på {PACKAGE_SECTIONS.length} områder. Hver pakke inneholder alt i pakken under. Cyan hake betyr at tjenesten er ny på det nivået.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-lg border border-sc-ink-100 bg-white md:block">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-14 z-10 bg-white lg:top-[62px]">
              <tr className="border-b border-sc-ink-100">
                <th scope="col" className="w-[46%] px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">Tjeneste</th>
                {cards.map((c) => (
                  <th key={c.tier} scope="col" className="px-4 py-4 text-center align-bottom">
                    <div className="text-[17px] font-bold text-sc-ink-900">{c.name}</div>
                    <div className="font-mono text-[13px] text-sc-ink-500">{prices?.[c.tier] ?? c.price}<span className="font-sans"> /mnd</span></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PACKAGE_SECTIONS.map((section) => {
                const rows = packageServices.filter((s) => s.section === section)
                return (
                  <>
                    <tr key={section} className="bg-sc-ink-50/70">
                      <th scope="rowgroup" colSpan={1 + cards.length} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-700">{section}</th>
                    </tr>
                    {rows.map((s) => (
                      <tr key={s.id} className="border-t border-sc-ink-100 align-top">
                        <th scope="row" className="px-5 py-3.5 font-normal">
                          <div className="text-[15px] font-semibold text-sc-ink-900">{s.name}</div>
                          <div className="mt-0.5 text-[13px] leading-snug text-sc-ink-600">{s.text}</div>
                          {s.limit && <div className="mt-1 text-[12px] leading-snug text-sc-ink-400">Omfang: {s.limit}</div>}
                        </th>
                        {cards.map((c) => (
                          <td key={c.tier} className="px-4 py-3.5 text-center">
                            <Check on={tierIndex(c.tier) >= tierIndex(s.tier)} first={c.tier === s.tier} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Phone accordion */}
        <div className="flex flex-col gap-3 md:hidden">
          {PACKAGE_SECTIONS.map((section, i) => {
            const rows = packageServices.filter((s) => s.section === section)
            return (
              <details key={section} className="group rounded-lg border border-sc-ink-100 bg-white" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
                  <span>
                    <span className="block text-[17px] font-bold text-sc-ink-900">{section}</span>
                    <span className="block text-[13px] text-sc-ink-500">{rows.length} tjenester</span>
                  </span>
                  <span className="text-xl text-sc-ink-500 group-open:hidden">+</span>
                  <span className="hidden text-xl text-sc-ink-500 group-open:inline">–</span>
                </summary>
                <ul className="m-0 list-none border-t border-sc-ink-100 p-0">
                  {rows.map((s) => (
                    <li key={s.id} className="border-b border-sc-ink-100 px-5 py-3.5 last:border-b-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-[15px] font-semibold text-sc-ink-900">{s.name}</div>
                        <span className={`${s.tier === 'growth' ? ui.tag : ui.tagOutline} flex-none whitespace-nowrap`}>{label(s.tier)}</span>
                      </div>
                      <p className="m-0 mt-1 text-[13px] leading-snug text-sc-ink-600">{s.text}</p>
                      {s.limit && <p className="m-0 mt-1 text-[12px] leading-snug text-sc-ink-400">Omfang: {s.limit}</p>}
                    </li>
                  ))}
                </ul>
              </details>
            )
          })}
        </div>
      </div>
    </section>
  )
}
