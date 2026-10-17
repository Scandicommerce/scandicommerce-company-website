import type { FaqBlock } from '@/lib/blogBuilder'
import { H2 } from './labels'

interface FAQProps {
  block: FaqBlock
}

/** Questions as the site's details/summary list on hairline rules. */
export default function FAQ({ block }: FAQProps) {
  const items = (block.items ?? []).filter((i) => i && (i.question || i.answer))
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-5">
      {block.title && <h2 className={H2}>{block.title}</h2>}
      <div className="border-t border-sc-ink-200">
        {items.map((item, i) => (
          <details key={i} className="group border-b border-sc-ink-200 py-4" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold leading-snug text-sc-ink-900 [&::-webkit-details-marker]:hidden">
              <h3 className="m-0 inline text-[17px]">{item.question ?? ''}</h3>
              <span aria-hidden="true" className="text-sc-ink-500 group-open:hidden">+</span>
              <span aria-hidden="true" className="hidden text-sc-ink-500 group-open:inline">–</span>
            </summary>
            <p className="m-0 mt-3 whitespace-pre-line text-base leading-relaxed text-sc-ink-600">{item.answer ?? ''}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
