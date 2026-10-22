import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'
import PackageMatrix from './PackageMatrix'
import { PACKAGE_TIERS, serviceCount, type PackageTier } from '@/lib/packageMatrix'

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
const clean = (s: string) => s.replace(/^[\s✓✔☑•-]+/, '').trim().replace(/(\d) (\d{3})/g, '$1\u00a0$2')
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
  compare: string
  exVat: string
}

const CHECK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)

/** Tier from the Sanity slug tail, falling back to the title. */
function tierOf(pkg: Package): PackageTier | undefined {
  const tail = (pkg.slug ?? '').split('/').filter(Boolean).pop() as PackageTier | undefined
  if (tail && PACKAGE_TIERS.includes(tail)) return tail
  return PACKAGE_TIERS.find((t) => t === handleOf(pkg.title)) as PackageTier | undefined
}

/**
 * One tier column, same order on every card so they compare at a glance:
 * name, promise, price, "Alt i …, pluss:", up to five deliverables, one call
 * to action and a link to the full list. Price comes from Sanity.
 */
function PackageCard({ pkg, labels, featured, isNo }: { pkg: Package; labels: Labels; featured: boolean; isNo: boolean }) {
  const included = (pkg.included ?? []).map(clean).filter(Boolean)
  const inherits = included.find((s) => /^(alt i|everything in)\s/i.test(s))
  const items = included.filter((s) => s !== inherits).slice(0, 5)
  const bookHref = resolveBookCallHref(pkg)
  const detailHref = pkg.slug ? `/${pkg.slug}` : pkg.href || null
  const tier = tierOf(pkg)
  const detailLabel = isNo && tier ? `Se alle ${serviceCount(tier)} tjenester` : labels.viewDetails
  const muted = featured ? 'text-sc-ink-300' : 'text-sc-ink-500'
  const body = featured ? 'text-sc-ink-300' : 'text-sc-ink-600'
  const rule = featured ? 'border-sc-ink-600' : 'border-sc-ink-200'

  return (
    <div className={`flex min-w-0 flex-col gap-6 rounded-[20px] border p-7 lg:p-8 ${featured ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-200 bg-white text-sc-ink-900'}`}>
      <div className="flex flex-col gap-1.5">
        <h3 className="m-0 text-[28px] font-bold leading-tight tracking-[-0.02em]">{pkg.title}</h3>
        {pkg.subtitle && <p className={`m-0 text-[15px] leading-snug ${body}`}>{pkg.subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[36px] font-medium leading-none tracking-[-0.03em]">{pkg.price}</span>
        <span className={`text-[15px] ${muted}`}>/mnd</span>
        {!isNo && <span className={`w-full pt-1 text-[13px] ${muted}`}>{labels.exVat}</span>}
      </div>

      {(inherits || items.length > 0) && (
        <ul className={`m-0 flex flex-grow list-none flex-col gap-2.5 border-t border-dashed p-0 pt-5 text-[15px] leading-snug ${rule}`}>
          {inherits && <li className={muted}>{inherits}, pluss:</li>}
          {items.map((item) => (
            <li key={item} className={`flex items-start gap-2.5 ${featured ? 'text-white' : 'text-sc-ink-700'}`}>
              <span className={`mt-[2px] inline-flex h-4 w-4 flex-none items-center justify-center rounded-full ${featured ? 'bg-sc-cyan-300 text-sc-ink-900' : 'bg-sc-cyan-50 text-sc-cyan-700'}`}>{CHECK}</span>
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-col items-stretch gap-3 pt-1">
        <LocalizedLink
          href={bookHref}
          className={`inline-flex min-h-[48px] items-center justify-center rounded-full px-6 text-[15px] font-semibold transition-colors ${featured ? 'bg-sc-cyan-300 text-sc-ink-900 hover:bg-sc-cyan-200' : 'bg-sc-ink-900 text-white hover:bg-sc-ink-700'}`}
        >
          {labels.bookCall}
        </LocalizedLink>
        {detailHref && (
          <LocalizedLink href={detailHref} className={`text-center text-[15px] font-medium underline-offset-2 hover:underline ${featured ? 'text-sc-cyan-200' : 'text-sc-cyan-700'}`}>
            {detailLabel}
          </LocalizedLink>
        )}
      </div>
    </div>
  )
}

/** Norwegian only: what sits outside the monthly packages, priced as fixed projects. */
function OutsidePackages() {
  const rows = [
    { label: 'CRO-revisjon for Growth', value: '12 000 kr' },
    { label: 'Migrering til Shopify', value: 'Fastpris' },
    { label: 'B2B-portal, headless og nye integrasjoner', value: 'Fastpris' },
  ]
  return (
    <section className="bg-white pb-16 lg:pb-20">
      <div className={`${ui.container} flex flex-col gap-6`}>
        <div className="flex flex-col gap-2">
          <h2 className="m-0 text-[28px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[32px]">Utenfor pakkene</h2>
          <p className="m-0 max-w-[620px] text-sc-ink-600">Større løft gjør vi som egne prosjekter med fast pris. Premium- og Enterprise-kunder får prioritet.</p>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-3">
          {rows.map((r) => (
            <li key={r.label} className="flex flex-col gap-1.5 rounded-[14px] bg-sc-ink-50 p-5">
              <span className="text-sm text-sc-ink-500">{r.label}</span>
              <span className="font-mono text-[20px] font-medium text-sc-ink-900">{r.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
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
    compare: isNo ? 'Sammenlign alle tjenester' : 'Compare every service',
    exVat: isNo ? 'eks. mva' : 'ex. VAT',
  }

  if (items.length === 0) return null

  const featuredIndex = items.findIndex((p) => /premium/i.test(p.title))
  const matrixPrices: Partial<Record<PackageTier, string>> = {}
  for (const pkg of items) {
    const tier = tierOf(pkg)
    if (tier) matrixPrices[tier] = pkg.price
  }
  const cols = items.length >= 4 ? 'lg:grid-cols-4' : items.length === 3 ? 'lg:grid-cols-3' : ''

  return (
    <>
      <section id="pakker" className="scroll-mt-24 bg-white pb-16 pt-4 lg:pb-20">
        <div className={`${ui.container} flex flex-col gap-8`}>
          {isNo ? (
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[15px] text-sc-ink-600">
              {['Ingen bindingstid', '1 måneds oppsigelse', 'Support inkludert', 'Alle priser eks. mva'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span aria-hidden="true" className="font-bold text-sc-cyan-700">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
              <div className="flex flex-col gap-2.5">
                <div className={ui.eyebrow}>{labels.eyebrow}</div>
                <h2 className={ui.h2}>{labels.heading}</h2>
              </div>
              <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{labels.lead}</p>
            </div>
          )}
          <div className={`grid grid-cols-1 gap-5 md:grid-cols-2 ${cols}`}>
            {items.map((pkg, index) => (
              <PackageCard key={index} pkg={pkg} labels={labels} featured={index === featuredIndex} isNo={isNo} />
            ))}
          </div>
        </div>
      </section>
      {isNo && <OutsidePackages />}
      {isNo && <PackageMatrix prices={matrixPrices} />}
    </>
  )
}
