import type { GradientTitleBlock } from '@/lib/blogBuilder'
import { H2 } from './labels'

interface GradientTitleProps {
  block: GradientTitleBlock
  /** Anchor id assigned by the outline, so the table of contents can link here. */
  id?: string
}

/** Section heading; the highlighted prefix is set in brand cyan. */
export default function GradientTitle({ block, id }: GradientTitleProps) {
  const title = block.title?.trim()
  if (!title) return null
  const prefix = block.highlightPrefix?.trim()
  const match = prefix && title.toLowerCase().startsWith(prefix.toLowerCase()) ? title.slice(0, prefix.length) : null
  const rest = match ? title.slice(match.length) : title

  return (
    <h2 id={id} className={`${H2} mt-2`}>
      {match && <span className="text-sc-cyan-500">{match}</span>}
      {rest}
    </h2>
  )
}
