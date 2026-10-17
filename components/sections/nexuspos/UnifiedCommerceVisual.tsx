/**
 * Hero visual for Nexus POS: kasse, nettbutikk, lager and regnskap wired into
 * one Shopify hub, with pulses on the edges and a live-feed ticker below.
 * Pure SVG + CSS keyframes, so it renders on the server and respects
 * prefers-reduced-motion.
 */

import type { NexusLang } from '@/lib/nexuspos'

const CSS = `
.ncv-flow{stroke-dasharray:6 8;animation:ncv-dash 1.1s linear infinite}
@keyframes ncv-dash{to{stroke-dashoffset:-28}}
.ncv-ring{transform-origin:260px 210px;animation:ncv-hub 2.4s cubic-bezier(.2,.8,.2,1) infinite}
@keyframes ncv-hub{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.45);opacity:0}}
.ncv-mark{transform-box:view-box;transform-origin:260px 210px;animation:ncv-knot 2.4s ease-in-out infinite}
@keyframes ncv-knot{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
.ncv-feed{position:relative;height:56px;margin-top:12px}
.ncv-item{position:absolute;inset:0;display:flex;align-items:center;gap:12px;background:#fff;border:1px solid #eceef0;border-radius:10px;padding:0 14px;font-size:14px;box-shadow:0 8px 20px rgba(10,13,15,.08);opacity:0;animation:ncv-feed 12s infinite}
.ncv-item:nth-child(2){animation-delay:3s}.ncv-item:nth-child(3){animation-delay:6s}.ncv-item:nth-child(4){animation-delay:9s}
@keyframes ncv-feed{0%{opacity:0;transform:translateY(10px)}4%,22%{opacity:1;transform:none}26%,100%{opacity:0;transform:translateY(-10px)}}
@media (prefers-reduced-motion:reduce){.ncv-flow,.ncv-ring,.ncv-mark,.ncv-item{animation:none!important}.ncv-item:first-child{opacity:1}.ncv-dots{display:none}}
`

const CARDS = {
  no: [
    { x: 20, y: 36, title: 'Kasse', sub: 'N950 · iPad', icon: 'kasse' },
    { x: 320, y: 36, title: 'Nettbutikk', sub: 'Shopify', icon: 'shop' },
    { x: 20, y: 296, title: 'Lager', sub: 'Ett lager, alle kanaler', icon: 'lager' },
    { x: 320, y: 296, title: 'Regnskap', sub: 'Z-rapport · SAF-T', icon: 'bars' },
  ],
  en: [
    { x: 20, y: 36, title: 'Till', sub: 'N950 · iPad', icon: 'kasse' },
    { x: 320, y: 36, title: 'Online store', sub: 'Shopify', icon: 'shop' },
    { x: 20, y: 296, title: 'Inventory', sub: 'One stock, every channel', icon: 'lager' },
    { x: 320, y: 296, title: 'Accounting', sub: 'Z report · SAF-T', icon: 'bars' },
  ],
  sv: [
    { x: 20, y: 36, title: 'Kassa', sub: 'N950 · iPad', icon: 'kasse' },
    { x: 320, y: 36, title: 'Webbutik', sub: 'Shopify', icon: 'shop' },
    { x: 20, y: 296, title: 'Lager', sub: 'Ett lager, alla kanaler', icon: 'lager' },
    { x: 320, y: 296, title: 'Bokföring', sub: 'Z-rapport · SAF-T', icon: 'bars' },
  ],
  da: [
    { x: 20, y: 36, title: 'Kasse', sub: 'N950 · iPad', icon: 'kasse' },
    { x: 320, y: 36, title: 'Webshop', sub: 'Shopify', icon: 'shop' },
    { x: 20, y: 296, title: 'Lager', sub: 'Ét lager, alle kanaler', icon: 'lager' },
    { x: 320, y: 296, title: 'Regnskab', sub: 'Z-rapport · SAF-T', icon: 'bars' },
  ],
  de: [
    { x: 20, y: 36, title: 'Kasse', sub: 'N950 · iPad', icon: 'kasse' },
    { x: 320, y: 36, title: 'Onlineshop', sub: 'Shopify', icon: 'shop' },
    { x: 20, y: 296, title: 'Lager', sub: 'Ein Lager, alle Kanäle', icon: 'lager' },
    { x: 320, y: 296, title: 'Buchhaltung', sub: 'Z-Bericht · SAF-T', icon: 'bars' },
  ],
}

const FEED = {
  no: [
    { b: 'Salg i butikk', t: '1 249 kr på N950', when: 'nå' },
    { b: 'Lager oppdatert', t: 'også i nettbutikken', when: 'nå' },
    { b: 'Klikk og hent', t: 'nettordre klar i butikk', when: 'nå' },
    { b: 'Z-rapport', t: 'dagsoppgjør klart for regnskap', when: 'kl. 18.00' },
  ],
  en: [
    { b: 'In-store sale', t: '1 249 kr on N950', when: 'now' },
    { b: 'Inventory updated', t: 'in the online store too', when: 'now' },
    { b: 'Click and collect', t: 'web order ready in store', when: 'now' },
    { b: 'Z report', t: 'daily settlement ready for accounting', when: '18:00' },
  ],
  sv: [
    { b: 'Försäljning i butik', t: '1 249 kr på N950', when: 'nu' },
    { b: 'Lager uppdaterat', t: 'även i webbutiken', when: 'nu' },
    { b: 'Klicka och hämta', t: 'webborder redo i butik', when: 'nu' },
    { b: 'Z-rapport', t: 'dagsavslut klart för bokföring', when: 'kl. 18.00' },
  ],
  da: [
    { b: 'Salg i butik', t: '1 249 kr på N950', when: 'nu' },
    { b: 'Lager opdateret', t: 'også i webshoppen', when: 'nu' },
    { b: 'Klik og hent', t: 'webordre klar i butikken', when: 'nu' },
    { b: 'Z-rapport', t: 'dagsopgørelse klar til regnskab', when: 'kl. 18.00' },
  ],
  de: [
    { b: 'Verkauf im Geschäft', t: '1 249 kr am N950', when: 'jetzt' },
    { b: 'Lager aktualisiert', t: 'auch im Onlineshop', when: 'jetzt' },
    { b: 'Click & Collect', t: 'Onlinebestellung abholbereit im Geschäft', when: 'jetzt' },
    { b: 'Z-Bericht', t: 'Tagesabschluss bereit für die Buchhaltung', when: '18:00 Uhr' },
  ],
}

const ARIA = {
  no: 'Kasse, nettbutikk, lager og regnskap koblet sammen i Shopify',
  en: 'Till, online store, inventory and accounting connected in Shopify',
  sv: 'Kassa, webbutik, lager och bokföring sammankopplade i Shopify',
  da: 'Kasse, webshop, lager og regnskab koblet sammen i Shopify',
  de: 'Kasse, Onlineshop, Lager und Buchhaltung verbunden in Shopify',
}

function Icon({ kind, x, y }: { kind: string; x: number; y: number }) {
  const s = { fill: 'none', stroke: '#0e6a73', strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  if (kind === 'kasse') return <image href="/images/nexuspos/nets-n950.jpg" x={x - 6} y={y - 6} width={60} height={60} preserveAspectRatio="xMidYMid slice" clipPath="inset(0 round 12)" />
  if (kind === 'shop') return <path d={`M${x + 12} ${y + 14}h24l-2 14h-20z M${x + 16} ${y + 14}a8 8 0 0 1 16 0`} {...s} />
  if (kind === 'lager') return <path d={`M${x + 12} ${y + 18}l12-6 12 6v14l-12 6-12-6z M${x + 12} ${y + 18}l12 6 12-6 M${x + 24} ${y + 24}v14`} {...s} />
  return <path d={`M${x + 14} ${y + 36}v-10 M${x + 24} ${y + 36}v-18 M${x + 34} ${y + 36}v-24`} {...s} strokeWidth={3} />
}

export default function UnifiedCommerceVisual({ lang = 'no' }: { lang?: NexusLang }) {
  const cards = CARDS[lang]
  const feed = FEED[lang]
  return (
    <div className="relative overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-4 sm:p-6">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg viewBox="0 0 520 420" className="block h-auto w-full" role="img" aria-label={ARIA[lang]}>
        <g fill="none" stroke="#d6dade" strokeWidth={2}>
          <path d="M260 210 L110 80" />
          <path d="M260 210 L410 80" />
          <path d="M260 210 L110 340" />
          <path d="M260 210 L410 340" />
        </g>
        <g fill="none" stroke="#16a7b3" strokeWidth={2.5} strokeLinecap="round">
          <path className="ncv-flow" d="M110 80 L260 210" />
          <path className="ncv-flow" d="M410 80 L260 210" style={{ animationDelay: '-.3s' }} />
          <path className="ncv-flow" d="M260 210 L110 340" style={{ animationDelay: '-.6s' }} />
          <path className="ncv-flow" d="M260 210 L410 340" style={{ animationDelay: '-.9s' }} />
        </g>
        <g className="ncv-dots" fill="#16a7b3">
          <circle r={5}><animateMotion dur="2.4s" repeatCount="indefinite" path="M110 80 L260 210" /></circle>
          <circle r={5}><animateMotion dur="2.4s" begin="0.6s" repeatCount="indefinite" path="M410 80 L260 210" /></circle>
          <circle r={5}><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M260 210 L110 340" /></circle>
          <circle r={5}><animateMotion dur="2.4s" begin="1.8s" repeatCount="indefinite" path="M260 210 L410 340" /></circle>
        </g>
        <circle className="ncv-ring" cx={260} cy={210} r={62} fill="none" stroke="#16a7b3" strokeWidth={2} />
        <circle cx={260} cy={210} r={62} fill="#12181a" />
        <image className="ncv-mark" href="/images/nexuspos/nexus-mark.svg" x={218} y={168} width={84} height={84} />
        <g fontFamily="inherit">
          {cards.map((c) => (
            <g key={c.title}>
              <rect x={c.x} y={c.y} width={180} height={88} rx={14} fill="#ffffff" stroke="#eceef0" />
              <rect x={c.x + 16} y={c.y + 20} width={48} height={48} rx={12} fill="#e6fbfc" />
              <Icon kind={c.icon} x={c.x + 16} y={c.y + 20} />
              <text x={c.x + 76} y={c.y + 38} fontSize={16} fontWeight={700} fill="#12181a">{c.title}</text>
              <text x={c.x + 76} y={c.y + 60} fontSize={11.5} fill="#3a444a">{c.sub}</text>
            </g>
          ))}
        </g>
      </svg>
      <div className="ncv-feed" aria-hidden="true">
        {feed.map((f) => (
          <div key={f.b} className="ncv-item text-sc-ink-900">
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-sc-ink-900">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#1EEFFA" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3 3 7-7" /></svg>
            </span>
            <span className="truncate"><b className="font-semibold">{f.b}</b> · {f.t}</span>
            <span className="ml-auto flex-none text-xs text-sc-ink-500">{f.when}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
