import { ui } from '@/components/integrations/labels'
import DataFlowAnimation from '@/components/integrations/DataFlowAnimation'
import { partnerLang, type PartnerEntry } from '@/lib/partnersCatalog'
import PartnerLogo from './PartnerLogo'

interface PartnersHeroProps {
  title: string
  highlight?: string
  description?: string
  partners: PartnerEntry[]
  categoryCount: number
  lang: string
}

/** `payloads` label the pulses in the mesh: orders, vouchers, payment, inventory, customers. */
const T = {
  no: { eyebrow: 'Partnere', explore: 'Utforsk partnerne', how: 'Slik velger vi partnere', s1: 'partnere og integrasjoner', s2: 'fagområder', s3: 'kontaktpunkt', payloads: ['ordre', 'bilag', 'betaling', 'lager', 'kunder'] },
  en: { eyebrow: 'Partners', explore: 'Explore the partners', how: 'How we choose partners', s1: 'partners and integrations', s2: 'disciplines', s3: 'point of contact', payloads: ['orders', 'vouchers', 'payment', 'inventory', 'customers'] },
  sv: { eyebrow: 'Partner', explore: 'Utforska partnerna', how: 'Så väljer vi partner', s1: 'partner och integrationer', s2: 'fackområden', s3: 'kontaktpunkt', payloads: ['order', 'verifikat', 'betalning', 'lager', 'kunder'] },
  da: { eyebrow: 'Partnere', explore: 'Udforsk partnerne', how: 'Sådan vælger vi partnere', s1: 'partnere og integrationer', s2: 'fagområder', s3: 'kontaktpunkt', payloads: ['ordrer', 'bilag', 'betaling', 'lager', 'kunder'] },
  de: { eyebrow: 'Partner', explore: 'Partner entdecken', how: 'So wählen wir Partner aus', s1: 'Partner und Integrationen', s2: 'Fachbereiche', s3: 'Ansprechpartner', payloads: ['Bestellungen', 'Belege', 'Zahlung', 'Lager', 'Kunden'] },
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) return title
  const [before, ...rest] = title.split(highlight)
  return (
    <>
      {before}
      <span className="text-sc-cyan-500">{highlight}</span>
      {rest.join(highlight)}
    </>
  )
}

const WALL_CSS = `
.pw-tile{animation:pw-float 6s ease-in-out infinite}
.pw-tile:nth-child(3n){animation-delay:-2s}.pw-tile:nth-child(4n){animation-delay:-4s}.pw-tile:nth-child(5n+1){animation-delay:-1s}
@keyframes pw-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@media (prefers-reduced-motion:reduce){.pw-tile{animation:none}}
`

/** Static logo mesh: the phone-width hero visual and the no-motion poster. */
function LogoWall({ partners }: { partners: PartnerEntry[] }) {
  return (
    <div className="relative rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-4">
      <style dangerouslySetInnerHTML={{ __html: WALL_CSS }} />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="pw-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#d6dade" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pw-grid)" opacity="0.5" />
      </svg>
      <div className="relative grid grid-cols-4 gap-2.5 sm:grid-cols-6">
        {partners.map((p) => (
          <span key={p.slug} className="pw-tile flex aspect-square items-center justify-center rounded-xl border border-sc-ink-100 bg-white shadow-sm">
            <PartnerLogo partner={p} size={40} className="!rounded-lg !border-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Partners hero: Sanity heading and lead on the left; on the right a web of
 * partner logos. Desktop gets the Remotion mesh (no hub, pulses wandering
 * between partners), phones get the floating logo wall.
 */
export default function PartnersHero({ title, highlight, description, partners, categoryCount, lang }: PartnersHeroProps) {
  const t = T[partnerLang(lang)]
  const core = partners.filter((p) => p.core)
  const web = [...core, ...partners.filter((p) => !p.core && p.logo)].slice(0, 10)
  const wall = [...core, ...partners.filter((p) => !p.core && p.logo)].slice(0, 24)
  const nodes = web.map((p) => ({ label: p.name, logos: p.logo ? [p.logo] : [] }))
  const [orders, vouchers, payment, inventory, customers] = t.payloads
  const steps = [
    { from: 'Shopify', to: 'Make', payload: orders },
    { from: 'Make', to: 'Tripletex', payload: vouchers },
    { from: 'Vipps', to: 'Shopify', payload: payment },
    { from: 'Omnium', to: 'Shopify', payload: inventory },
    { from: 'Klaviyo', to: 'Shopify', payload: customers },
    { from: 'Nets', to: 'Shopify', payload: 'POS' },
  ]
  return (
    <section className="bg-white">
      <div className={`${ui.container} grid grid-cols-1 items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-16`}>
        <div>
          <div className={`${ui.eyebrow} mb-4`}>{t.eyebrow}</div>
          <h1 className="mb-5 text-[36px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 sm:text-[44px] lg:mb-6 lg:text-[56px]">{renderTitle(title, highlight)}</h1>
          {description && <p className="m-0 max-w-[600px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{description}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#katalog" className={ui.btnPrimary}>{t.explore}</a>
            <a href="#slik-velger-vi" className={ui.btnSecondary}>{t.how}</a>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-sc-ink-100 pt-6 sm:gap-8">
            {[
              [partners.length, t.s1],
              [categoryCount, t.s2],
              [1, t.s3],
            ].map(([v, l]) => (
              <div key={String(l)}>
                <dt className="font-mono text-[28px] font-medium leading-none tracking-tight text-sc-ink-900 lg:text-[34px]">{v}</dt>
                <dd className="m-0 mt-1.5 text-[13px] leading-snug text-sc-ink-500 sm:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <div className="hidden md:block">
            <DataFlowAnimation variant="web" systems={[{ name: 'Shopify', role: 'source' }]} steps={steps} language={lang} nodes={nodes} poster={<LogoWall partners={wall} />} />
          </div>
          <div className="md:hidden">
            <LogoWall partners={wall} />
          </div>
        </div>
      </div>
    </section>
  )
}
