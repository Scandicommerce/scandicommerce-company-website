import type { StatItem, StatsRowBlock } from '@/lib/blogBuilder'

/** Numbers in one hairline strip, the case-study stats style. */
export function StatsGrid({ stats }: { stats: StatItem[] }) {
  const items = stats.filter((s) => s && (s.value != null || s.label != null))
  if (items.length === 0) return null
  const cols = items.length === 1 ? 'sm:grid-cols-1' : items.length === 2 ? 'sm:grid-cols-2' : items.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'
  return (
    <div className={`grid grid-cols-1 ${cols} divide-y divide-sc-ink-100 overflow-hidden rounded-lg border border-sc-ink-100 sm:divide-y-0 sm:divide-x`}>
      {items.map((stat, i) => (
        <div key={i} className={`px-6 py-6 ${items.length > 3 ? 'lg:border-t-0 sm:[&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-sc-ink-100 sm:[&:nth-child(3)]:border-l-0 lg:[&:nth-child(3)]:border-l' : ''}`}>
          <div className="text-[32px] font-extrabold leading-none tracking-[-0.03em] text-sc-cyan-500 md:text-[40px]">{stat.value ?? '—'}</div>
          {stat.label && <div className="mt-2.5 text-sm font-semibold text-sc-ink-600">{stat.label}</div>}
        </div>
      ))}
    </div>
  )
}

interface StatsRowProps {
  block: StatsRowBlock
}

export default function StatsRow({ block }: StatsRowProps) {
  return <StatsGrid stats={block.stats ?? []} />
}
