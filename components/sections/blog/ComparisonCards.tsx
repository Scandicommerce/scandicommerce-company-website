import type { ComparisonCardsBlock } from '@/lib/blogBuilder'
import PostPortableText from './PostPortableText'

interface ComparisonCardsProps {
  block: ComparisonCardsBlock
}

function Card({ title, body, tone }: { title: string; body?: unknown; tone: 'ink' | 'cyan' }) {
  const head = tone === 'cyan' ? 'bg-sc-cyan-50 text-sc-cyan-700' : 'bg-sc-ink-50 text-sc-ink-600'
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white">
      <div className={`border-b border-sc-ink-100 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] ${head}`}>{title}</div>
      <div className="flex-1 p-5 lg:p-6">
        <PostPortableText value={body} size="compact" />
      </div>
    </div>
  )
}

/** Two hairline cards side by side: the left in ink, the right (the recommended side) in cyan. */
export default function ComparisonCards({ block }: ComparisonCardsProps) {
  const left = block.leftCard
  const right = block.rightCard
  if (!left && !right) return null

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
      {left && <Card title={left.title ?? ''} body={left.body} tone="ink" />}
      {right && <Card title={right.title ?? ''} body={right.body} tone="cyan" />}
    </div>
  )
}
