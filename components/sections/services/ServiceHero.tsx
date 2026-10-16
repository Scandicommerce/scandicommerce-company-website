import type { ReactNode } from 'react'
import LocalizedLink from '@/components/ui/LocalizedLink'

interface ServiceHeroButton {
  text: string
  link: string
  variant?: 'primary' | 'secondary'
}

interface ServiceHeroProps {
  eyebrow?: string
  title: string
  /** Part of `title` rendered in brand cyan. */
  highlight?: string
  description?: string
  buttons?: ServiceHeroButton[]
  /** Short proof points under the buttons. */
  highlights?: string[]
  /** Right-hand column: an image, illustration or mockup. Omit for a text-only hero. */
  visual?: ReactNode
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

/** Two-column hero for the Tjenester pages: copy left, visual right. */
export default function ServiceHero({ eyebrow, title, highlight, description, buttons, highlights, visual }: ServiceHeroProps) {
  return (
    <section className="relative overflow-hidden bg-sc-ink-50">
      {/* Faint grid, fading out towards the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      {/* Cyan glow behind the visual */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-sc-cyan-500/10 blur-[140px]"
      />

      <div
        className={`section_container relative max-w-[1320px] mx-auto page-padding-x pt-16 pb-14 lg:pt-28 lg:pb-24 grid grid-cols-1 items-center gap-12 ${
          visual ? 'lg:grid-cols-[1.05fr_1fr] lg:gap-16' : ''
        }`}
      >
        <div className={visual ? '' : 'max-w-[760px]'}>
          {eyebrow && (
            <div className="text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-3">
              {eyebrow}
            </div>
          )}
          <h1 className="text-[36px] sm:text-[44px] lg:text-[60px] font-bold text-sc-ink-900 tracking-[-0.028em] leading-[1.02] mb-5 lg:mb-6">
            {renderTitle(title, highlight)}
          </h1>
          {description && (
            <p className="max-w-[580px] text-base lg:text-lg leading-relaxed text-sc-ink-600 m-0">{description}</p>
          )}

          {buttons && buttons.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {buttons.map((button, index) => {
                const primary = button.variant ? button.variant === 'primary' : index === 0
                return (
                  <LocalizedLink
                    key={button.link + button.text}
                    href={button.link}
                    className={
                      primary
                        ? 'inline-flex items-center justify-center rounded-lg bg-sc-ink-900 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-ink-700'
                        : 'inline-flex items-center justify-center rounded-lg border border-sc-ink-200 bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50'
                    }
                  >
                    {button.text}
                  </LocalizedLink>
                )
              })}
            </div>
          )}

          {highlights && highlights.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 list-none p-0 m-0 text-sm text-sc-ink-600">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sc-cyan-500" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {visual && <div className="relative">{visual}</div>}
      </div>
    </section>
  )
}
