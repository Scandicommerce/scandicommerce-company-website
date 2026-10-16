import { ArrowRight, Check } from 'lucide-react'

interface MigrationMockupProps {
  /** Platforms shown on the "from" side, e.g. from the Sanity platforms section. */
  fromPlatforms?: string[]
}

const MOVED = ['Produkter', 'Kunder', 'Ordrehistorikk', 'SEO og URL-er']

/** Old platform → Shopify, drawn with markup. Purely decorative. */
export default function MigrationMockup({ fromPlatforms = ['WooCommerce', 'Magento', 'BigCommerce'] }: MigrationMockupProps) {
  return (
    <div aria-hidden="true" className="relative mx-auto flex w-full max-w-[560px] items-center gap-3 sm:gap-5">
      {/* From */}
      <div className="flex-1 rounded-lg border border-dashed border-sc-ink-200 bg-white/70 p-4 sm:p-5">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-sc-ink-600">Fra</div>
        <ul className="list-none space-y-2 p-0 m-0">
          {fromPlatforms.slice(0, 3).map((name) => (
            <li key={name} className="rounded-lg bg-sc-ink-50 px-3 py-2 text-sm text-sc-ink-600 line-through decoration-sc-ink-200">
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-sc-cyan-500 text-white shadow-[0_10px_30px_rgba(22,167,179,0.35)]">
        <ArrowRight className="h-5 w-5" strokeWidth={2} />
      </div>

      {/* To */}
      <div className="flex-[1.2] rounded-lg border border-sc-ink-100 bg-white p-4 sm:p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-sc-cyan-500">Til Shopify</div>
        <ul className="list-none space-y-2.5 p-0 m-0">
          {MOVED.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-sc-ink-900">
              <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-sc-cyan-50 text-sc-cyan-500">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute -bottom-6 right-0 sm:-right-4 rounded-full bg-sc-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-[0_15px_40px_rgba(15,23,42,0.25)]">
        Null nedetid ✓
      </div>
    </div>
  )
}
