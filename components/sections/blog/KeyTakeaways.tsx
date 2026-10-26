import type { KeyTakeawaysBlock } from '@/lib/blogBuilder'
import PostPortableText from './PostPortableText'

function color(value: string | null | undefined): string | undefined {
  const v = typeof value === 'string' ? value.trim() : ''
  return v || undefined
}

interface KeyTakeawaysProps {
  block: KeyTakeawaysBlock
}

/** Cyan panel with a top rule. Colours set in Sanity still apply; the defaults are the shared tokens. */
export default function KeyTakeaways({ block }: KeyTakeawaysProps) {
  const content = block.content
  if (!Array.isArray(content) || content.length === 0) return null

  const bg = color(block.backgroundColor)
  const border = color(block.borderColor)
  const top = color(block.topBorderColor)
  const topEnd = color(block.topBorderColorEnd)
  const topStyle = top ? (topEnd ? { background: `linear-gradient(to right, ${top}, ${topEnd})` } : { backgroundColor: top }) : undefined

  return (
    <aside className="overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-cyan-50" style={{ backgroundColor: bg, borderColor: border }}>
      <div className="h-1 w-full bg-sc-cyan-500" style={topStyle} />
      <div className="p-6 lg:p-8 [&_h2]:text-[20px] [&_h3]:text-[17px] [&_p]:text-sc-ink-700 [&_li]:text-sc-ink-700">
        <PostPortableText value={content} size="compact" />
      </div>
    </aside>
  )
}
