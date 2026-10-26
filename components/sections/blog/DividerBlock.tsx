import type { DividerBlock as DividerBlockType } from '@/lib/blogBuilder'

interface DividerBlockProps {
  block?: DividerBlockType
}

const SPACE = { small: 'my-0', medium: 'my-2 lg:my-4', large: 'my-6 lg:my-8' }

/** Hairline rule between sections. */
export default function DividerBlock({ block }: DividerBlockProps) {
  const spacing = block?.spacing ?? 'medium'
  return <hr className={`m-0 border-0 border-t border-sc-ink-100 ${SPACE[spacing] ?? SPACE.medium}`} aria-hidden />
}
