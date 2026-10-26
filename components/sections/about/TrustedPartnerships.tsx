import LocalizedLink from '@/components/ui/LocalizedLink'
import { urlFor } from '@/sanity/lib/image'
import { ui } from '@/components/integrations/labels'
import { partnerCatalog } from '@/lib/partnersCatalog'
import PartnerLogo from '@/components/sections/partners/PartnerLogo'
import type { Image as SanityImage } from 'sanity'

interface Partnership {
  name?: string
  status?: string
  logo?: SanityImage & { alt?: string }
  logoIcon?: string
}

interface TrustedPartnershipsData {
  title?: string
  subtitle?: string
  partnerships?: Partnership[]
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')

/** Certifications as partner tiles; the logo comes from Sanity, else from the partner catalog. */
export default function TrustedPartnerships({ trustedPartnerships, lang = 'no' }: { trustedPartnerships?: TrustedPartnershipsData; lang?: string }) {
  const isNo = lang === 'no'
  const items = (trustedPartnerships?.partnerships ?? []).filter((p) => p?.name)
  if (items.length === 0) return null
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>{isNo ? 'Sertifiseringer' : 'Certifications'}</div>
            {trustedPartnerships?.title && <h2 className={ui.h2}>{trustedPartnerships.title}</h2>}
          </div>
          {trustedPartnerships?.subtitle && <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{trustedPartnerships.subtitle}</p>}
        </div>
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4 lg:gap-5">
          {items.map((p, i) => {
            const catalog = partnerCatalog.find((c) => norm(c.name).includes(norm(p.name!)) || norm(p.name!).includes(norm(c.name)))
            const sanityLogo = p.logo && (p.logo as { asset?: unknown }).asset ? urlFor(p.logo).width(160).height(160).fit('crop').url() : null
            const tile = sanityLogo ? { name: p.name!, logo: sanityLogo } : catalog ?? { name: p.name!, logo: null, mono: p.name!.slice(0, 1) }
            return (
              <li key={i} className={`${ui.card} items-start`}>
                <PartnerLogo partner={tile} size={48} />
                <div>
                  <h3 className="m-0 text-[17px] font-bold leading-snug text-sc-ink-900">{p.name}</h3>
                  {p.status && <p className="m-0 mt-1 text-[14px] leading-snug text-sc-ink-600">{p.status}</p>}
                </div>
              </li>
            )
          })}
        </ul>
        <div>
          <LocalizedLink href={isNo ? '/partnere' : '/partners'} className="text-sm font-semibold text-sc-ink-900 hover:text-sc-cyan-600">{isNo ? 'Se alle partnerne våre →' : 'See all our partners →'}</LocalizedLink>
        </div>
      </div>
    </section>
  )
}
