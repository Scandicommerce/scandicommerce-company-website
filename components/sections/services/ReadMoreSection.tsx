import type { ReactNode } from 'react'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'

interface ReadMoreSectionProps {
  eyebrow?: string
  title: string
  description?: string
  href: string
  linkText?: string
  /** Logo or small visual shown beside the text. */
  visual?: ReactNode
}

/** A wide hairline card that sends readers on to a deeper page on the same topic. */
export default function ReadMoreSection({ eyebrow, title, description, href, linkText = 'Les mer', visual }: ReadMoreSectionProps) {
  return (
    <section className="bg-white">
      <div className={`${ui.container} py-10 lg:py-16`}>
        <LocalizedLink
          href={href}
          className="group flex flex-col gap-6 rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-6 no-underline transition-colors hover:border-sc-ink-900 md:flex-row md:items-center md:gap-12 lg:p-10"
        >
          {visual && <div className="flex-none md:w-[200px]">{visual}</div>}
          <div className="flex-1">
            {eyebrow && <div className={`${ui.eyebrow} mb-2`}>{eyebrow}</div>}
            <h2 className="mb-2 text-[24px] font-bold leading-snug tracking-[-0.02em] text-sc-ink-900 lg:text-[32px]">{title}</h2>
            {description && <p className="m-0 max-w-[720px] text-base leading-relaxed text-sc-ink-600">{description}</p>}
          </div>
          <span className="flex-none text-sm font-semibold text-sc-ink-900">{linkText} →</span>
        </LocalizedLink>
      </div>
    </section>
  )
}
