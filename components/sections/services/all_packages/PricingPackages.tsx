import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'
import PackageMatrix from './PackageMatrix'
import { PACKAGE_TIERS, type PackageTier } from '@/lib/packageMatrix'

interface Package {
  title: string
  subtitle: string
  price: string
  priceType: string
  timeline: string
  rating: number
  ratingValue: string
  bestFor: string[]
  included: string[]
  description: string
  /** Resolved from page->slug.current (preferred) */
  slug?: string | null
  /** Fallback custom link set in Sanity */
  href?: string | null
  /** Resolved slug from bookCallPage reference (preferred). */
  bookCallSlug?: string | null
  /** Custom link for Book Call when no page is selected (path or URL). */
  bookCallHref?: string | null
}

interface PackagesData {
  packagesItems?: Package[]
}

interface PricingPackagesProps {
  packages?: PackagesData
  lang?: string
}

/** Sanity entries often start with a check mark; the UI draws its own. */
const clean = (s: string) => s.replace(/^[\s✓✔☑•-]+/, '').trim()
const handleOf = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/** Resolves Book Call URL: page slug (preferred), then custom href, then /contact. */
function resolveBookCallHref(pkg: Package): string {
  if (pkg.bookCallSlug) return `/${pkg.bookCallSlug}`
  if (pkg.bookCallHref) return pkg.bookCallHref
  return '/contact'
}

interface Labels {
  eyebrow: string
  heading: string
  lead: string
  viewDetails: string
  bookCall: string
  bestFor: string
  whatsIncluded: string
  perMonth: string
  recommended: string
  compare: string
  exVat: string
}

const CHECK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)

/**
 * One tier column: name, one-line promise, mono price, the "everything in"
 * pill, audience, deliverables as a check list and the actions. Price comes from Sanity.
 */
function PackageCard({ pkg, labels, featured, lang }: { pkg: Package; labels: Labels; featured: boolean; lang: string }) {
  const included = (pkg.included ?? []).map(clean).filter(Boolean)
  const inherits = included.find((s) => /^(alt i|everything in)\s/i.test(s))
  const items = included.filter((s) => s !== inherits).slice(0, 7)
  const bookHref = resolveBookCallHref(pkg)
  const detailHref = pkg.slug ? `/${pkg.slug}` : pkg.href || null
  const price = pkg.price
  const custom = /tilpass|custom|avtale/i.test(pkg.price)
  const muted = featured ? 'text-sc-ink-300' : 'text-sc-ink-500'
  const body = featured ? 'text-sc-ink-200' : 'text-sc-ink-600'

  return (
    <div className={`relative flex min-w-0 flex-col gap-5 rounded-lg border p-6 lg:p-7 ${featured ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-100 bg-white text-sc-ink-900'}`}>
      {featured && <span className="absolute -top-3 left-6 inline-flex items-center rounded-md bg-sc-cyan-500 px-2.5 py-1 text-xs font-semibold text-sc-ink-900">{labels.recommended}</span>}
      <div className="flex flex-col gap-1.5">
        <h3 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em]">{pkg.title}</h3>
        {pkg.subtitle && <p className={`m-0 text-[15px] leading-snug ${body}`}>{pkg.subtitle}</p>}
      </div>

      <div>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-mono text-[30px] font-medium tracking-tight">{price}</span>
          <span className={`text-sm ${muted}`}>{labels.perMonth}</span>
        </div>
        <div className={`mt-1 text-[13px] ${muted}`}>{custom ? (lang === 'no' ? 'Tilpasses omfang. ' : 'Scoped to fit. ') : ''}{labels.exVat}</div>
      </div>

      {inherits && <span className={`inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-semibold ${featured ? 'bg-white/10 text-sc-cyan-200' : 'bg-sc-cyan-50 text-sc-cyan-700'}`}>{inherits}</span>}

      {pkg.bestFor?.length ? (
        <div>
          <div className={`mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>{labels.bestFor}</div>
          <p className={`m-0 text-[14px] leading-relaxed ${body}`}>{pkg.bestFor.slice(0, 2).join(' · ')}</p>
        </div>
      ) : null}

      {items.length > 0 && (
        <div>
          <div className={`mb-2 text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>{labels.whatsIncluded}</div>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {items.map((item) => (
              <li key={item} className={`flex items-start gap-2.5 text-[14px] leading-snug ${featured ? 'text-white' : 'text-sc-ink-700'}`}>
                <span className={`mt-[2px] inline-flex h-4 w-4 flex-none items-center justify-center rounded-full ${featured ? 'bg-sc-cyan-500 text-sc-ink-900' : 'bg-sc-cyan-50 text-sc-cyan-700'}`}>{CHECK}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2.5 pt-2">
        <LocalizedLink href={bookHref} className={featured ? 'inline-flex min-h-[46px] items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 hover:bg-sc-ink-50' : ui.btnPrimary}>
          {labels.bookCall}
        </LocalizedLink>
        {detailHref && (
          <LocalizedLink href={detailHref} className={featured ? 'inline-flex min-h-[46px] items-center justify-center rounded-lg border border-sc-ink-600 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white hover:bg-sc-ink-800' : ui.btnSecondary}>
            {labels.viewDetails}
          </LocalizedLink>
        )}
      </div>
    </div>
  )
}

export default function PricingPackages({ packages, lang }: PricingPackagesProps) {
  const items = packages?.packagesItems ?? []
  const isNo = lang === 'no' || lang === 'nb-NO' || (lang ?? '').startsWith('nb')

  const labels: Labels = {
    eyebrow: isNo ? 'Alle pakker' : 'All packages',
    heading: isNo ? 'Velg nivå. Alt i pakken under er med.' : 'Pick a level. Everything below it is included.',
    lead: isNo ? 'Fast månedspris og ingen bindingstid. Bytt nivå når behovet endrer seg.' : 'Fixed monthly price and no lock-in. Change level when your needs change.',
    viewDetails: isNo ? 'Se alt som inngår' : 'See everything included',
    bookCall: isNo ? 'Book en samtale' : 'Book a call',
    bestFor: isNo ? 'Passer for' : 'Best for',
    whatsIncluded: isNo ? 'Inkludert' : 'Included',
    perMonth: isNo ? 'per måned' : 'per month',
    recommended: isNo ? 'Mest valgt' : 'Most popular',
    compare: isNo ? 'Sammenlign alle tjenester' : 'Compare every service',
    exVat: isNo ? 'eks. mva' : 'ex. VAT',
  }

  if (items.length === 0) return null

  const featuredIndex = items.findIndex((p) => /premium/i.test(p.title))
  const matrixPrices: Partial<Record<PackageTier, string>> = {}
  for (const pkg of items) {
    const tail = (pkg.slug ?? '').split('/').filter(Boolean).pop() as PackageTier | undefined
    const tier = tail && PACKAGE_TIERS.includes(tail) ? tail : (PACKAGE_TIERS.find((t) => t === handleOf(pkg.title)) as PackageTier | undefined)
    if (!tier) continue
    matrixPrices[tier] = pkg.price
  }
  const cols = items.length >= 4 ? 'lg:grid-cols-4' : items.length === 3 ? 'lg:grid-cols-3' : ''

  return (
    <>
      <section id="pakker" className="scroll-mt-24 bg-white py-16 lg:py-20">
        <div className={`${ui.container} flex flex-col gap-10`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="flex flex-col gap-2.5">
              <div className={ui.eyebrow}>{labels.eyebrow}</div>
              <h2 className={ui.h2}>{labels.heading}</h2>
            </div>
            <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{labels.lead}</p>
          </div>
          <div className={`grid grid-cols-1 gap-4 pt-3 md:grid-cols-2 ${cols} lg:gap-5`}>
            {items.map((pkg, index) => (
              <PackageCard key={index} pkg={pkg} labels={labels} featured={index === featuredIndex} lang={isNo ? 'no' : 'en'} />
            ))}
          </div>
          {isNo && (
            <div className="text-center">
              <a href="#sammenlign" className={ui.btnSecondary}>{labels.compare}</a>
            </div>
          )}
        </div>
      </section>
      {isNo && <PackageMatrix prices={matrixPrices} />}
    </>
  )
}
