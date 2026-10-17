import { TableOfContentsItem } from '@/lib/articles'
import { ui } from '@/components/integrations/labels'

interface TableOfContentsProps {
  items: TableOfContentsItem[]
  lang?: string
}

const LABEL: Record<string, string> = { no: 'Innhold', en: 'Contents' }

/** Numbered jump list in a hairline card; sticky beside the body on large screens. */
export default function TableOfContents({ items, lang = 'no' }: TableOfContentsProps) {
  const list = items.filter((item) => item.id && item.title)
  if (list.length === 0) return null

  return (
    <nav aria-label={LABEL[lang] ?? LABEL.en} className="rounded-lg border border-sc-ink-100 bg-white p-5 lg:p-6">
      <div className={`${ui.eyebrow} mb-4`}>{LABEL[lang] ?? LABEL.en}</div>
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {list.map((item, i) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="group flex items-start gap-3 text-[14px] leading-snug text-sc-ink-600 no-underline transition-colors hover:text-sc-ink-900">
              <span className="w-5 flex-shrink-0 font-mono text-[12px] text-sc-ink-400 group-hover:text-sc-cyan-500">{String(item.number || i + 1).padStart(2, '0')}</span>
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}