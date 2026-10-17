import ServiceHero from '@/components/sections/services/ServiceHero'
import { contactHref, publicPath, WORK_INDEX_SLUG } from '@/lib/routes'
import type { Language } from '@/lib/site-config'
import { SHOPIFY_T, shopifyLang } from './labels'

interface Stat {
  value?: string
  label?: string
}

export interface ShopifyHeroData {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
  stats?: Stat[]
}

interface ShopifyHeroProps {
  hero?: ShopifyHeroData
  eyebrow: string
  lang?: string
  /** Show the "see case studies" secondary button next to the contact CTA. */
  withCasesLink?: boolean
}

/**
 * The platform / POS hero on ServiceHero: eyebrow, heading with cyan
 * highlight, lead, ink + transparent buttons. Sanity stats (POS page) become
 * a mono stat panel in the visual column.
 */
export default function ShopifyHero({ hero, eyebrow, lang, withCasesLink = true }: ShopifyHeroProps) {
  const l = shopifyLang(lang)
  const t = SHOPIFY_T[l]
  const language = lang ?? l
  const title = hero?.heroTitle?.text ?? ''
  const stats = (hero?.stats ?? []).filter((s) => s?.value || s?.label)

  const buttons = [
    { text: t.bookCall, link: contactHref(language), variant: 'primary' as const },
    ...(withCasesLink
      ? [{ text: t.seeCases, link: publicPath(language, WORK_INDEX_SLUG[language as Language] ?? 'work'), variant: 'secondary' as const }]
      : []),
  ]

  const visual =
    stats.length > 0 ? (
      <dl className="m-0 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 sm:grid-cols-3 lg:grid-cols-1">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-1 bg-white p-5 lg:p-6">
            <dt className="font-mono text-[28px] font-medium leading-none tracking-tight text-sc-ink-900 lg:text-[36px]">{s.value}</dt>
            <dd className="m-0 text-[14px] leading-snug text-sc-ink-500">{s.label}</dd>
          </div>
        ))}
      </dl>
    ) : undefined

  return (
    <ServiceHero
      eyebrow={eyebrow}
      title={title}
      highlight={hero?.heroTitle?.highlight}
      description={hero?.heroDescription}
      buttons={buttons}
      visual={visual}
      visualFrame={false}
    />
  )
}
