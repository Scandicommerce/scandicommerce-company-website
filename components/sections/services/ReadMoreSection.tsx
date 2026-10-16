import type { ReactNode } from 'react'
import LocalizedLink from '@/components/ui/LocalizedLink'

interface ReadMoreSectionProps {
  eyebrow?: string
  title: string
  description?: string
  href: string
  linkText?: string
  /** Logo or small visual shown beside the text. */
  visual?: ReactNode
}

/** A wide card that sends readers on to a deeper page on the same topic. */
export default function ReadMoreSection({ eyebrow, title, description, href, linkText = 'Les mer', visual }: ReadMoreSectionProps) {
  return (
    <section className="bg-white">
      <div className="section_container max-w-[1320px] mx-auto page-padding-x py-10 lg:py-16">
        <LocalizedLink
          href={href}
          className="group flex flex-col md:flex-row md:items-center gap-6 md:gap-12 rounded-2xl border border-sc-ink-100 bg-sc-ink-50 p-6 lg:p-10 transition-shadow hover:shadow-[0_10px_30px_rgba(22,167,179,0.15)]"
        >
          {visual && <div className="flex-none md:w-[220px]">{visual}</div>}
          <div className="flex-1">
            {eyebrow && (
              <div className="text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-2">
                {eyebrow}
              </div>
            )}
            <h2 className="text-[24px] lg:text-[32px] font-bold text-sc-ink-900 tracking-[-0.02em] leading-snug mb-2">
              {title}
            </h2>
            {description && (
              <p className="max-w-[720px] text-sm lg:text-[15px] leading-relaxed text-sc-ink-600 m-0">{description}</p>
            )}
          </div>
          <span className="flex-none text-sm font-semibold text-sc-cyan-500 group-hover:text-sc-cyan-600">
            {linkText} →
          </span>
        </LocalizedLink>
      </div>
    </section>
  )
}
