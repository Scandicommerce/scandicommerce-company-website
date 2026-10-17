import { ui } from '@/components/integrations/labels'
import type { OutlineItem } from './outline'
import { postLabels } from './labels'

interface PostTocProps {
  items: OutlineItem[]
  language: string
}

function List({ items }: { items: OutlineItem[] }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-3 p-0">
      {items.map((item, i) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="group flex items-start gap-3 text-[14px] leading-snug text-sc-ink-600 no-underline transition-colors hover:text-sc-ink-900">
            <span className="w-5 flex-shrink-0 font-mono text-[12px] text-sc-ink-400 group-hover:text-sc-cyan-500">{String(i + 1).padStart(2, '0')}</span>
            <span>{item.title}</span>
          </a>
        </li>
      ))}
    </ol>
  )
}

/**
 * Numbered jump list in a hairline card. Sticky beside the body on large
 * screens; a closed details element above it on smaller ones.
 */
export default function PostToc({ items, language }: PostTocProps) {
  if (items.length === 0) return null
  const label = postLabels(language).contents

  return (
    <nav aria-label={label}>
      <details className="group rounded-lg border border-sc-ink-100 bg-white lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
          <span className={ui.eyebrow}>{label}</span>
          <span aria-hidden="true" className="text-sc-ink-500 group-open:hidden">+</span>
          <span aria-hidden="true" className="hidden text-sc-ink-500 group-open:inline">–</span>
        </summary>
        <div className="px-5 pb-5">
          <List items={items} />
        </div>
      </details>
      <div className="hidden rounded-lg border border-sc-ink-100 bg-white p-6 lg:block">
        <div className={`${ui.eyebrow} mb-4`}>{label}</div>
        <List items={items} />
      </div>
    </nav>
  )
}
