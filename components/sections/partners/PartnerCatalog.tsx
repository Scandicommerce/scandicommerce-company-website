'use client'

import { useMemo, useState } from 'react'
import { ui } from '@/components/integrations/labels'
import { partnerCategories, type PartnerEntry } from '@/lib/partnersCatalog'
import PartnerLogo from './PartnerLogo'

const T = {
  no: { eyebrow: 'Alle partnere', heading: 'Finn riktig partner for butikken din', lead: 'Filtrer på fagområde eller søk etter navn. Hver partner har en grunn til å være her.', all: 'Alle', search: 'Søk etter partner', showing: (a: number, b: number) => `Viser ${a} av ${b} partnere`, why: 'Hvorfor vi valgte dem', get: 'Det du får', none: 'Ingen treff. Prøv et annet søk, eller', ask: 'spør oss', nonePost: '– vi kjenner som regel noen.' },
  en: { eyebrow: 'All partners', heading: 'Find the right partner for your store', lead: 'Filter by discipline or search by name. Every partner has a reason to be here.', all: 'All', search: 'Search partners', showing: (a: number, b: number) => `Showing ${a} of ${b} partners`, why: 'Why we chose them', get: 'What you get', none: 'No matches. Try another search, or', ask: 'ask us', nonePost: '– we usually know someone.' },
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * Filterable partner grid. Category chips scroll sideways on phones and wrap
 * on desktop; the search box matches name, reason and outcome.
 */
export default function PartnerCatalog({ partners, lang, contactHref }: { partners: PartnerEntry[]; lang: string; contactHref: string }) {
  const t = lang === 'no' ? T.no : T.en
  const [cat, setCat] = useState<string>('alle')
  const [q, setQ] = useState('')
  const counts = useMemo(() => {
    const m: Record<string, number> = { alle: partners.length }
    for (const p of partners) m[p.category] = (m[p.category] ?? 0) + 1
    return m
  }, [partners])
  const list = useMemo(() => {
    const needle = norm(q.trim())
    return partners.filter((p) => (cat === 'alle' || p.category === cat) && (!needle || norm(`${p.name} ${p.why} ${p.together} ${p.badge}`).includes(needle)))
  }, [partners, cat, q])
  const chips = [{ key: 'alle', title: t.all }, ...partnerCategories.filter((c) => counts[c.key])]

  return (
    <section id="katalog" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>{t.eyebrow}</div>
            <h2 className={ui.h2}>{t.heading}</h2>
          </div>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{t.lead}</p>
        </div>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [scrollbar-width:none]" role="group" aria-label={t.eyebrow}>
            {chips.map((c) => {
              const on = cat === c.key
              return (
                <button key={c.key} type="button" aria-pressed={on} onClick={() => setCat(c.key)} className={`inline-flex min-h-[40px] flex-none items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors ${on ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-200 bg-white text-sc-ink-900 hover:border-sc-ink-900'}`}>
                  {c.title}
                  <span className={`font-mono text-xs ${on ? 'text-sc-cyan-300' : 'text-sc-ink-500'}`}>{counts[c.key] ?? 0}</span>
                </button>
              )
            })}
          </div>
          <label className="flex min-h-[44px] items-center gap-2.5 rounded-lg border border-sc-ink-200 bg-white px-3.5 focus-within:border-sc-cyan-500 focus-within:ring-2 focus-within:ring-sc-cyan-500/20 lg:w-[280px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a6670" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <span className="sr-only">{t.search}</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="min-w-0 flex-1 bg-transparent text-[15px] text-sc-ink-900 outline-none placeholder:text-sc-ink-400" />
          </label>
        </div>

        <p className="mb-4 text-sm text-sc-ink-500" aria-live="polite">{t.showing(list.length, partners.length)}</p>

        {list.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {list.map((p) => (
              <li key={p.slug} className={`${ui.card} min-w-0 hover:-translate-y-1`}>
                <div className="flex items-center gap-3">
                  <PartnerLogo partner={p} size={44} />
                  <div className="min-w-0">
                    <h3 className="m-0 truncate text-[17px] font-bold leading-tight text-sc-ink-900">{p.name}</h3>
                    <div className={`${ui.eyebrow} mt-0.5 truncate text-[11px]`}>{partnerCategories.find((c) => c.key === p.category)?.title}</div>
                  </div>
                </div>
                <span className={ui.tag}>{p.badge}</span>
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sc-ink-500">{t.why}</div>
                  <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{p.why}</p>
                </div>
                <div className="border-t border-sc-ink-100 pt-3.5">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sc-ink-500">{t.get}</div>
                  <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{p.together}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-dashed border-sc-ink-300 bg-white p-10 text-center text-sc-ink-600">
            {t.none} <a href={contactHref} className="font-semibold text-sc-cyan-700 underline">{t.ask}</a> {t.nonePost}
          </div>
        )}
      </div>
    </section>
  )
}
