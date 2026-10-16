const ROWS = [
  { name: 'Arbeidshanske, str. L', list: '189,-', price: '142,-', qty: 48 },
  { name: 'Verneboks, 20 stk', list: '640,-', price: '512,-', qty: 6 },
  { name: 'Refleksvest, gul', list: '249,-', price: '199,-', qty: 24 },
]

/** A B2B order portal with customer-specific prices, drawn with markup. Purely decorative. */
export default function OrderPortalMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[560px]">
      <div className="overflow-hidden rounded-lg border border-sc-ink-100 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between border-b border-sc-ink-100 px-5 py-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-sc-cyan-500">Ordreportal</div>
            <div className="text-sm font-semibold text-sc-ink-900">Forhandler AS</div>
          </div>
          <span className="rounded-full bg-sc-cyan-50 px-3 py-1 text-[11px] font-semibold text-sc-cyan-500">Prisliste: Gull</span>
        </div>

        <div className="px-5 py-3">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-sc-ink-600">
            <span>Produkt</span>
            <span className="text-right">Din pris</span>
            <span className="text-right">Antall</span>
          </div>
          {ROWS.map((row) => (
            <div key={row.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-t border-sc-ink-100 py-2.5 text-sm">
              <span className="truncate text-sc-ink-900">{row.name}</span>
              <span className="text-right">
                <span className="mr-1.5 text-xs text-sc-ink-600 line-through">{row.list}</span>
                <span className="font-semibold text-sc-ink-900">{row.price}</span>
              </span>
              <span className="min-w-[44px] rounded-md bg-sc-ink-50 px-2 py-1 text-right text-sc-ink-900">{row.qty}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-sc-ink-100 bg-sc-ink-50 px-5 py-3">
          <span className="text-xs text-sc-ink-600">Betaling: faktura 30 dager</span>
          <span className="rounded-lg bg-sc-cyan-500 px-4 py-2 text-xs font-semibold text-white">Send bestilling</span>
        </div>
      </div>

      <div className="absolute -top-4 -right-2 sm:-right-6 rounded-full bg-sc-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-[0_15px_40px_rgba(15,23,42,0.25)]">
        Synkronisert med ERP ✓
      </div>
    </div>
  )
}
