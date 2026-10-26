import React from 'react'
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

/**
 * How an agent buys through the Universal Commerce Protocol (UCP), in six steps.
 * Facts follow Google's "Under the Hood: Universal Commerce Protocol" post:
 * manifest at /.well-known/ucp, dev.ucp.shopping capabilities, POST /checkout-sessions,
 * shopper consent, merchant stays merchant of record.
 *
 * Used live on the site through @remotion/player (components/pillars/UcpFlowPlayer.tsx)
 * and renderable from Remotion Studio. Two layouts: wide (desktop) and tall (phones).
 */

export type UcpLang = 'no' | 'en' | 'sv' | 'da' | 'de'
export interface UcpFlowProps {
  lang: UcpLang
  layout: 'wide' | 'tall'
}

export const UCP_STEP = 96
export const UCP_STEPS = 6
export const UCP_HOLD = 60
export const UCP_DURATION = UCP_STEP * UCP_STEPS + UCP_HOLD
export { UCP_SIZE } from './ucpSize'

const INK = '#12181a'
const INK_600 = '#3a444a'
const INK_400 = '#8a95a0'
const INK_200 = '#d6dade'
const INK_100 = '#e9ecee'
const BG = '#f6f7f8'
const CYAN = '#16a7b3'
const CYAN_50 = '#e8f7f8'
const MONO = "var(--font-jetbrains-mono, 'JetBrains Mono'), ui-monospace, SFMono-Regular, Menlo, monospace"

type Copy = {
  shopper: string
  agent: string
  agentSub: string
  store: string
  storeSub: string
  steps: { title: string; caption: string }[]
  ask: string
  product: { title: string; attrs: string[] }
  consent: string
  order: string
  source: string
  mor: string
}

const COPY: Record<UcpLang, Copy> = {
  no: {
    shopper: 'Kunden', agent: 'AI-agenten', agentSub: 'Gemini · ChatGPT · Copilot', store: 'Nettbutikken', storeSub: 'Shopify',
    steps: [
      { title: 'Kunden spør', caption: 'Kunden ber agenten finne et produkt, med egne ord.' },
      { title: 'Agenten leser butikken', caption: 'Butikken publiserer hva den kan i en fil agenten forstår.' },
      { title: 'Agenten sammenligner', caption: 'Strukturerte produktdata avgjør om produktet blir valgt.' },
      { title: 'Kassen åpnes', caption: 'Agenten oppretter en kasse direkte mot butikken.' },
      { title: 'Kunden godkjenner', caption: 'Ingenting kjøpes uten kundens godkjenning.' },
      { title: 'Ordren lander i Shopify', caption: 'Butikken er fortsatt selger og eier kunden.' },
    ],
    ask: 'Finn en vanntett regnjakke til barn, str. 110',
    product: { title: 'Regnjakke barn, vanntett, marineblå', attrs: ['Str. 110', 'Vannsøyle 10 000 mm', 'På lager', 'Levering 1–3 dager'] },
    consent: 'Godkjent av kunden', order: 'Ny ordre', source: 'Kilde: Gemini', mor: 'Butikken er selger',
  },
  en: {
    shopper: 'The shopper', agent: 'The AI agent', agentSub: 'Gemini · ChatGPT · Copilot', store: 'The store', storeSub: 'Shopify',
    steps: [
      { title: 'The shopper asks', caption: 'The shopper asks the agent for a product, in their own words.' },
      { title: 'The agent reads the store', caption: 'The store publishes what it supports in a file agents understand.' },
      { title: 'The agent compares', caption: 'Structured product data decides whether the product gets picked.' },
      { title: 'Checkout opens', caption: 'The agent opens a checkout session directly with the store.' },
      { title: 'The shopper approves', caption: 'Nothing is bought without the shopper’s approval.' },
      { title: 'The order lands in Shopify', caption: 'The store stays the merchant and owns the customer.' },
    ],
    ask: 'Find a waterproof rain jacket for a child, size 110',
    product: { title: 'Kids’ rain jacket, waterproof, navy', attrs: ['Size 110', '10,000 mm water column', 'In stock', 'Delivery 1–3 days'] },
    consent: 'Approved by the shopper', order: 'New order', source: 'Source: Gemini', mor: 'Store is merchant of record',
  },
  sv: {
    shopper: 'Kunden', agent: 'AI-agenten', agentSub: 'Gemini · ChatGPT · Copilot', store: 'Webbutiken', storeSub: 'Shopify',
    steps: [
      { title: 'Kunden frågar', caption: 'Kunden ber agenten hitta en produkt, med egna ord.' },
      { title: 'Agenten läser butiken', caption: 'Butiken publicerar vad den kan i en fil som agenten förstår.' },
      { title: 'Agenten jämför', caption: 'Strukturerad produktdata avgör om produkten väljs.' },
      { title: 'Kassan öppnas', caption: 'Agenten skapar en kassa direkt mot butiken.' },
      { title: 'Kunden godkänner', caption: 'Inget köps utan kundens godkännande.' },
      { title: 'Ordern landar i Shopify', caption: 'Butiken är fortfarande säljare och äger kunden.' },
    ],
    ask: 'Hitta en vattentät regnjacka till barn, stl. 110',
    product: { title: 'Regnjacka barn, vattentät, marinblå', attrs: ['Stl. 110', 'Vattenpelare 10 000 mm', 'I lager', 'Leverans 1–3 dagar'] },
    consent: 'Godkänt av kunden', order: 'Ny order', source: 'Källa: Gemini', mor: 'Butiken är säljare',
  },
  da: {
    shopper: 'Kunden', agent: 'AI-agenten', agentSub: 'Gemini · ChatGPT · Copilot', store: 'Webshoppen', storeSub: 'Shopify',
    steps: [
      { title: 'Kunden spørger', caption: 'Kunden beder agenten finde et produkt, med egne ord.' },
      { title: 'Agenten læser butikken', caption: 'Butikken offentliggør, hvad den kan, i en fil agenten forstår.' },
      { title: 'Agenten sammenligner', caption: 'Strukturerede produktdata afgør, om produktet bliver valgt.' },
      { title: 'Kassen åbner', caption: 'Agenten opretter en kasse direkte hos butikken.' },
      { title: 'Kunden godkender', caption: 'Intet købes uden kundens godkendelse.' },
      { title: 'Ordren lander i Shopify', caption: 'Butikken er stadig sælger og ejer kunden.' },
    ],
    ask: 'Find en vandtæt regnjakke til børn, str. 110',
    product: { title: 'Regnjakke børn, vandtæt, marineblå', attrs: ['Str. 110', 'Vandsøjle 10.000 mm', 'På lager', 'Levering 1–3 dage'] },
    consent: 'Godkendt af kunden', order: 'Ny ordre', source: 'Kilde: Gemini', mor: 'Butikken er sælger',
  },
  de: {
    shopper: 'Kundin', agent: 'KI-Agent', agentSub: 'Gemini · ChatGPT · Copilot', store: 'Onlineshop', storeSub: 'Shopify',
    steps: [
      { title: 'Die Kundin fragt', caption: 'Die Kundin bittet den Agenten in eigenen Worten um ein Produkt.' },
      { title: 'Der Agent liest den Shop', caption: 'Der Shop veröffentlicht in einer Datei, was er unterstützt.' },
      { title: 'Der Agent vergleicht', caption: 'Strukturierte Produktdaten entscheiden, ob das Produkt gewählt wird.' },
      { title: 'Der Checkout startet', caption: 'Der Agent eröffnet eine Checkout-Sitzung direkt beim Shop.' },
      { title: 'Die Kundin bestätigt', caption: 'Ohne Zustimmung der Kundin wird nichts gekauft.' },
      { title: 'Die Bestellung landet in Shopify', caption: 'Der Shop bleibt Verkäufer und behält die Kundenbeziehung.' },
    ],
    ask: 'Finde eine wasserdichte Regenjacke für Kinder, Größe 110',
    product: { title: 'Kinder-Regenjacke, wasserdicht, Marine', attrs: ['Größe 110', 'Wassersäule 10.000 mm', 'Auf Lager', 'Lieferung 1–3 Tage'] },
    consent: 'Von der Kundin bestätigt', order: 'Neue Bestellung', source: 'Quelle: Gemini', mor: 'Shop ist Verkäufer',
  },
}

const ease = Easing.bezier(0.25, 0.1, 0.25, 1)
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

function useStep() {
  const frame = useCurrentFrame()
  const step = Math.min(UCP_STEPS - 1, Math.floor(frame / UCP_STEP))
  const local = frame - step * UCP_STEP
  return { frame, step, local }
}

function Node({ x, y, label, sub, active, icon, size }: { x: number; y: number; label: string; sub: string; active: boolean; icon: React.ReactNode; size: number }) {
  return (
    <div style={{ position: 'absolute', left: x - 120, top: y - size / 2, width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size, height: size, borderRadius: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: active ? INK : '#fff', color: active ? '#fff' : INK, border: `2px solid ${active ? INK : INK_200}`,
          boxShadow: active ? '0 12px 30px rgba(18,24,26,0.18)' : 'none', transition: 'none',
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: INK, textAlign: 'center' }}>{label}</div>
      <div style={{ fontSize: 15, color: INK_400, fontFamily: MONO, textAlign: 'center' }}>{sub}</div>
    </div>
  )
}

const PersonIcon = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
)
const SparkIcon = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" /></svg>
)
const StoreIcon = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M4 9l1.5-5h13L20 9" /><path d="M4 9h16v2a3 3 0 01-5.3 1.9A3 3 0 0112 14a3 3 0 01-2.7-1.1A3 3 0 014 11z" /><path d="M5 13v7h14v-7" /></svg>
)

/** A pill travelling from one node to another during frames [start, start+dur]. */
function Packet({ from, to, local, start, dur, text }: { from: [number, number]; to: [number, number]; local: number; start: number; dur: number; text: string }) {
  const t = interpolate(local, [start, start + dur], [0, 1], { ...clamp, easing: ease })
  const visible = local >= start && local <= start + dur + 6
  if (!visible) return null
  const x = from[0] + (to[0] - from[0]) * t
  const y = from[1] + (to[1] - from[1]) * t
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', padding: '6px 12px', borderRadius: 999, background: CYAN, color: '#fff', fontFamily: MONO, fontSize: 15, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(22,167,179,0.3)' }}>
      {text}
    </div>
  )
}

function Card({ children, local, width }: { children: React.ReactNode; local: number; width: number }) {
  const { fps } = useVideoConfig()
  const s = spring({ frame: local - 34, fps, config: { damping: 18, mass: 0.6 } })
  return (
    <div style={{ width, opacity: s, transform: `translateY(${(1 - s) * 18}px)`, background: '#fff', border: `1px solid ${INK_100}`, borderRadius: 14, padding: 28, boxShadow: '0 20px 50px rgba(18,24,26,0.08)' }}>
      {children}
    </div>
  )
}

function StepContent({ step, c, width }: { step: number; c: Copy; width: number }) {
  const { local } = useStep()
  const { fps } = useVideoConfig()
  if (step === 0)
    return (
      <Card local={local} width={width}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: INK, color: '#fff', borderRadius: '18px 18px 4px 18px', padding: '16px 20px', fontSize: 24, lineHeight: 1.35, maxWidth: '85%' }}>{c.ask}</div>
        </div>
      </Card>
    )
  if (step === 1)
    return (
      <Card local={local} width={width}>
        <div style={{ fontFamily: MONO, fontSize: 19, lineHeight: 1.65, color: INK_600 }}>
          <div style={{ color: INK_400 }}>GET /.well-known/ucp</div>
          <div>{'{'} <span style={{ color: CYAN }}>&quot;service&quot;</span>: &quot;dev.ucp.shopping&quot;,</div>
          <div style={{ paddingLeft: 20 }}><span style={{ color: CYAN }}>&quot;capabilities&quot;</span>: [&quot;checkout&quot;, &quot;discount&quot;, &quot;fulfillment&quot;],</div>
          <div style={{ paddingLeft: 20 }}><span style={{ color: CYAN }}>&quot;payment_handlers&quot;</span>: [&quot;shop_pay&quot;, &quot;google_pay&quot;] {'}'}</div>
        </div>
      </Card>
    )
  if (step === 2)
    return (
      <Card local={local} width={width}>
        <div style={{ fontSize: 24, fontWeight: 700, color: INK, marginBottom: 16 }}>{c.product.title}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {c.product.attrs.map((a, i) => {
            const o = interpolate(local, [40 + i * 8, 52 + i * 8], [0, 1], clamp)
            return (
              <span key={a} style={{ opacity: o, background: CYAN_50, color: '#0e7d86', borderRadius: 8, padding: '8px 12px', fontSize: 18, fontWeight: 600 }}>✓ {a}</span>
            )
          })}
        </div>
      </Card>
    )
  if (step === 3)
    return (
      <Card local={local} width={width}>
        <div style={{ fontFamily: MONO, fontSize: 19, lineHeight: 1.65, color: INK_600 }}>
          <div style={{ color: INK_400 }}>POST /checkout-sessions</div>
          <div>{'{'} <span style={{ color: CYAN }}>&quot;line_items&quot;</span>: 1, <span style={{ color: CYAN }}>&quot;currency&quot;</span>: &quot;NOK&quot; {'}'}</div>
          <div style={{ marginTop: 10 }}>→ <span style={{ color: CYAN }}>&quot;status&quot;</span>: &quot;ready_for_complete&quot;</div>
        </div>
      </Card>
    )
  if (step === 4) {
    const s = spring({ frame: local - 46, fps, config: { damping: 12 } })
    return (
      <Card local={local} width={width}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 56, background: CYAN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, transform: `scale(${s})` }}>✓</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: INK }}>{c.consent}</div>
        </div>
      </Card>
    )
  }
  return (
    <Card local={local} width={width}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: INK }}>{c.order} #1043</div>
        <div style={{ fontFamily: MONO, fontSize: 17, color: INK_400 }}>{c.source}</div>
      </div>
      <div style={{ marginTop: 14, display: 'inline-flex', background: CYAN_50, color: '#0e7d86', borderRadius: 8, padding: '8px 12px', fontSize: 18, fontWeight: 600 }}>{c.mor}</div>
    </Card>
  )
}

export const UcpFlow: React.FC<UcpFlowProps> = ({ lang, layout }) => {
  const { width, height } = useVideoConfig()
  const { frame, step, local } = useStep()
  const c = COPY[lang] ?? COPY.en
  const tall = layout === 'tall'
  const nodeY = tall ? 190 : 170
  const nodeSize = tall ? 96 : 104
  const xs = tall ? [130, 360, 590] : [220, 600, 980]
  const p = (i: number): [number, number] => [xs[i], nodeY]
  // Which nodes are active per step, and the packet for the step.
  const active = [[0], [1, 2], [1, 2], [1, 2], [0], [2]][step]
  const packets: { from: number; to: number; text: string }[] = [
    { from: 0, to: 1, text: '“…”' },
    { from: 1, to: 2, text: '/.well-known/ucp' },
    { from: 2, to: 1, text: 'catalog' },
    { from: 1, to: 2, text: 'checkout' },
    { from: 1, to: 0, text: 'OK?' },
    { from: 1, to: 2, text: 'order' },
  ]
  const pk = packets[step]
  const fadeOut = interpolate(frame, [UCP_DURATION - 14, UCP_DURATION], [1, 0], clamp)
  const panelTop = tall ? 420 : 310
  const panelWidth = tall ? 620 : 760
  const stepFade = interpolate(local, [0, 10], [0, 1], clamp)

  return (
    <AbsoluteFill style={{ background: BG, color: INK, fontFamily: 'inherit', opacity: fadeOut }}>
      {/* Step label */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: tall ? 40 : 34, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: stepFade }}>
        <span style={{ fontFamily: MONO, fontSize: 16, color: CYAN, letterSpacing: '0.12em' }}>{String(step + 1).padStart(2, '0')} / 0{UCP_STEPS}</span>
        <span style={{ fontSize: 22, fontWeight: 700 }}>{c.steps[step].title}</span>
      </div>

      {/* Connection lines */}
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        {[0, 1].map((i) => (
          <line key={i} x1={xs[i] + nodeSize / 2 + 10} y1={nodeY} x2={xs[i + 1] - nodeSize / 2 - 10} y2={nodeY} stroke={INK_200} strokeWidth={2} strokeDasharray="6 8" />
        ))}
      </svg>

      <Node x={xs[0]} y={nodeY} label={c.shopper} sub="" active={active.includes(0)} icon={<PersonIcon s={nodeSize * 0.42} />} size={nodeSize} />
      <Node x={xs[1]} y={nodeY} label={c.agent} sub={tall ? '' : c.agentSub} active={active.includes(1)} icon={<SparkIcon s={nodeSize * 0.42} />} size={nodeSize} />
      <Node x={xs[2]} y={nodeY} label={c.store} sub={c.storeSub} active={active.includes(2)} icon={<StoreIcon s={nodeSize * 0.42} />} size={nodeSize} />

      <Packet from={p(pk.from)} to={p(pk.to)} local={local} start={8} dur={26} text={pk.text} />

      {/* Detail card */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: panelTop, display: 'flex', justifyContent: 'center' }}>
        <StepContent step={step} c={c} width={panelWidth} />
      </div>

      {/* Caption */}
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: tall ? 70 : 40, textAlign: 'center', fontSize: tall ? 26 : 22, lineHeight: 1.4, color: INK_600, opacity: stepFade }}>
        {c.steps[step].caption}
      </div>

      {/* Progress */}
      <div style={{ position: 'absolute', left: tall ? 60 : 300, right: tall ? 60 : 300, bottom: tall ? 36 : 20, display: 'flex', gap: 8 }}>
        {Array.from({ length: UCP_STEPS }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? CYAN : INK_200 }} />
        ))}
      </div>
    </AbsoluteFill>
  )
}
