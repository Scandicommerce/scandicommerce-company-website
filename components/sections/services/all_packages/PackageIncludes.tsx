import {
  cardForTier,
  serviceCount,
  servicesForTier,
  tierBelow,
  type PackageService,
  type PackageTier,
} from '@/lib/packageMatrix'

interface PackageIncludesProps {
  tier: PackageTier
}

/** One service: name, what the customer gets, and what it does not cover. */
function ServiceRow({ service }: { service: PackageService }) {
  return (
    <div className="rounded-xl border border-sc-ink-100 bg-white p-4 lg:p-5">
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden="true"
          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sc-cyan-500"
        />
        <div className="min-w-0">
          <h4 className="text-[15px] font-semibold text-sc-ink-900">{service.name}</h4>
          <p className="mt-1 text-[13.5px] leading-relaxed text-sc-ink-600">{service.text}</p>
          {service.limit && (
            <p className="mt-2 text-[12.5px] leading-relaxed text-sc-ink-400">
              <span className="font-medium">Omfang:</span> {service.limit}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * What a package includes, from the package matrix: grouped by section, with
 * services new to this package shown in full and inherited ones listed compactly
 * so the step up from the package below stays readable.
 */
export default function PackageIncludes({ tier }: PackageIncludesProps) {
  const groups = servicesForTier(tier)
  const card = cardForTier(tier)
  const below = tierBelow(tier)
  const belowCard = below ? cardForTier(below) : undefined
  const total = serviceCount(tier)

  return (
    <div>
      {/* Summary strip */}
      <div className="mb-8 flex flex-wrap items-baseline gap-x-8 gap-y-2 rounded-xl border border-sc-ink-100 bg-white px-5 py-4">
        {card && (
          <span className="text-[13px] text-sc-ink-500">
            <span className="text-[20px] font-bold text-sc-ink-900">{card.price}</span> per måned
          </span>
        )}
        <span className="text-[13px] text-sc-ink-500">
          <span className="font-semibold text-sc-ink-900">{total}</span> tjenester inkludert
        </span>
      </div>

      {belowCard && (
        <p className="mb-8 rounded-xl border border-sc-cyan-500/30 bg-sc-cyan-500/5 px-5 py-3.5 text-[14px] text-sc-ink-700">
          <span className="font-semibold">Alt i {belowCard.name}</span> er inkludert, pluss det som
          er merket som nytt under.
        </p>
      )}

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.section}>
            <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-sc-ink-100 pb-2">
              <h3 className="text-[17px] lg:text-[19px] font-bold text-sc-ink-900">
                {group.section}
              </h3>
              <span className="shrink-0 text-[12px] text-sc-ink-400">
                {group.added.length + group.inherited.length} tjenester
              </span>
            </div>

            {group.added.length > 0 && (
              <>
                {below && (
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-sc-cyan-500">
                    Nytt i {card?.name}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {group.added.map((service) => (
                    <ServiceRow key={service.id} service={service} />
                  ))}
                </div>
              </>
            )}

            {group.inherited.length > 0 && (
              <details className="group mt-4">
                <summary className="cursor-pointer list-none text-[13px] font-medium text-sc-ink-500 hover:text-sc-ink-900">
                  <span className="group-open:hidden">
                    Vis {group.inherited.length} tjenester fra pakkene under
                  </span>
                  <span className="hidden group-open:inline">Skjul tjenester fra pakkene under</span>
                </summary>
                <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1.5 md:grid-cols-2">
                  {group.inherited.map((service) => (
                    <li
                      key={service.id}
                      className="flex items-start gap-2 text-[13.5px] text-sc-ink-600"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-sc-ink-200"
                      />
                      {service.name}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
