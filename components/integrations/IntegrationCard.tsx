import Link from 'next/link'
import { hrefFor } from '@/lib/routes'
import { CAPABILITY_LABEL, METHOD_LABEL, STATUS_LABEL, T, lang, ui, type IntegrationCard as Card } from './labels'

function directionLabel(item: Card): string | null {
  const from = item.firstStep?.from?.toLowerCase()
  const to = item.firstStep?.to?.toLowerCase()
  if (!from || !to) return null
  return item.syncDirection === 'two-way' ? `${from} ⇄ ${to}` : `${from} → ${to}`
}

export default function IntegrationCard({ item, language }: { item: Card; language: string }) {
  const l = lang(language)
  const t = T[l]
  const method = item.integrationMethod ? METHOD_LABEL[item.integrationMethod]?.[l] : null
  const status = item.status === 'pilot' ? STATUS_LABEL.pilot[l] : null
  const dir = directionLabel(item)
  return (
    <Link href={hrefFor({ _type: 'integrationPage', slug: item.slug, language: item.language ?? language }, language)} className={ui.card}>
      <div className="flex items-center justify-between gap-3">
        {item.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.logoUrl} alt={item.integrationName} className="h-7 w-auto max-w-[150px] object-contain object-left" loading="lazy" />
        ) : (
          <span className={`${ui.mono} rounded-md border border-dashed border-sc-ink-200 px-3 py-2`}>{item.integrationName}</span>
        )}
        <span className="flex gap-1.5">
          {status && <span className={ui.tagOutline}>{status}</span>}
          {method && <span className={ui.tag}>{method}</span>}
        </span>
      </div>
      <span className="text-xl font-semibold text-sc-ink-900">{item.integrationName}</span>
      {item.shortDescription && <span className="text-[15px] leading-relaxed text-sc-ink-600">{item.shortDescription}</span>}
      {item.capabilities?.length ? (
        <span className="flex flex-wrap gap-1.5">
          {item.capabilities.map((c) => (
            <span key={c} className={ui.chip}>
              {CAPABILITY_LABEL[c]?.[l] ?? c}
            </span>
          ))}
        </span>
      ) : null}
      <span className="mt-auto flex items-center justify-between border-t border-sc-ink-100 pt-2">
        <span className={ui.mono}>{dir ?? item.category?.title ?? ''}</span>
        <span className="text-sm font-medium text-sc-cyan-600">{t.readMore} →</span>
      </span>
    </Link>
  )
}
