import Link from 'next/link'
import { hrefFor } from '@/lib/routes'
import { ui } from './labels'

export type LinkDoc = {
  _id: string
  _type: string
  language?: string | null
  slug?: string | null
  title?: string | null
  excerpt?: string | null
}

/** "Les videre" style list: title + excerpt, bordered rows. */
export function LinkList({ items, pageLanguage, heading, eyebrow }: { items?: LinkDoc[] | null; pageLanguage: string; heading?: string; eyebrow?: string }) {
  const list = (items ?? []).filter((i) => i && i.slug && i.title)
  if (!list.length) return null
  return (
    <section className={`${ui.container} my-14`}>
      {eyebrow && <div className={`${ui.eyebrow} mb-3`}>{eyebrow}</div>}
      {heading && <h2 className="mb-5 text-2xl font-bold text-sc-ink-900">{heading}</h2>}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => {
          const cross = item.language && item.language !== pageLanguage
          return (
            <li key={item._id}>
              <Link
                href={hrefFor({ _type: item._type, slug: item.slug!, language: item.language ?? pageLanguage }, pageLanguage)}
                data-cross-locale={cross || undefined}
                className="flex flex-col gap-2 border-t border-sc-ink-200 py-5 text-sc-ink-900 hover:text-sc-cyan-600"
              >
                <span className="text-lg font-semibold">{item.title}</span>
                {item.excerpt && <span className="line-clamp-2 text-sm text-sc-ink-500">{item.excerpt}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-sc-ink-500">
      {items.map((it, i) => (
        <span key={`${it.label}-${i}`} className="flex gap-2">
          {it.href ? (
            <Link href={it.href} className="hover:text-sc-ink-900">
              {it.label}
            </Link>
          ) : (
            <span className="text-sc-ink-900">{it.label}</span>
          )}
          {i < items.length - 1 && <span aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  )
}

export function CtaBand({ heading, text, buttonLabel, buttonHref }: { heading: string; text?: string | null; buttonLabel: string; buttonHref: string }) {
  return (
    <section className="bg-sc-ink-900 py-16 text-white lg:py-20">
      <div className={`${ui.container} flex flex-wrap items-center justify-between gap-8`}>
        <div className="flex max-w-[640px] flex-col gap-3">
          <h2 className="text-[32px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]">{heading}</h2>
          {text && <p className="text-lg leading-relaxed text-sc-ink-200">{text}</p>}
        </div>
        <Link href={buttonHref} className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-[#1EEFFA] px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-teal">
          {buttonLabel}
        </Link>
      </div>
    </section>
  )
}

export function Faq({ items, heading }: { items?: { question: string; answer: string }[] | null; heading: string }) {
  if (!items?.length) return null
  return (
    <section id="faq" className="bg-sc-ink-50 py-16 lg:py-20">
      <div className="mx-auto max-w-[880px] px-5 lg:px-8">
        <h2 className="mb-8 text-[28px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[36px]">{heading}</h2>
        <div className="border-t border-sc-ink-200">
          {items.map((f, i) => (
            <details key={f.question} className="group border-b border-sc-ink-200 py-5" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-sc-ink-900">
                <h3 className="m-0 inline text-lg">{f.question}</h3>
                <span className="text-sc-ink-500 group-open:hidden">+</span>
                <span className="hidden text-sc-ink-500 group-open:inline">–</span>
              </summary>
              <p className="mt-3 leading-relaxed text-sc-ink-600">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
