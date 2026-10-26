import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { ui } from '@/components/integrations/labels'
import { CtaBand, Faq } from '@/components/integrations/LinkBlocks'
import { docHref, hrefFor } from '@/lib/routes'
import UcpFlowPlayer from './UcpFlowPlayer'

/**
 * Service pillars (schemaType "Service", e.g. Agentisk handel, Bli partner) as a landing
 * page: hero with actions, one band per section (heading left, content right), rich blocks
 * for stats, steps, cards, callouts, tables and animations, then FAQ, links and the CTA band.
 * Everything comes from the pillar document in Sanity.
 */

type Block = { _type: string; _key: string; [k: string]: unknown }
export interface ServicePillarSection {
  _key: string
  id: string
  heading: string
  body?: Block[]
}
interface LinkDoc {
  _id: string
  _type: string
  language?: string | null
  slug?: string | null
  title?: string | null
  excerpt?: string | null
}
export interface ServicePillarProps {
  language: string
  eyebrow?: string | null
  pageTitle: string
  definition?: string | null
  author?: { name?: string; role?: string; slug?: string } | null
  updated?: Date | null
  sections: ServicePillarSection[]
  faq?: { question: string; answer: string }[]
  cta?: { heading: string; text?: string; buttonLabel: string; buttonHref: string }
  links?: { heading: string; items?: LinkDoc[] | null }[]
  labels: { faq: string; by: string; updated: string }
}

const text: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-[17px] leading-[1.7] text-sc-ink-600">{children}</p>,
    h3: ({ children }) => <h3 className="mt-2 text-xl font-semibold text-sc-ink-900">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="flex flex-col gap-2 pl-5 list-disc text-[17px] leading-[1.6] text-sc-ink-600">{children}</ul>,
    number: ({ children }) => <ol className="flex flex-col gap-2 pl-5 list-decimal text-[17px] leading-[1.6] text-sc-ink-600">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value?.href as string) || '#'
      const external = !href.startsWith('/') && !href.startsWith('#')
      return (
        <a href={href} className="text-sc-cyan-600 underline underline-offset-2 hover:text-sc-cyan-700" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      )
    },
    strong: ({ children }) => <strong className="font-semibold text-sc-ink-900">{children}</strong>,
  },
}

function Stats({ stats }: { stats?: { value: string; label: string }[] }) {
  if (!stats?.length) return null
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-sc-ink-100 bg-sc-ink-100">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-2 bg-white p-5 lg:p-6">
          <span className="whitespace-nowrap text-[30px] font-bold leading-none tracking-[-0.02em] text-sc-ink-900 lg:text-[40px]">{s.value}</span>
          <span className="text-sm leading-snug text-sc-ink-500">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function Steps({ steps, numbered }: { steps?: { _key?: string; title: string; text: string; meta?: string }[]; numbered?: boolean }) {
  if (!steps?.length) return null
  if (numbered === false) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {steps.map((s) => (
          <div key={s._key ?? s.title} className="flex flex-col gap-2 rounded-[10px] border border-sc-ink-100 bg-white p-6">
            <h3 className="text-lg font-semibold leading-snug text-sc-ink-900">{s.title}</h3>
            <p className="text-[15px] leading-relaxed text-sc-ink-600">{s.text}</p>
            {s.meta && <span className={`${ui.mono} mt-auto pt-2`}>{s.meta}</span>}
          </div>
        ))}
      </div>
    )
  }
  return (
    <ol className="flex flex-col">
      {steps.map((s, i) => (
        <li key={s._key ?? s.title} className="grid grid-cols-[44px_1fr] gap-4 border-t border-sc-ink-100 py-6 first:border-t-0 first:pt-0 last:pb-0">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sc-ink-900 font-mono text-sm text-white">{String(i + 1).padStart(2, '0')}</span>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold text-sc-ink-900">{s.title}</h3>
              {s.meta && <span className={ui.tag}>{s.meta}</span>}
            </div>
            <p className="text-[16px] leading-relaxed text-sc-ink-600">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Callout({ title, content, variant }: { title?: string; content?: string; variant?: string }) {
  if (!content) return null
  const quote = variant === 'tldr'
  return (
    <figure className={`rounded-[10px] p-6 lg:p-7 ${quote ? 'border-l-4 border-sc-cyan-500 bg-sc-cyan-50' : 'border border-sc-ink-100 bg-sc-ink-50'}`}>
      <blockquote className={`${quote ? 'text-xl font-medium leading-snug text-sc-ink-900 lg:text-[22px]' : 'text-[16px] leading-relaxed text-sc-ink-700'}`}>{content}</blockquote>
      {title && <figcaption className={`${ui.mono} mt-3`}>{title}</figcaption>}
    </figure>
  )
}

function Table({ title, columns, rows }: { title?: string; columns?: string[]; rows?: { cells?: string[] }[] }) {
  if (!rows?.length) return null
  return (
    <div className="overflow-x-auto rounded-[10px] border border-sc-ink-100">
      <table className="w-full min-w-[520px] text-left text-[15px]">
        {title && <caption className="px-5 pt-4 text-left text-sm font-semibold text-sc-ink-900">{title}</caption>}
        {columns?.length ? (
          <thead className="bg-sc-ink-50 text-sc-ink-500">
            <tr>{columns.map((c) => <th key={c} className="px-5 py-3 font-semibold">{c}</th>)}</tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-sc-ink-100">
              {(r.cells ?? []).map((c, j) => <td key={j} className={`px-5 py-3 align-top ${j === 0 ? 'font-medium text-sc-ink-900' : 'text-sc-ink-600'}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Render a section body: consecutive text blocks go through PortableText, rich blocks get their own components. */
function Body({ blocks, language }: { blocks?: Block[]; language: string }) {
  if (!blocks?.length) return null
  const groups: (Block | Block[])[] = []
  for (const b of blocks) {
    if (b._type === 'block') {
      const last = groups[groups.length - 1]
      if (Array.isArray(last)) last.push(b)
      else groups.push([b])
    } else groups.push(b)
  }
  return (
    <div className="flex min-w-0 flex-col gap-6">
      {groups.map((g, i) => {
        if (Array.isArray(g)) return <div key={i} className="flex flex-col gap-4"><PortableText value={g as never} components={text} /></div>
        switch (g._type) {
          case 'statsRowBlock':
            return <Stats key={g._key} stats={g.stats as never} />
          case 'stepsBlock':
            return <Steps key={g._key} steps={g.steps as never} numbered={g.numbered as boolean | undefined} />
          case 'calloutBlock':
            return <Callout key={g._key} title={g.title as string} content={g.content as string} variant={g.variant as string} />
          case 'tableBlock':
            return <Table key={g._key} title={g.title as string} columns={g.columns as string[]} rows={g.rows as never} />
          case 'animationBlock':
            return g.animation === 'ucp-flow' ? <UcpFlowPlayer key={g._key} lang={language} caption={g.caption as string} /> : null
          default:
            return null
        }
      })}
    </div>
  )
}

const WIDE = new Set(['animationBlock'])

export default function ServicePillar(p: ServicePillarProps) {
  const howSection = p.sections.find((s) => s.body?.some((b) => b._type === 'stepsBlock' && b.numbered !== false)) ?? p.sections[0]
  return (
    <>
      {/* Hero */}
      <section className="border-b border-sc-ink-100 bg-white">
        <div className={`${ui.container} py-14 lg:py-24`}>
          <div className="flex max-w-[820px] flex-col gap-5">
            {p.eyebrow && <span className={ui.eyebrow}>{p.eyebrow}</span>}
            <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-sc-ink-900 lg:text-[56px]">{p.pageTitle}</h1>
            {p.definition && (
              <p className="max-w-[720px] text-lg leading-relaxed text-sc-ink-600 lg:text-xl" data-definition>
                {p.definition}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-3">
              {p.cta && (
                <Link href={p.cta.buttonHref} className={ui.btnPrimary}>
                  {p.cta.buttonLabel}
                </Link>
              )}
              {howSection && (
                <a href={`#${howSection.id}`} className={ui.btnSecondary}>
                  {howSection.heading} ↓
                </a>
              )}
            </div>
            {(p.author?.name || p.updated) && (
              <p className="text-sm text-sc-ink-500">
                {p.author?.name && (
                  <>
                    {p.labels.by}{' '}
                    {p.author.slug ? (
                      <Link href={docHref({ _type: 'author', slug: p.author.slug, language: p.language })} className="font-medium text-sc-ink-900 hover:text-sc-cyan-600">
                        {p.author.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-sc-ink-900">{p.author.name}</span>
                    )}
                    {p.author.role ? `, ${p.author.role}` : ''}
                  </>
                )}
                {p.author?.name && p.updated ? ' · ' : ''}
                {p.updated && (
                  <time dateTime={p.updated.toISOString()}>
                    {p.labels.updated} {p.updated.toLocaleDateString(p.language === 'no' ? 'nb-NO' : p.language, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Sections */}
      {p.sections.map((s, i) => {
        const wide = s.body?.some((b) => WIDE.has(b._type))
        return (
          <section key={s._key} id={s.id} className={`scroll-mt-24 ${i % 2 === 1 ? 'bg-sc-ink-50' : 'bg-white'}`}>
            <div className={`${ui.container} py-14 lg:py-20`}>
              <div className={wide ? 'flex flex-col gap-8' : 'grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)] lg:gap-16'}>
                <div className={`flex min-w-0 flex-col gap-3 ${wide ? '' : 'lg:sticky lg:top-28 lg:self-start'}`}>
                  <span className={ui.mono}>{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-sc-ink-900 lg:text-[36px]">{s.heading}</h2>
                </div>
                <Body blocks={s.body} language={p.language} />
              </div>
            </div>
          </section>
        )
      })}

      <Faq items={p.faq} heading={p.labels.faq} />

      {p.links?.map((l) => {
        const items = (l.items ?? []).filter((x) => x && x.slug && x.title)
        if (!items.length) return null
        return (
          <section key={l.heading} className="bg-white py-14 lg:py-16">
            <div className={ui.container}>
              <h2 className="mb-6 text-2xl font-bold text-sc-ink-900">{l.heading}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <li key={item._id}>
                    <Link href={hrefFor({ _type: item._type, slug: item.slug!, language: item.language ?? p.language }, p.language)} className={`${ui.card} h-full`}>
                      <span className="text-lg font-semibold leading-snug text-sc-ink-900">{item.title}</span>
                      {item.excerpt && <span className="line-clamp-3 text-[15px] leading-relaxed text-sc-ink-600">{item.excerpt}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )
      })}

      {p.cta && <CtaBand heading={p.cta.heading} text={p.cta.text} buttonLabel={p.cta.buttonLabel} buttonHref={p.cta.buttonHref} />}
    </>
  )
}
