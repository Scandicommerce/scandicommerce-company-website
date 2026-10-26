/**
 * A stylised Shopify storefront in a browser window, drawn with markup so the
 * hero needs no image asset. Purely decorative.
 */
export default function StorefrontMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[560px]">
      {/* Browser window */}
      <div className="rounded-lg border border-sc-ink-100 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] overflow-hidden">
        <div className="flex items-center gap-2 border-b border-sc-ink-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-sc-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-sc-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-sc-ink-200" />
          <span className="ml-3 h-6 flex-1 rounded-md bg-sc-ink-50 px-3 text-[11px] leading-6 text-sc-ink-600">
            dinbutikk.no
          </span>
        </div>

        <div className="p-5">
          {/* Store nav */}
          <div className="mb-5 flex items-center justify-between">
            <span className="h-3 w-20 rounded bg-sc-ink-900" />
            <div className="flex gap-3">
              <span className="h-2 w-10 rounded bg-sc-ink-100" />
              <span className="h-2 w-10 rounded bg-sc-ink-100" />
              <span className="h-2 w-10 rounded bg-sc-ink-100" />
            </div>
          </div>

          {/* Store banner */}
          <div className="mb-5 flex h-28 items-end rounded-lg bg-gradient-to-br from-sc-cyan-500 to-sc-cyan-600 p-4">
            <div className="space-y-2">
              <span className="block h-3 w-36 rounded bg-white/90" />
              <span className="block h-2 w-24 rounded bg-white/60" />
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className={`aspect-square rounded-lg ${i === 1 ? 'bg-sc-cyan-50' : 'bg-sc-ink-50'}`} />
                <span className="block h-2 w-4/5 rounded bg-sc-ink-100" />
                <span className="block h-2 w-1/2 rounded bg-sc-ink-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating order card */}
      <div className="absolute -bottom-6 -left-4 sm:-left-10 rounded-lg border border-sc-ink-100 bg-white px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-sc-cyan-500">Ny ordre</div>
        <div className="mt-1 text-sm font-semibold text-sc-ink-900">Betalt med Vipps</div>
      </div>

      {/* Floating launch badge */}
      <div className="absolute -top-4 -right-2 sm:-right-6 rounded-full bg-sc-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-[0_15px_40px_rgba(15,23,42,0.25)]">
        Live på Shopify ✓
      </div>
    </div>
  )
}
