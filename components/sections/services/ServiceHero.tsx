import type { ReactNode } from 'react'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'

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
  /** Wrap the visual in the hairline panel the integrations pages use. Off for visuals that bring their own frame. */
  visualFrame?: boolean
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
 * Hero for the Tjenester pages, on the integrations hero: white surface,
 * eyebrow, large heading, lead, ink/transparent buttons and proof points.
 * The visual sits to the right in a hairline panel.
 */
export default function ServiceHero({ eyebrow, title, highlight, description, buttons, highlights, visual, visualFrame = true }: ServiceHeroProps) {
  return (
    <section className="bg-white">
      <div
        className={`${ui.container} grid grid-cols-1 items-center gap-12 pb-14 pt-14 lg:pb-20 lg:pt-20 ${
          visual ? 'lg:grid-cols-[1.05fr_1fr] lg:gap-16' : ''
        }`}
      >
        <div className={visual ? '' : 'max-w-[760px]'}>
          {eyebrow && <div className={`${ui.eyebrow} mb-4`}>{eyebrow}</div>}
          <h1 className="mb-5 text-[36px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 sm:text-[44px] lg:mb-6 lg:text-[60px]">
            {renderTitle(title, highlight)}
          </h1>
          {description && <p className="m-0 max-w-[580px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{description}</p>}

          {buttons && buttons.length > 0 && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {buttons.map((button, index) => {
                const primary = button.variant ? button.variant === 'primary' : index === 0
                return (
                  <LocalizedLink key={button.link + button.text} href={button.link} className={primary ? ui.btnPrimary : ui.btnSecondary}>
                    {button.text}
                  </LocalizedLink>
                )
              })}
            </div>
          )}

          {highlights && highlights.length > 0 && (
            <ul className="m-0 mt-8 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm text-sc-ink-600">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sc-cyan-500" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {visual && (
          <div className={visualFrame ? 'relative rounded-lg border border-sc-ink-100 bg-sc-ink-50 px-10 pt-8 pb-12 lg:px-12 lg:pt-10 lg:pb-14' : 'relative'}>{visual}</div>
        )}
      </div>
    </section>
  )
}
