interface HeroData {
  heroTitle?: {
    text?: string
    highlight?: string
  }
  heroDescription?: string
}

interface HeroProps {
  hero?: HeroData
  /** One pill per case card, linking to its anchor. */
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

export default function Hero({ hero, jumpLinks = [], lang = 'no' }: HeroProps) {
  const titleText = hero?.heroTitle?.text || ''
  const highlight = hero?.heroTitle?.highlight || ''
  const description = hero?.heroDescription

  const title =
    highlight && titleText.includes(highlight) ? (
      <>
        {titleText.split(highlight)[0]}
        <span className="text-sc-cyan-300">{highlight}</span>
        {titleText.split(highlight).slice(1).join(highlight)}
      </>
    ) : (
      titleText
    )

  return (
    <section className="bg-sc-ink-900 text-white">
      <div className="section_container mx-auto page-padding-x py-7 md:py-11 flex flex-col md:flex-row md:flex-wrap md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-2.5 md:flex-[1_1_520px]">
          <p className="m-0 text-[11px] md:text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">
            {EYEBROW[lang] ?? EYEBROW.en}
          </p>
          {titleText && (
            <h1 className="m-0 text-[28px] md:text-[40px] leading-[1.2] font-bold tracking-[-0.02em]">{title}</h1>
          )}
          {description && <p className="m-0 text-[15px] md:text-base leading-normal text-sc-ink-300">{description}</p>}
        </div>

        {jumpLinks.length > 1 && (
          <nav aria-label={JUMP_LABEL[lang] ?? JUMP_LABEL.en} className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
            {jumpLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="shrink-0 text-[13px] text-white no-underline border border-sc-ink-700 hover:border-sc-cyan-300 px-4 py-2.5 rounded-full transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  )
}
