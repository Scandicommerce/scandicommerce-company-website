import React from 'react'
import type { GrowthChart } from '@/lib/growthContent'

/**
 * Small server-rendered SVG charts for the growth service pages.
 *
 * Colour follows the "emphasis" form: the series the point is about in cyan,
 * context in gray (one hue + gray). Cyan 600 is used for marks because cyan 500
 * is under 3:1 on white; every chart therefore also carries visible labels and,
 * for data charts, a table view. Text always uses ink tokens, never the series
 * colour. Hover: native <title> per mark.
 */

const COLOR = {
  emphasis: '#118792', // sc-cyan-600
  context: '#b5bcc4', // sc-ink-300
  contextLine: '#8a95a0', // sc-ink-400
  grid: '#eceef0', // sc-ink-100
  text: '#262e32', // sc-ink-700
  muted: '#5a6670', // sc-ink-500
}

const formatNo = (value: number, digits = 3) =>
  value.toLocaleString('nb-NO', { minimumFractionDigits: digits, maximumFractionDigits: digits })

function Legend({ items }: { items: { label: string; color: string; line?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-sc-ink-600 mb-3">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          {item.line ? (
            <span className="inline-block w-4 h-[2px] rounded" style={{ background: item.color }} />
          ) : (
            <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: item.color }} />
          )}
          {item.label}
        </span>
      ))}
    </div>
  )
}

function DataTable({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <details className="mt-3 text-[13px] text-sc-ink-600">
      <summary className="cursor-pointer font-semibold text-sc-ink-700">Vis tallene</summary>
      <table className="mt-2 border-collapse">
        <thead>
          <tr>
            <th className="text-left font-semibold pr-6 py-1 border-b border-sc-ink-100">{head[0]}</th>
            <th className="text-right font-semibold py-1 border-b border-sc-ink-100">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td className="pr-6 py-1 border-b border-sc-ink-100">{label}</td>
              <td className="text-right tabular-nums py-1 border-b border-sc-ink-100">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}

/** Horizontal bar with a square baseline end and a 4px rounded data end. */
function barPath(x: number, y: number, width: number, height: number, radius = 4): string {
  const r = Math.min(radius, width, height / 2)
  return [
    `M${x},${y}`,
    `H${x + width - r}`,
    `Q${x + width},${y} ${x + width},${y + r}`,
    `V${y + height - r}`,
    `Q${x + width},${y + height} ${x + width - r},${y + height}`,
    `H${x}`,
    'Z',
  ].join(' ')
}

function BarsChart({ chart }: { chart: Extract<GrowthChart, { kind: 'bars' }> }) {
  const labelWidth = 200
  const plotWidth = 340
  const valueWidth = 56
  const row = 34
  const bar = 18
  const percent = chart.format === 'percent'
  const fmt = (value: number) => (percent ? `${Math.round(value)} %` : formatNo(value))
  const max = Math.max(...chart.items.map((i) => i.value))
  const scaleMax = percent ? 100 : Math.ceil(max * 10) / 10
  const step = percent ? 25 : 0.2
  const height = chart.items.length * row + 22
  const ticks: number[] = []
  for (let t = 0; t <= scaleMax + 1e-9; t += step) ticks.push(Math.round(t * 100) / 100)

  return (
    <div>
      {chart.legend && (
        <Legend
          items={[
            { label: chart.legend.emphasis, color: COLOR.emphasis },
            { label: chart.legend.context, color: COLOR.context },
          ]}
        />
      )}
      <svg
        viewBox={`0 0 ${labelWidth + plotWidth + valueWidth} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={chart.items.map((i) => `${i.label}: ${fmt(i.value)}`).join(', ')}
      >
        {ticks.map((t) => {
          const x = labelWidth + (t / scaleMax) * plotWidth
          return (
            <g key={t}>
              <line x1={x} x2={x} y1={0} y2={height - 20} stroke={COLOR.grid} strokeWidth={1} />
              <text x={x} y={height - 6} textAnchor="middle" fontSize={11} fill={COLOR.muted}>
                {percent ? `${t} %` : formatNo(t, 1)}
              </text>
            </g>
          )
        })}
        {chart.items.map((item, index) => {
          const y = index * row + (row - bar) / 2
          const width = (item.value / scaleMax) * plotWidth
          return (
            <g key={item.label}>
              <text x={labelWidth - 10} y={y + bar / 2 + 4} textAnchor="end" fontSize={13} fill={COLOR.text}>
                {item.label}
              </text>
              <path d={barPath(labelWidth, y, width, bar)} fill={item.emphasis ? COLOR.emphasis : COLOR.context}>
                <title>{`${item.label}: ${fmt(item.value)}`}</title>
              </path>
              <text x={labelWidth + width + 6} y={y + bar / 2 + 4} fontSize={12} fill={COLOR.text} className="tabular-nums">
                {fmt(item.value)}
              </text>
            </g>
          )
        })}
      </svg>
      <DataTable
        head={[chart.categoryLabel ?? 'Faktor', chart.valueLabel]}
        rows={chart.items.map((i) => [i.label, fmt(i.value)] as [string, string])}
      />
    </div>
  )
}

function SplitChart({ chart }: { chart: Extract<GrowthChart, { kind: 'split' }> }) {
  const width = 600
  const height = 36
  const gap = 2
  const total = chart.items.reduce((sum, i) => sum + i.value, 0)
  let x = 0
  return (
    <div>
      <Legend
        items={chart.items.map((i) => ({ label: i.label, color: i.emphasis ? COLOR.emphasis : COLOR.context }))}
      />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={chart.items.map((i) => `${i.label}: ${i.value} %`).join(', ')}
      >
        {chart.items.map((item, index) => {
          const isLast = index === chart.items.length - 1
          const segment = (item.value / total) * width - (isLast ? 0 : gap)
          const start = x
          x += segment + gap
          const fill = item.emphasis ? COLOR.emphasis : COLOR.context
          return (
            <g key={item.label}>
              <rect x={start} y={0} width={segment} height={height} rx={4} fill={fill}>
                <title>{`${item.label}: ${item.value} %`}</title>
              </rect>
              <text
                x={start + 14}
                y={height / 2 + 5}
                fontSize={14}
                fontWeight={600}
                fill={item.emphasis ? '#ffffff' : COLOR.text}
              >
                {`${item.value} %`}
              </text>
            </g>
          )
        })}
      </svg>
      <DataTable
        head={['Del av markedsbudsjettet', 'Andel']}
        rows={chart.items.map((i) => [i.label, `${i.value} %`] as [string, string])}
      />
    </div>
  )
}

/**
 * Principle sketch after Binet & Field: activation gives short spikes that fade,
 * brand building lifts the baseline slowly. Drawn from formulas, not data, and
 * labelled as such.
 */
function LongShortConcept() {
  const width = 600
  const height = 230
  const left = 28
  const bottom = height - 28
  const top = 16
  const steps = 120
  const plotW = width - left - 132

  const brandY = (t: number) => bottom - 18 - (bottom - top - 60) * (1 - Math.exp(-t * 2.2)) * 0.9
  const activationY = (t: number) => {
    const bursts = [0.08, 0.33, 0.58, 0.83]
    const lift = bursts.reduce((sum, b) => (t >= b ? sum + Math.exp(-(t - b) * 28) : sum), 0)
    return bottom - 18 - lift * 95
  }
  const path = (fn: (t: number) => number) =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps
      return `${i === 0 ? 'M' : 'L'}${(left + t * plotW).toFixed(1)},${fn(t).toFixed(1)}`
    }).join(' ')

  const endX = left + plotW
  return (
    <div>
      <Legend
        items={[
          { label: 'Merkevarebygging', color: COLOR.emphasis, line: true },
          { label: 'Salgsaktivering', color: COLOR.contextLine, line: true },
        ]}
      />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label="Prinsippskisse: salgsaktivering gir korte topper som faller raskt, merkevarebygging løfter salget gradvis over tid."
      >
        <line x1={left} x2={endX} y1={bottom} y2={bottom} stroke={COLOR.grid} strokeWidth={1} />
        <line x1={left} x2={left} y1={top} y2={bottom} stroke={COLOR.grid} strokeWidth={1} />
        <path d={path(activationY)} fill="none" stroke={COLOR.contextLine} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
          <title>Salgsaktivering: korte topper som faller raskt tilbake</title>
        </path>
        <path d={path(brandY)} fill="none" stroke={COLOR.emphasis} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
          <title>Merkevarebygging: løfter grunnsalget gradvis</title>
        </path>
        <text x={endX + 8} y={brandY(1) + 4} fontSize={12} fill={COLOR.text}>
          Merkevarebygging
        </text>
        <text x={endX + 8} y={activationY(1) + 4} fontSize={12} fill={COLOR.text}>
          Salgsaktivering
        </text>
        <text x={left} y={height - 8} fontSize={11} fill={COLOR.muted}>
          Tid →
        </text>
        <text x={left + 6} y={top + 4} fontSize={11} fill={COLOR.muted}>
          Salgseffekt
        </text>
      </svg>
      <p className="text-[12px] text-sc-ink-500 mt-1 m-0">Prinsippskisse, ikke målte data.</p>
    </div>
  )
}

export function GrowthChartView({ chart }: { chart: GrowthChart }) {
  switch (chart.kind) {
    case 'bars':
      return <BarsChart chart={chart} />
    case 'split':
      return <SplitChart chart={chart} />
    case 'longShortConcept':
      return <LongShortConcept />
  }
}
