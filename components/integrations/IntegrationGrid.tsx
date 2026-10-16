'use client'

import { useMemo, useState } from 'react'
import IntegrationCard from './IntegrationCard'
import { METHOD_LABEL, T, lang, type CategorySummary, type IntegrationCard as Card } from './labels'

const METHODS = ['make', 'code', 'app', 'connector'] as const

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'h-9 rounded-full border border-sc-ink-900 bg-sc-ink-900 px-3.5 text-sm font-medium text-white'
          : 'h-9 rounded-full border border-sc-ink-200 bg-white px-3.5 text-sm font-medium text-sc-ink-900 hover:border-sc-ink-400'
      }
    >
      {children}
    </button>
  )
}

/**
 * Filterable grid of integration cards. Categories are optional: the hub passes
 * them all, a category page passes none and shows only the method filter.
 */
export default function IntegrationGrid({
  items,
  categories,
  language,
}: {
  items: Card[]
  categories?: CategorySummary[]
  language: string
}) {
  const l = lang(language)
  const t = T[l]
  const [category, setCategory] = useState<string | null>(null)
  const [method, setMethod] = useState<string | null>(null)

  const visible = useMemo(
    () => items.filter((i) => (!category || i.category?.key === category) && (!method || i.integrationMethod === method)),
    [items, category, method]
  )
  const usedMethods = METHODS.filter((m) => items.some((i) => i.integrationMethod === m))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2">
        {categories && categories.length > 0 && (
          <>
            <span className="mr-2 text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">{t.category}</span>
            <Chip active={category === null} onClick={() => setCategory(null)}>
              {t.all}
            </Chip>
            {categories.map((c) => (
              <Chip key={c.key} active={category === c.key} onClick={() => setCategory(category === c.key ? null : c.key)}>
                {c.title}
              </Chip>
            ))}
            <span className="mx-2 h-6 w-px bg-sc-ink-200" aria-hidden="true" />
          </>
        )}
        <span className="mr-2 text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">{t.method}</span>
        {usedMethods.map((m) => (
          <Chip key={m} active={method === m} onClick={() => setMethod(method === m ? null : m)}>
            {METHOD_LABEL[m][l]}
          </Chip>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <IntegrationCard key={item._id} item={item} language={language} />
        ))}
      </div>
      {visible.length === 0 && <p className="text-sc-ink-500">{l === 'no' ? 'Ingen treff.' : 'No matches.'}</p>}
    </div>
  )
}
