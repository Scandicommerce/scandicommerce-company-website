import type { PartnerEntry } from '@/lib/partnersCatalog'

/** Logo tile for a partner, or a monogram when there is no logo file. */
export default function PartnerLogo({ partner, size = 48, className = '' }: { partner: Pick<PartnerEntry, 'name' | 'logo' | 'mono' | 'monoBg' | 'monoFg'>; size?: number; className?: string }) {
  if (partner.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={partner.logo} alt={`${partner.name} logo`} width={size} height={size} className={`flex-none rounded-xl border border-sc-ink-100 bg-white object-cover ${className}`} style={{ width: size, height: size }} />
  }
  return (
    <span className={`flex flex-none items-center justify-center rounded-xl font-bold tracking-[-0.02em] ${className}`} style={{ width: size, height: size, fontSize: size * 0.4, background: partner.monoBg ?? '#12181a', color: partner.monoFg ?? '#3fd4dc' }} aria-hidden="true">
      {partner.mono ?? partner.name.slice(0, 1)}
    </span>
  )
}
