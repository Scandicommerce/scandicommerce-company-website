import { Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { ui } from '@/components/integrations/labels'

interface HeroData {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
}

interface CardData {
  icon?: string
  title?: string
  subtitle?: string
  detail?: string
  href?: string
}

const ICONS: Record<string, LucideIcon> = { email: Mail, phone: Phone, location: MapPin }

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

/** Contact hero: heading and lead on the left, the three ways to reach us as a hairline panel on the right. */
export default function ContactHero({ hero, cards, eyebrow }: { hero?: HeroData; cards?: CardData[]; eyebrow: string }) {
  const title = hero?.heroTitle?.text ?? ''
  const list = (cards ?? []).filter((c) => c?.title)
  return (
    <section className="bg-white">
      <div className={`${ui.container} grid grid-cols-1 items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-20 lg:pt-16`}>
        <div>
          <div className={`${ui.eyebrow} mb-4`}>{eyebrow}</div>
          <h1 className="mb-5 text-[36px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 sm:text-[44px] lg:mb-6 lg:text-[56px]">{renderTitle(title, hero?.heroTitle?.highlight)}</h1>
          {hero?.heroDescription && <p className="m-0 max-w-[560px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{hero.heroDescription}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#book" className={ui.btnPrimary}>{eyebrow === 'Kontakt' ? 'Book en samtale' : 'Book a call'}</a>
            <a href="#melding" className={ui.btnSecondary}>{eyebrow === 'Kontakt' ? 'Send en melding' : 'Send a message'}</a>
          </div>
        </div>
        {list.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 p-0">
            {list.map((c, i) => {
              const Icon = ICONS[c.icon ?? ''] ?? Mail
              const body = (
                <>
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-sc-cyan-500 text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-bold leading-snug text-sc-ink-900">{c.title}</span>
                    {c.subtitle && <span className="block text-[13px] text-sc-ink-500">{c.subtitle}</span>}
                    {c.detail && <span className="mt-1 block font-mono text-[14px] text-sc-ink-900">{c.detail}</span>}
                  </span>
                </>
              )
              return (
                <li key={i}>
                  {c.href ? (
                    <a href={c.href} className="flex items-center gap-4 bg-white p-5 no-underline transition-colors hover:bg-sc-ink-50">{body}</a>
                  ) : (
                    <div className="flex items-center gap-4 bg-white p-5">{body}</div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
