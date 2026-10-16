import LocalizedLink from '@/components/ui/LocalizedLink'
import DataFlowAnimation from '@/components/integrations/DataFlowAnimation'
import PackageAddToCart from './PackageAddToCart'

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
  shopifyVariantId?: string
  shopifyProductTitle?: string
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

/** Resolves Book Call URL: page slug (preferred), then custom href, then /contact. */
function resolveBookCallHref(pkg: Package): string {
  if (pkg.bookCallSlug) return `/${pkg.bookCallSlug}`
  if (pkg.bookCallHref) return pkg.bookCallHref
  return '/contact'
}

interface Labels {
  eyebrow: string
  heading: string
  viewDetails: string
  bookCall: string
  bestFor: string
  whatsIncluded: string
  timeline: string
  more: (n: number) => string
}

const BTN_PRIMARY = 'inline-flex min-h-[46px] items-center justify-center rounded-lg bg-sc-ink-900 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-ink-700'
const BTN_SECONDARY = 'inline-flex min-h-[46px] items-center justify-center rounded-lg border border-sc-ink-300 bg-transparent px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50'

/**
 * Package card on the integrations card pattern: hairline, radius 8, one
 * clear price line in mono, the audience as a short list and the contents as
 * chips. Everything else lives on the detail page.
 */
function PackageCard({ pkg, labels, featured }: { pkg: Package; labels: Labels; featured: boolean }) {
  const included = (pkg.included ?? []).map(clean)
  const shown = included.slice(0, 6)
  const rest = included.length - shown.length
  const bookHref = resolveBookCallHref(pkg)
  return (
    <div className={`flex flex-col gap-5 rounded-lg border p-7 ${featured ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-100 bg-white text-sc-ink-900'}`}>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[28px] font-bold leading-tight tracking-[-0.02em]">{pkg.title}</h3>
        {pkg.subtitle && <p className={`text-base ${featured ? 'text-sc-ink-200' : 'text-sc-ink-600'}`}>{pkg.subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2">
        {pkg.price && <span className="font-mono text-[30px] font-medium tracking-tight">{pkg.price}</span>}
        {pkg.priceType && <span className={`text-sm ${featured ? 'text-sc-ink-300' : 'text-sc-ink-500'}`}>{pkg.priceType}</span>}
        {pkg.timeline && (
          <span className={`basis-full text-sm ${featured ? 'text-sc-ink-300' : 'text-sc-ink-500'}`}>
            {labels.timeline}: {pkg.timeline}
          </span>
        )}
      </div>

      {pkg.description && <p className={`text-base leading-relaxed ${featured ? 'text-sc-ink-200' : 'text-sc-ink-600'}`}>{pkg.description}</p>}

      {pkg.bestFor?.length ? (
        <div className="flex flex-col gap-2">
          <div className={`text-xs font-semibold uppercase tracking-[0.12em] ${featured ? 'text-sc-ink-300' : 'text-sc-ink-500'}`}>{labels.bestFor}</div>
          <ul className="flex flex-col gap-1.5 text-[15px] leading-relaxed">
            {pkg.bestFor.slice(0, 3).map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-semibold text-sc-cyan-500">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {shown.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className={`text-xs font-semibold uppercase tracking-[0.12em] ${featured ? 'text-sc-ink-300' : 'text-sc-ink-500'}`}>{labels.whatsIncluded}</div>
          <div className="flex flex-wrap gap-1.5">
            {shown.map((item, index) => (
              <span key={index} className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[13px] ${featured ? 'border-sc-ink-600 text-sc-ink-200' : 'border-sc-ink-200 text-sc-ink-600'}`}>
                {item}
              </span>
            ))}
            {rest > 0 && <span className={`inline-flex items-center px-1 py-1 text-[13px] ${featured ? 'text-sc-ink-300' : 'text-sc-ink-500'}`}>{labels.more(rest)}</span>}
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
        {(pkg.slug || pkg.href) && (
          <LocalizedLink href={pkg.slug ? `/${pkg.slug}` : pkg.href!} className={featured ? 'inline-flex min-h-[46px] items-center justify-center rounded-lg bg-sc-ink-900 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-ink-700' : BTN_PRIMARY}>
            {labels.viewDetails}
          </LocalizedLink>
        )}
        {bookHref.startsWith('http') ? (
          <a href={bookHref} target="_blank" rel="noopener noreferrer" className={featured ? 'inline-flex min-h-[46px] items-center justify-center rounded-lg border border-sc-ink-600 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white hover:bg-sc-ink-800' : BTN_SECONDARY}>
            {labels.bookCall}
          </a>
        ) : (
          <LocalizedLink href={bookHref} className={featured ? 'inline-flex min-h-[46px] items-center justify-center rounded-lg border border-sc-ink-600 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white hover:bg-sc-ink-800' : BTN_SECONDARY}>
            {labels.bookCall}
          </LocalizedLink>
        )}
        {pkg.shopifyVariantId && pkg.shopifyProductTitle && (
          <PackageAddToCart variantId={pkg.shopifyVariantId} productTitle={pkg.shopifyProductTitle} className="flex-1 min-w-0" />
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
    viewDetails: isNo ? 'Se detaljer' : 'View details',
    bookCall: isNo ? 'Book en samtale' : 'Book a call',
    bestFor: isNo ? 'Passer for' : 'Best for',
    whatsIncluded: isNo ? 'Inkludert' : 'Included',
    timeline: isNo ? 'Tidsramme' : 'Timeline',
    more: (n) => (isNo ? `+${n} til` : `+${n} more`),
  }

  if (items.length === 0) return null

  // Remotion: tier columns with the services that are new in each tier.
  const tierNodes = items.map((p) => ({ label: p.title, logos: [] as string[] }))
  const tierSteps = items.flatMap((p) => (p.included ?? []).map(clean).filter((s) => !/^alt i /i.test(s)).slice(0, 5).map((s) => ({ from: p.title, to: p.title, payload: s })))
  const featuredIndex = items.length > 1 ? items.length - 1 : -1

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-5 lg:px-8">
        <div className="flex flex-col gap-2.5">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500">{labels.eyebrow}</div>
          <h2 className="text-[32px] font-bold leading-[1.25] tracking-[-0.02em] text-sc-ink-900 lg:text-[44px]">{labels.heading}</h2>
        </div>
        <DataFlowAnimation variant="tiers" systems={[{ name: 'Shopify', role: 'source' }]} steps={tierSteps} language={isNo ? 'no' : 'en'} nodes={tierNodes} />
        <div className={`grid gap-6 md:grid-cols-2 ${items.length === 3 ? "lg:grid-cols-3" : ""}`}>
          {items.map((pkg, index) => (
            <PackageCard key={index} pkg={pkg} labels={labels} featured={index === featuredIndex} />
          ))}
        </div>
      </div>
    </section>
  )
}
