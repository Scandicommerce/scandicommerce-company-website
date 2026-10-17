import { ui } from '@/components/integrations/labels'

interface Stat {
  value?: string
  label?: string
}

interface HeroData {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
  stats?: Stat[]
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) return title
  const [before, ...rest] = title.split(highlight)
  return (
    <>
      {before}
      <span className="text-sc-cyan-500">{highlight}</span>
      {rest.join(highlight)}
    </>
  )
}

/** About hero: eyebrow, large heading, lead and the proof points as a mono stat row. */
export default function AboutHero({ hero, eyebrow }: { hero?: HeroData; eyebrow: string }) {
  const title = hero?.heroTitle?.text ?? ''
  const stats = (hero?.stats ?? []).filter((s) => s?.value || s?.label)
  return (
    <section className="bg-white">
      <div className={`${ui.container} pb-14 pt-10 lg:pb-20 lg:pt-16`}>
        <div className="max-w-[820px]">
          <div className={`${ui.eyebrow} mb-4`}>{eyebrow}</div>
          <h1 className="mb-5 text-[36px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 sm:text-[44px] lg:mb-6 lg:text-[60px]">{renderTitle(title, hero?.heroTitle?.highlight)}</h1>
          {hero?.heroDescription && <p className="m-0 max-w-[640px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{hero.heroDescription}</p>}
        </div>
        {stats.length > 0 && (
          <dl className="m-0 mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-1 bg-white p-5 lg:p-6">
                <dt className="font-mono text-[28px] font-medium leading-none tracking-tight text-sc-ink-900 lg:text-[36px]">{s.value}</dt>
                <dd className="m-0 text-[14px] leading-snug text-sc-ink-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
