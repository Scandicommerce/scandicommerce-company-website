/** Lines of a made-up Shopify extension, as [indent, tokens]. Purely decorative. */
const LINES: Array<[number, Array<[string, string]>]> = [
  [0, [['text-sc-cyan-500', 'export'], ['text-sc-ink-900', ' function '], ['text-[#7c3aed]', 'configure'], ['text-sc-ink-900', '(product) {']]],
  [1, [['text-sc-cyan-500', 'const'], ['text-sc-ink-900', ' options = '], ['text-[#7c3aed]', 'getOptions'], ['text-sc-ink-900', '(product)']]],
  [1, [['text-sc-cyan-500', 'const'], ['text-sc-ink-900', ' price = '], ['text-[#7c3aed]', 'b2bPrice'], ['text-sc-ink-900', '(customer, options)']]],
  [1, [['text-sc-ink-600', '// sync to ERP and storefront']]],
  [1, [['text-sc-cyan-500', 'await'], ['text-sc-ink-900', ' erp.'], ['text-[#7c3aed]', 'push'], ['text-sc-ink-900', '({ options, price })']]],
  [1, [['text-sc-cyan-500', 'return'], ['text-sc-ink-900', ' { options, price }']]],
  [0, [['text-sc-ink-900', '}']]],
]

/** A code editor with a product configurator beside it, drawn with markup. Purely decorative. */
export default function CodeEditorMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[560px]">
      <div className="overflow-hidden rounded-2xl border border-sc-ink-100 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
        <div className="flex items-center gap-2 border-b border-sc-ink-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-sc-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-sc-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-sc-ink-200" />
          <span className="ml-3 rounded-md bg-sc-ink-50 px-3 py-1 text-[11px] font-medium text-sc-ink-600">configurator.ts</span>
        </div>
        <pre className="m-0 overflow-hidden px-5 py-4 font-mono text-[12px] sm:text-[13px] leading-6">
          {LINES.map(([indent, tokens], i) => (
            <div key={i} className="flex whitespace-pre">
              <span className="mr-4 w-4 shrink-0 select-none text-right text-sc-ink-200">{i + 1}</span>
              <span style={{ paddingLeft: `${indent * 1.25}rem` }}>
                {tokens.map(([cls, text], j) => (
                  <span key={j} className={cls}>
                    {text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </pre>
      </div>

      {/* Floating configurator card */}
      <div className="absolute -bottom-24 -left-4 sm:-left-10 w-[220px] rounded-xl border border-sc-ink-100 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-sc-cyan-500">Konfigurator</div>
        <div className="mb-3 flex gap-1.5">
          <span className="h-5 w-5 rounded-full bg-sc-ink-900 ring-2 ring-sc-cyan-500 ring-offset-2" />
          <span className="h-5 w-5 rounded-full bg-sc-cyan-500" />
          <span className="h-5 w-5 rounded-full bg-sc-ink-200" />
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-sc-ink-600">Din pris</span>
          <span className="whitespace-nowrap font-semibold text-sc-ink-900">4 290,-</span>
        </div>
      </div>

      {/* Floating chips */}
      <div className="absolute -top-4 -right-2 sm:-right-6 flex gap-2">
        <span className="rounded-full bg-sc-ink-900 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_15px_40px_rgba(15,23,42,0.25)]">App</span>
        <span className="rounded-full bg-sc-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_15px_40px_rgba(22,167,179,0.35)]">Agent</span>
      </div>
    </div>
  )
}
