import { contactHref } from '@/lib/routes'
import Button from '@/components/ui/Button'
import AddToCartDropdown from '@/components/sections/merch/AddToCartDropdown'
import PackageAddToCart from './PackageAddToCart'
import type { Package } from '@/lib/packages'
import { cardForTier, serviceCount, tierBelow, type PackageTier } from '@/lib/packageMatrix'

interface ShopifyProduct {
  variantId: string
  productTitle: string
  hasVariants: boolean
  variants: Parameters<typeof AddToCartDropdown>[0]['variants']
  /** Formatted price from the Storefront API; wins over the CMS string. */
  price?: string
}

interface PackageDetailHeroProps {
  pkg: Package
  /** Set when the package is one of the matrix tiers; drives the facts panel. */
  tier?: PackageTier
  shopifyProduct?: ShopifyProduct
  lang?: string
}

const T = {
  no: { eyebrow: 'Pakke', cta: 'Book en samtale', timeline: 'Tidslinje', services: 'tjenester inkludert', inherits: (n: string) => `Alt i ${n}`, audience: 'Passer for' },
  en: { eyebrow: 'Package', cta: 'Book a discovery call', timeline: 'Timeline', services: 'services included', inherits: (n: string) => `Everything in ${n}`, audience: 'Ideal for' },
  sv: { eyebrow: 'Paket', cta: 'Boka ett samtal', timeline: 'Tidslinje', services: 'tjänster ingår', inherits: (n: string) => `Allt i ${n}`, audience: 'Passar för' },
  da: { eyebrow: 'Pakke', cta: 'Book en samtale', timeline: 'Tidslinje', services: 'tjenester inkluderet', inherits: (n: string) => `Alt i ${n}`, audience: 'Passer til' },
  de: { eyebrow: 'Paket', cta: 'Gespräch buchen', timeline: 'Zeitplan', services: 'Leistungen enthalten', inherits: (n: string) => `Alles in ${n}`, audience: 'Geeignet für' },
} as const

/**
 * Package hero: who it is for, what it costs, and how it relates to the package
 * below. Facts come from the package matrix when the slug is a known tier,
 * otherwise from the CMS highlights.
 */
export default function PackageDetailHero({ pkg, tier, shopifyProduct, lang = 'en' }: PackageDetailHeroProps) {
  const t = T[lang as keyof typeof T] ?? T.en
  const isNo = lang === 'no'
  const card = tier && isNo ? cardForTier(tier) : undefined
  const below = tier && isNo ? tierBelow(tier) : undefined
  const belowCard = below ? cardForTier(below) : undefined
  const total = tier && isNo ? serviceCount(tier) : undefined
  const audience = card?.audience || pkg.idealFor?.[0]

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1100px] px-5 pb-14 pt-14 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Copy */}
          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500">
              {t.eyebrow}
            </div>
            <h1 className="text-[40px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 lg:text-[56px]">
              {pkg.title}
            </h1>
            {(card?.tagline || pkg.subtitle) && (
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-sc-ink-600 lg:text-[18px]">
                {card?.tagline || pkg.subtitle}
              </p>
            )}

            {/* Price */}
            <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-[32px] font-medium tracking-tight text-sc-ink-900 lg:text-[40px]">
                {shopifyProduct?.price || pkg.price || card?.price}
              </span>
              {(card ? 'per måned' : pkg.priceType) && (
                <span className="text-[15px] text-sc-ink-500">{card ? 'per måned' : pkg.priceType}</span>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {shopifyProduct ? (
                <>
                  {shopifyProduct.hasVariants ? (
                    <AddToCartDropdown
                      variants={shopifyProduct.variants}
                      productTitle={shopifyProduct.productTitle}
                      quantity={1}
                    />
                  ) : (
                    <PackageAddToCart
                      variantId={shopifyProduct.variantId}
                      productTitle={shopifyProduct.productTitle}
                      quantity={1}
                    />
                  )}
                  <Button href={pkg.heroButtons?.primaryButtonLink || contactHref(lang)}>
                    {pkg.heroButtons?.primaryButtonText || t.cta}
                  </Button>
                </>
              ) : (
                <Button href={pkg.heroButtons?.primaryButtonLink || contactHref(lang)} type="primary">
                  {pkg.heroButtons?.primaryButtonText || t.cta}
                </Button>
              )}
            </div>
          </div>

          {/* Facts panel */}
          <div className="w-full rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-6 lg:p-8">
            {audience && (
              <>
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-400">
                  {t.audience}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-sc-ink-700">{audience}</p>
              </>
            )}

            {(total !== undefined || belowCard) && (
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-sc-ink-100 pt-6">
                {total !== undefined && (
                  <div>
                    <dt className="text-sm text-sc-ink-500">{t.services}</dt>
                    <dd className="text-[24px] font-bold text-sc-ink-900">{total}</dd>
                  </div>
                )}
                {belowCard && (
                  <div>
                    <dt className="text-sm text-sc-ink-500">{isNo ? 'Bygger på' : 'Builds on'}</dt>
                    <dd className="text-[24px] font-bold text-sc-ink-900">{belowCard.name}</dd>
                  </div>
                )}
              </dl>
            )}

            {card && card.bullets.length > 0 && (
              <ul className="mt-6 space-y-2.5 border-t border-sc-ink-100 pt-6">
                {card.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-base text-sc-ink-700">
                    <span
                      aria-hidden="true"
                      className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-sc-cyan-500"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {!card && pkg.highlights.length > 0 && (
              <ul className="mt-6 space-y-2.5 border-t border-sc-ink-100 pt-6">
                {pkg.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-base text-sc-ink-700">
                    <span
                      aria-hidden="true"
                      className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-sc-cyan-500"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
