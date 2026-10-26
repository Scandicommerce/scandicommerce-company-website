import { ui } from '@/components/integrations/labels'

interface HeroData {
  eyebrow?: string
  heroTitle?: {
    text?: string
    highlight?: string
  }
  heroDescription?: string
  /** Hide the per-case jump links (Sanity toggle). */
  hideJumpLinks?: boolean
}

interface HeroProps {
  hero?: HeroData
  /** One chip per case card, linking to its anchor. */
  jumpLinks?: { id: string; label: string }[]
  lang?: string
}

const EYEBROW: Record<string, string> = {
  no: 'Kundecaser',
  en: 'Case studies',
  sv: 'Kundcase',
  da: 'Kundecases',
  de: 'Kundenprojekte',
}

const JUMP_LABEL: Record<string, string> = {
  no: 'Hopp til case',
  en: 'Jump to case',
  sv: 'Hoppa till case',
  da: 'Spring til case',
  de: 'Zum Projekt springen',
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

/**
 * Compact text hero on the same surface as the Tjenester and Integrasjoner
 * heroes: copy left, one chip per case on the right so a visitor can jump
 * straight to the client they came for.
 */
export default function Hero({ hero, jumpLinks = [], lang = 'no' }: HeroProps) {
  const titleText = hero?.heroTitle?.text || ''
  const description = hero?.heroDescription
  const showJumps = !hero?.hideJumpLinks && jumpLinks.length > 1

  return (
    <section className="relative overflow-hidden bg-sc-ink-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className={`${ui.container} relative flex flex-col gap-8 pb-12 pt-14 lg:flex-row lg:items-end lg:justify-between lg:pb-16 lg:pt-20`}>
        <div className="flex max-w-[680px] flex-col gap-4">
          <div className={ui.eyebrow}>{hero?.eyebrow || EYEBROW[lang] || EYEBROW.en}</div>
          {titleText && (
            <h1 className="m-0 text-[36px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 sm:text-[44px] lg:text-[60px]">
              {renderTitle(titleText, hero?.heroTitle?.highlight)}
            </h1>
          )}
          {description && <p className="m-0 max-w-[580px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{description}</p>}
        </div>

        {showJumps && (
          <nav aria-label={JUMP_LABEL[lang] ?? JUMP_LABEL.en} className="flex flex-col gap-2.5 lg:max-w-[360px] lg:items-end">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-400">{JUMP_LABEL[lang] ?? JUMP_LABEL.en}</span>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {jumpLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="inline-flex items-center rounded-full border border-sc-ink-200 bg-white px-3 py-1.5 text-[13px] font-medium text-sc-ink-700 no-underline transition-colors hover:border-sc-ink-900 hover:text-sc-ink-900"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </section>
  )
}
