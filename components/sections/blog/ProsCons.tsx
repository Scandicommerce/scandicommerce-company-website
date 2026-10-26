import type { ProsConsBlock } from '@/lib/blogBuilder'

interface ProsConsProps {
  block: ProsConsBlock
}

function List({ title, items, tone }: { title: string; items: string[]; tone: 'ink' | 'cyan' }) {
  const head = tone === 'cyan' ? 'bg-sc-cyan-50 text-sc-cyan-700' : 'bg-sc-ink-50 text-sc-ink-600'
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white">
      <div className={`border-b border-sc-ink-100 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] ${head}`}>{title}</div>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-5 lg:p-6">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-sc-ink-700">
            {tone === 'cyan' ? (
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-sc-cyan-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-sc-ink-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** What to avoid (ink) beside what to do (cyan), as hairline cards. */
export default function ProsCons({ block }: ProsConsProps) {
  const cons = (block.cons ?? []).filter((c): c is string => !!c)
  const pros = (block.pros ?? []).filter((p): p is string => !!p)
  if (cons.length === 0 && pros.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
      {cons.length > 0 && <List title={block.consTitle ?? 'What to avoid'} items={cons} tone="ink" />}
      {pros.length > 0 && <List title={block.prosTitle ?? 'What to do'} items={pros} tone="cyan" />}
    </div>
  )
}
