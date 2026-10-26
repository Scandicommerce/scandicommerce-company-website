import { T, lang, ui } from './labels'

export type FlowSystem = { _key?: string; name: string; role: 'source' | 'middleware' | 'target'; logoUrl?: string | null }
export type FlowStep = { _key?: string; from: string; to: string; payload: string; trigger?: string | null; frequency?: string | null }

/**
 * Static data-flow poster: three nodes (source, middleware, target) and the
 * steps as labelled edges. This is the poster frame the Remotion composition
 * will replace; it is also the reduced-motion fallback, so it has to read as a
 * still. Pure SVG, scales with its container.
 */
export function DataFlowPoster({ systems, steps, language }: { systems: FlowSystem[]; steps: FlowStep[]; language: string }) {
  const t = T[lang(language)]
  const source = systems.find((s) => s.role === 'source') ?? { name: 'Shopify', role: 'source' as const }
  const middleware = systems.find((s) => s.role === 'middleware')
  const target = systems.find((s) => s.role === 'target') ?? { name: '', role: 'target' as const }
  const W = 1100
  const H = 320
  const nodeW = 220
  const nodeH = 88
  const y = 140
  const xs = { source: 40, mid: 440, target: 840 }
  const edges = steps.slice(0, 4)

  const isForward = (s: FlowStep) => s.from.toLowerCase() === source.name.toLowerCase()
  // Two lanes per segment: even steps on the upper lane with the label above,
  // odd steps on the lower lane with the label below, so labels never collide.
  const laneY = (i: number) => y + (i % 2 === 0 ? 12 : 60)
  const labelY = (i: number) => (i % 2 === 0 ? laneY(i) - 14 : laneY(i) + 22)
  const short = (s: string) => (s.length > 26 ? `${s.slice(0, 25)}…` : s)

  const Node = ({ x, name, dark }: { x: number; name: string; dark?: boolean }) => (
    <g>
      <rect x={x} y={y - 4} width={nodeW} height={nodeH} rx={8} fill={dark ? '#12181a' : '#ffffff'} stroke={dark ? '#12181a' : '#d6dade'} />
      <text x={x + nodeW / 2} y={y - 4 + nodeH / 2 + 6} textAnchor="middle" fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="16" fontWeight="500" fill={dark ? '#ffffff' : '#12181a'}>
        {name}
      </text>
    </g>
  )

  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${t.poster}: ${edges.map((e) => `${e.from} → ${e.to}, ${e.payload}`).join('; ')}`} className="h-auto w-full rounded-lg border border-sc-ink-100 bg-sc-ink-50">
        <defs>
          <marker id="df-head" orient="auto" markerWidth="6" markerHeight="6" refX="5" refY="3">
            <path d="M0 0 L6 3 L0 6 Z" fill="#b5bcc4" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const fwd = isForward(e)
          const ly = laneY(i)
          const left = middleware ? (i < 2 ? xs.source + nodeW : xs.mid + nodeW) : xs.source + nodeW
          const right = middleware ? (i < 2 ? xs.mid : xs.target) : xs.target
          const x1 = fwd ? left : right
          const x2 = fwd ? right - 2 : left + 2
          const mid = (left + right) / 2
          return (
            <g key={e._key ?? i}>
              <line x1={x1} y1={ly} x2={x2} y2={ly} stroke="#d6dade" strokeWidth={2} markerEnd="url(#df-head)" />
              <circle cx={mid} cy={ly} r={6} fill="#16a7b3" />
              <circle cx={mid} cy={ly} r={12} fill="#16a7b3" opacity={0.2} />
              <text x={mid} y={labelY(i)} textAnchor="middle" fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="12" fill="#5a6670">
                {short(e.payload)}
              </text>
            </g>
          )
        })}
        <Node x={xs.source} name={source.name} dark />
        {middleware && <Node x={xs.mid} name={middleware.name} />}
        {target.name && <Node x={xs.target} name={target.name} />}
        <text x={40} y={H - 36} fontFamily="Space Grotesk, sans-serif" fontSize="12" fontWeight="600" letterSpacing="1.4" fill="#5a6670">
          {t.poster.toUpperCase()}
        </text>
      </svg>
    </figure>
  )
}

export function DataFlowLegend({ steps, language }: { steps: FlowStep[]; language: string }) {
  const t = T[lang(language)]
  if (!steps.length) return null
  return (
    <ol className="grid gap-4 font-mono text-[13px] leading-relaxed text-sc-ink-600 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s._key ?? i} className="border-t border-sc-ink-200 py-3">
          <span className="text-sc-cyan-500">{String(i + 1).padStart(2, '0')}</span>
          {'  '}
          {s.from.toLowerCase()} → {s.to.toLowerCase()}
          <br />
          {s.payload}
          {s.frequency ? ` · ${s.frequency}` : s.trigger ? ` · ${t.trigger[s.trigger] ?? s.trigger}` : ''}
        </li>
      ))}
    </ol>
  )
}

export function CapabilityMatrix({ steps, notIncluded, language }: { steps: FlowStep[]; notIncluded?: string[] | null; language: string }) {
  const t = T[lang(language)]
  if (!steps.length && !notIncluded?.length) return null
  const th = 'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500'
  const td = 'px-5 py-3.5 align-top'
  return (
    <div className="overflow-x-auto rounded-lg border border-sc-ink-100">
      <table className="w-full min-w-[640px] border-collapse text-[15px]">
        <thead>
          <tr className="bg-sc-ink-50">
            <th className={th}>{t.data}</th>
            <th className={th}>{t.direction}</th>
            <th className={th}>{t.when}</th>
            <th className={th}>{t.note}</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((s, i) => (
            <tr key={s._key ?? i} className="border-t border-sc-ink-100">
              <td className={`${td} font-medium text-sc-ink-900`}>{s.payload}</td>
              <td className={`${td} font-mono text-sm text-sc-ink-600`}>
                {s.from.toLowerCase()} → {s.to.toLowerCase()}
              </td>
              <td className={`${td} font-mono text-sm text-sc-ink-600`}>{s.frequency ?? (s.trigger ? t.trigger[s.trigger] ?? s.trigger : '')}</td>
              <td className={`${td} text-sc-ink-600`}></td>
            </tr>
          ))}
          {(notIncluded ?? []).map((n) => (
            <tr key={n} className="border-t border-sc-ink-100 text-sc-ink-500">
              <td className={`${td} font-medium`}>{n.split('.')[0]}</td>
              <td className={td}>—</td>
              <td className={td}>—</td>
              <td className={td}>
                {t.notIncluded}
                {n.includes('.') ? `. ${n.slice(n.indexOf('.') + 1).trim()}` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { ui as integrationUi }
