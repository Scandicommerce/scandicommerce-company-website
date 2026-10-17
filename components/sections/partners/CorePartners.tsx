import { ui } from '@/components/integrations/labels'
import { categoryTitle, type PartnerEntry } from '@/lib/partnersCatalog'
import PartnerLogo from './PartnerLogo'

/** The partners we build nearly everything with: dark cards, horizontal scroll on phones. */
export default function CorePartners({ partners }: { partners: PartnerEntry[] }) {
  const core = partners.filter((p) => p.core)
  if (core.length === 0) return null
  return (
    <section id="kjerne" className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>Kjernepartnere</div>
            <h2 className={ui.h2}>De vi bygger nesten alt sammen med</h2>
          </div>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">Dypere samarbeid enn en partnerstatus: delt produktutvikling, direkte linjer og felles prosjekter.</p>
        </div>
      </div>
      <div className="mx-auto max-w-[1100px] lg:px-8">
        <ul className="m-0 flex snap-x snap-mandatory list-none gap-3 overflow-x-auto px-5 pb-2 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 [scrollbar-width:none]">
          {core.map((p) => (
            <li key={p.slug} className="flex w-[260px] flex-none snap-start flex-col gap-3.5 rounded-lg bg-sc-ink-900 p-5 text-white transition-transform hover:-translate-y-1 lg:w-auto">
              <div className="flex items-center gap-3">
                <PartnerLogo partner={p} size={44} />
                <div className="min-w-0">
                  <div className="truncate text-[17px] font-bold leading-tight">{p.name}</div>
                  <div className="truncate text-[12px] text-sc-ink-300">{categoryTitle(p.category)}</div>
                </div>
              </div>
              <span className="inline-flex w-fit items-center rounded-md bg-sc-cyan-500/15 px-2.5 py-1 text-xs font-medium text-sc-cyan-200">{p.badge}</span>
              <p className="m-0 text-[14px] leading-relaxed text-sc-ink-200">{p.together}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
