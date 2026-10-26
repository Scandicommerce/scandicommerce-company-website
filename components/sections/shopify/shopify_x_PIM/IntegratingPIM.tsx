import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'

export interface ImpactPanelProps {
  eyebrow?: string
  title?: string
  description?: string
  leftTitle?: string
  leftDescription?: string
  points?: string[]
  impactTitle?: string
  impactParagraph1?: string
  impactParagraph2?: string
  linkText?: string
  href?: string
  tone?: 'white' | 'ink'
  /** Render only the two cards, no section wrapper or heading (for stacked lists). */
  bare?: boolean
}

export function resolveHref(slug?: string | null, href?: string | null) {
  return slug ? `/${slug}` : href || '/contact'
}

export function Bullet({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <li className={`flex items-start gap-2.5 text-[15px] leading-relaxed ${dark ? 'text-sc-ink-200' : 'text-sc-ink-600'}`}>
      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-sc-cyan-500" />
      <span className="min-w-0">{children}</span>
    </li>
  )
}

function ImpactLink({ href, text }: { href: string; text: string }) {
  const cls = 'inline-flex items-center gap-1.5 text-[15px] font-semibold text-sc-ink-900 underline-offset-4 hover:text-sc-cyan-600 hover:underline'
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {text} <span aria-hidden="true">&rarr;</span>
      </a>
    )
  }
  return (
    <LocalizedLink href={href} className={cls}>
      {text} <span aria-hidden="true">&rarr;</span>
    </LocalizedLink>
  )
}

/** Two hairline cards: an ink panel with the bullet list, a white panel with the impact copy and link. */
export function ImpactCards({ leftTitle, leftDescription, points, impactTitle, impactParagraph1, impactParagraph2, linkText, href }: ImpactPanelProps) {
  const list = (points ?? []).filter(Boolean)
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-sc-ink-100 lg:grid-cols-2">
      <div className="flex flex-col gap-4 bg-sc-ink-900 p-6 text-white lg:p-8">
        {leftTitle && <h3 className="m-0 text-[20px] font-bold leading-snug tracking-[-0.01em]">{leftTitle}</h3>}
        {leftDescription && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-200">{leftDescription}</p>}
        {list.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {list.map((point, i) => (
              <Bullet key={i} dark>
                {point}
              </Bullet>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 bg-white p-6 lg:p-8">
        {impactTitle && <div className={ui.eyebrow}>{impactTitle.replace(/:\s*$/, '')}</div>}
        {impactParagraph1 && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600 lg:text-base">{impactParagraph1}</p>}
        {impactParagraph2 && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600 lg:text-base">{impactParagraph2}</p>}
        {linkText && href && <ImpactLink href={href} text={linkText} />}
      </div>
    </div>
  )
}

export function ImpactPanel(props: ImpactPanelProps) {
  const { eyebrow, title, description, tone = 'ink', bare } = props
  if (bare) return <ImpactCards {...props} />
  return (
    <section className={`${tone === 'ink' ? 'bg-sc-ink-50' : 'bg-white'} py-16 lg:py-20`}>
      <div className={`${ui.container} flex flex-col gap-10`}>
        {(title || description) && (
          <div className="flex max-w-[680px] flex-col gap-2.5">
            {eyebrow && <div className={ui.eyebrow}>{eyebrow}</div>}
            {title && <h2 className={ui.h2}>{title}</h2>}
            {description && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{description}</p>}
          </div>
        )}
        <ImpactCards {...props} />
      </div>
    </section>
  )
}

interface IntegratingPimData {
  title?: string
  description?: string
  leftColumnTitle?: string
  leftColumnDescription?: string
  integrationPoints?: string[]
  impactTitle?: string
  impactParagraph1?: string
  impactParagraph2?: string
  linkText?: string
  linkSlug?: string | null
  linkHref?: string | null
}

export default function IntegratingPIM({ integratingPim, lang = 'no' }: { integratingPim?: IntegratingPimData; lang?: string }) {
  if (!integratingPim) return null
  return (
    <ImpactPanel
      eyebrow={lang === 'no' ? 'Integrasjon' : 'Integration'}
      title={integratingPim.title}
      description={integratingPim.description}
      leftTitle={integratingPim.leftColumnTitle}
      leftDescription={integratingPim.leftColumnDescription}
      points={integratingPim.integrationPoints}
      impactTitle={integratingPim.impactTitle}
      impactParagraph1={integratingPim.impactParagraph1}
      impactParagraph2={integratingPim.impactParagraph2}
      linkText={integratingPim.linkText}
      href={resolveHref(integratingPim.linkSlug, integratingPim.linkHref)}
    />
  )
}
