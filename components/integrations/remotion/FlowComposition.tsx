import React from 'react'
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame } from 'remotion'

/**
 * Remotion compositions for the integrations pillar, driven by the Sanity
 * `dataFlowSteps` on each integration page.
 *
 *   make | code | direct   one beat per step: trigger at the origin node →
 *                          pulse with the payload → middleware processes it
 *                          (Make modules light up, or terminal lines type) →
 *                          lands at the destination, which gets a receipt line.
 *   overview               hub hero: Shopify in the centre, four category
 *                          nodes with vendor logos, continuous pulses.
 *
 * Every edge carries a slow dash drift the whole time so the frame is never
 * still. 1600×900 (overview 1600×600), 30 fps. Tokens from the design system.
 */

export type FlowVariant = 'make' | 'code' | 'direct' | 'overview'
export type FlowTheme = 'light' | 'dark'
export type FlowNode = { name: string; logoUrl?: string | null }
export type FlowStepProp = { payload: string; from: string; to: string; trigger?: 'webhook' | 'schedule' | 'manual' | null; frequency?: string | null }
export type OverviewNode = { label: string; logos: string[] }
export type FlowProps = {
  variant: FlowVariant
  theme?: FlowTheme
  source: FlowNode
  middleware?: FlowNode | null
  target: FlowNode
  steps: FlowStepProp[]
  twoWay?: boolean
  nodes?: OverviewNode[]
  lang?: 'no' | 'en'
}

export const FPS = 30
export const INTRO = 44
export const BEAT = 84
export const HOLD = 40
export const FADE = 14
export const SIZE: Record<FlowVariant, { width: number; height: number }> = {
  make: { width: 1600, height: 900 },
  code: { width: 1600, height: 900 },
  direct: { width: 1600, height: 900 },
  overview: { width: 1600, height: 600 },
}
export function durationFor(props: FlowProps): number {
  if (props.variant === 'overview') return 330
  const n = Math.max(1, Math.min(props.steps.length, 5))
  return INTRO + n * BEAT + HOLD + FADE
}

const C = {
  light: { bg: '#f6f7f8', edge: '#d6dade', pulse: '#16a7b3', halo: 'rgba(22,167,179,0.22)', text: '#12181a', muted: '#5a6670', card: '#ffffff', cardBorder: '#d6dade', ink: '#12181a', inkText: '#ffffff', amber: '#e8a83a', ok: '#118792' },
  dark: { bg: '#12181a', edge: '#3a444a', pulse: '#1EEFFA', halo: 'rgba(30,239,250,0.22)', text: '#ffffff', muted: '#8a95a0', card: '#1a2124', cardBorder: '#3a444a', ink: '#ffffff', inkText: '#12181a', amber: '#e8a83a', ok: '#7ee5eb' },
}
const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace"
const SANS = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
const ease = Easing.inOut(Easing.ease)
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }
const t01 = (frame: number, from: number, to: number) => interpolate(frame, [from, to], [0, 1], { ...clamp, easing: ease })

const L = {
  no: { lookup: 'oppslag', map: 'transformer', create: 'opprett', ok: 'mottatt', webhook: 'webhook', schedule: 'planlagt', manual: 'manuelt', verify: 'verifiser', send: 'send' },
  en: { lookup: 'lookup', map: 'transform', create: 'create', ok: 'received', webhook: 'webhook', schedule: 'scheduled', manual: 'manual', verify: 'verify', send: 'send' },
}

/* ------------------------------------------------------------- pieces */

function Logo({ url, name, size, dark }: { url?: string | null; name: string; size: number; dark?: boolean }) {
  if (!url) return null
  // Logos keep their brand colours everywhere. Shopify's green sits on the ink node the way Shopify's own dark lockup does.
  void dark
  return <Img src={url} style={{ height: size, width: 'auto', maxWidth: size * 4, objectFit: 'contain' }} />
}

function Node({ x, y, w, h, node, dark, theme, opacity = 1, lift = 0, ring = 0, check = false, sub }: { x: number; y: number; w: number; h: number; node: FlowNode; dark?: boolean; theme: FlowTheme; opacity?: number; lift?: number; ring?: number; check?: boolean; sub?: string }) {
  const c = C[theme]
  const inkCard = theme === 'dark' ? !dark : dark
  return (
    <div style={{ position: 'absolute', left: x, top: y + lift, width: w, height: h, opacity, boxSizing: 'border-box', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, borderRadius: 12, background: inkCard ? c.ink : c.card, color: inkCard ? c.inkText : c.text, border: `2px solid ${ring > 0 ? c.pulse : inkCard ? c.ink : c.cardBorder}`, boxShadow: ring > 0 ? `0 0 0 ${10 * ring}px ${c.halo}` : 'none', fontFamily: MONO, fontSize: 24, fontWeight: 500 }}>
      {check && (
        <svg width="24" height="24" viewBox="0 0 14 14" fill="none" stroke={c.pulse} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 7l3.5 3.5L12 4" />
        </svg>
      )}
      {node.logoUrl ? <Logo url={node.logoUrl} name={node.name} size={34} dark={inkCard} /> : <span>{node.name}</span>}
      {sub && <span style={{ fontSize: 16, color: inkCard ? '#b5bcc4' : c.muted }}>{sub}</span>}
    </div>
  )
}

/** Edge: a solid hairline plus a slow dash drift riding on top, brighter while a pulse is on it. */
function Edge({ x1, x2, y, progress, active, frame, theme, color, dashed }: { x1: number; x2: number; y: number; progress: number; active?: boolean; frame: number; theme: FlowTheme; color?: string; dashed?: boolean }) {
  const c = C[theme]
  const len = Math.abs(x2 - x1) * progress
  const left = Math.min(x1, x2) + (x1 < x2 ? 0 : Math.abs(x2 - x1) - len)
  const base = color ?? (active ? c.pulse : c.edge)
  const drift = (frame * 1.4) % 32
  const dash = color ?? (active ? c.pulse : theme === 'dark' ? '#5a6670' : '#b5bcc4')
  return (
    <div style={{ position: 'absolute', left, top: y - 1.5, width: len, height: 3 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 2, background: dashed ? `repeating-linear-gradient(90deg, ${base} 0 12px, transparent 12px 24px)` : base, opacity: dashed ? 1 : 0.9 }} />
      {!dashed && (
        <div style={{ position: 'absolute', inset: 0, borderRadius: 2, background: `linear-gradient(90deg, ${dash} 0 14px, transparent 14px 32px)`, backgroundSize: '32px 3px', backgroundPositionX: x1 < x2 ? drift : -drift, opacity: active ? 0.9 : 0.55 }} />
      )}
    </div>
  )
}

function Pulse({ x, y, label, theme, color, above = true }: { x: number; y: number; label?: string; theme: FlowTheme; color?: string; above?: boolean }) {
  const c = C[theme]
  return (
    <div style={{ position: 'absolute', left: x - 10, top: y - 10 }}>
      <div style={{ width: 20, height: 20, borderRadius: 999, background: color ?? c.pulse, boxShadow: `0 0 0 10px ${color ? 'rgba(232,168,58,0.22)' : c.halo}` }} />
      {label && <div style={{ position: 'absolute', left: 10, top: above ? -40 : 30, transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: MONO, fontSize: 20, color: c.text }}>{label}</div>}
    </div>
  )
}

function TriggerBadge({ x, y, kind, frequency, theme, opacity, lang }: { x: number; y: number; kind: FlowStepProp['trigger']; frequency?: string | null; theme: FlowTheme; opacity: number; lang: 'no' | 'en' }) {
  const c = C[theme]
  const l = L[lang]
  const icon =
    kind === 'schedule' ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.pulse} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
    ) : kind === 'manual' ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.pulse} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v6M12 9a1.5 1.5 0 0 1 3 0v3M15 10a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4.5 13a1.5 1.5 0 0 1 2.5-1.6L9 13" /></svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.pulse} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>
    )
  const text = frequency ?? (kind ? l[kind] : l.webhook)
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, transform: `translateY(${(1 - opacity) * 8}px)`, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, background: c.card, border: `1px solid ${c.cardBorder}`, fontFamily: MONO, fontSize: 17, color: c.text }}>
      {icon}
      <span>{text}</span>
    </div>
  )
}

/* ----------------------------------------------------- step sequence */

type NodeIdx = 0 | 1 | 2

function StepFlow(props: FlowProps & { theme: FlowTheme }) {
  const { theme, source, middleware, target, variant, lang = 'no' } = props
  const f = useCurrentFrame()
  const c = C[theme]
  const l = L[lang]
  const steps = props.steps.slice(0, 5)
  const hasMid = !!middleware
  const S = { x: 110, y: 400, w: 330, h: 92 }
  const M = variant === 'direct' ? { x: 635, y: 400, w: 330, h: 92 } : { x: 635, y: 290, w: 330, h: 310 }
  const T = { x: 1160, y: 400, w: 330, h: 92 }
  const boxes = [S, M, T]
  const names = [source.name, middleware?.name ?? '', target.name].map((n) => n.toLowerCase())
  const idx = (name: string, fallback: NodeIdx): NodeIdx => {
    const n = name.toLowerCase()
    const i = names.findIndex((x) => x && (x === n || x.includes(n) || n.includes(x)))
    return (i >= 0 && (i !== 1 || hasMid) ? i : fallback) as NodeIdx
  }
  const lane = (a: NodeIdx, b: NodeIdx) => (props.twoWay ? (a < b ? 430 : 466) : 446)
  const edgeX = (from: NodeIdx, to: NodeIdx) => {
    const A = boxes[from]
    const B = boxes[to]
    return from < to ? { x1: A.x + A.w, x2: B.x } : { x1: A.x, x2: B.x + B.w }
  }
  const total = INTRO + steps.length * BEAT + HOLD + FADE
  const fade = 1 - t01(f, total - FADE, total)

  // Intro
  const nodeIn = (i: number) => t01(f, 2 + i * 5, 18 + i * 5)
  const lift = (i: number) => (1 - nodeIn(i)) * 14
  const edges = t01(f, 22, 38)

  // Active beat and its path
  const bi = Math.min(steps.length - 1, Math.floor(Math.max(0, f - INTRO) / BEAT))
  const bf = f < INTRO ? -1 : f >= INTRO + steps.length * BEAT ? BEAT + 1 : f - INTRO - bi * BEAT
  const step = steps[bi]
  const from = step ? idx(step.from, 0) : 0
  const to = step ? idx(step.to, 2) : 2
  const viaMid = hasMid && from !== 1 && to !== 1 && from !== to
  const segs: [NodeIdx, NodeIdx][] = from === to ? [] : viaMid ? [[from, 1], [1, to]] : [[from, to]]
  const two = segs.length === 2

  // Beat timeline (frames within beat)
  const tA: [number, number] = two ? [10, 34] : [10, 54]
  const tProc: [number, number] = [34, 54]
  const tB: [number, number] = [54, 74]
  const tLand: [number, number] = two ? [74, 82] : [54, 62]
  const trig = bf < 0 ? 0 : bf <= 10 ? t01(bf, 0, 10) : bf > 60 ? 1 - t01(bf, 60, 70) : 1
  const pA = bf >= tA[0] && bf <= tA[1] ? t01(bf, tA[0], tA[1]) : null
  const proc = two && bf >= tProc[0] && bf <= tB[0] ? t01(bf, tProc[0], tProc[1]) : two && bf > tB[0] && bf < BEAT ? 1 : 0
  const pB = two && bf >= tB[0] && bf <= tB[1] ? t01(bf, tB[0], tB[1]) : null
  const land = bf >= tLand[0] ? t01(bf, tLand[0], tLand[1]) : 0
  const doneAll = f >= INTRO + steps.length * BEAT
  const breathe = 0.5 + 0.5 * Math.sin(f / 9)

  const activeSeg = pA !== null ? segs[0] : pB !== null ? segs[1] : null
  const pulse = (() => {
    if (!activeSeg) return null
    const p = pA !== null ? pA : pB!
    const { x1, x2 } = edgeX(activeSeg[0], activeSeg[1])
    return { x: x1 + (x2 - x1) * p, y: lane(activeSeg[0], activeSeg[1]), fwd: activeSeg[0] < activeSeg[1] }
  })()
  const isActive = (a: NodeIdx, b: NodeIdx) => !!activeSeg && activeSeg[0] === a && activeSeg[1] === b

  const module = (i: number) => (proc <= 0 ? 0 : Math.min(1, Math.max(0, (proc - i * 0.3) / 0.35)))
  const modLabels = [l.lookup, l.map, l.create]
  const codeLines = [
    { t: `POST /webhooks/${names[from].replace(/\s+/g, '-')}`, a: true },
    { t: `${l.verify} hmac ✓  ·  ${l.map}` },
    { t: `PUT ${names[to]}/${(step?.payload ?? '').split(' ')[0]}`, a: true },
  ]
  const receiptsFor = (n: NodeIdx) => steps.filter((st, i) => idx(st.to, 2) === n && (i < bi || (i === bi && land >= 1)))
  const ringFor = (n: NodeIdx) => {
    if (step && n === from && trig > 0 && bf < 20) return trig
    if (step && n === to && land > 0 && land < 1) return 1 - land
    if (n === 1 && proc > 0 && proc < 1) return 1 - proc
    return doneAll ? 0.25 * breathe : 0
  }

  const ReceiptList = ({ at, items }: { at: typeof T; items: FlowStepProp[] }) =>
    items.length ? (
      <div style={{ position: 'absolute', left: at.x, top: at.y + at.h + 16, width: at.w, fontFamily: MONO, fontSize: 17, color: c.muted, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.slice(-3).map((st, i) => (
          <div key={`${st.payload}-${i}`} style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: c.ok }}>✓</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.payload}</span>
          </div>
        ))}
      </div>
    ) : null

  const pairs: [NodeIdx, NodeIdx][] = hasMid ? [[0, 1], [1, 2]] : [[0, 2]]
  const lanes: [NodeIdx, NodeIdx][] = props.twoWay ? [...pairs, ...pairs.map(([a, b]) => [b, a] as [NodeIdx, NodeIdx])] : pairs

  return (
    <AbsoluteFill data-frame={f} style={{ background: c.bg, opacity: fade, fontFamily: SANS }}>
      {lanes.map(([a, b]) => {
        const { x1, x2 } = edgeX(a, b)
        return <Edge key={`${a}-${b}`} x1={x1} x2={x2} y={lane(a, b)} progress={edges} active={isActive(a, b)} frame={f} theme={theme} />
      })}

      <Node {...S} node={source} dark theme={theme} opacity={nodeIn(0)} lift={lift(0)} ring={ringFor(0)} check={to === 0 && land >= 1} />
      {hasMid && variant === 'make' && (
        <div style={{ position: 'absolute', left: M.x, top: M.y + lift(1), width: M.w, height: M.h, opacity: nodeIn(1), boxSizing: 'border-box', borderRadius: 12, background: c.card, border: `2px solid ${proc > 0 ? c.pulse : c.cardBorder}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 19, color: c.muted }}>
            <Logo url={middleware?.logoUrl} name={middleware?.name ?? 'make'} size={26} />
            <span>{middleware?.name ?? 'Make.com'}</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[0, 1, 2].map((i) => {
              const m = module(i)
              return <div key={i} style={{ width: 46, height: 46, borderRadius: 999, border: `3px solid ${m > 0 ? c.pulse : '#b5bcc4'}`, background: m > 0 ? c.pulse : 'transparent', boxShadow: m > 0 && m < 1 ? `0 0 0 ${12 * (1 - m)}px ${c.halo}` : 'none', transform: `scale(${m > 0 ? 1 + 0.08 * (1 - m) : 1})` }} />
            })}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 17, color: c.text, height: 22 }}>{proc > 0 ? modLabels[Math.min(2, Math.floor(proc * 3))] : ''}</div>
        </div>
      )}
      {hasMid && variant === 'code' && (
        <div style={{ position: 'absolute', left: M.x, top: M.y + lift(1), width: M.w, height: M.h, opacity: nodeIn(1), boxSizing: 'border-box', padding: '20px 24px', borderRadius: 12, background: theme === 'dark' ? '#1a2124' : '#12181a', border: `2px solid ${proc > 0 ? c.pulse : '#3a444a'}`, fontFamily: MONO, fontSize: 18, lineHeight: 1.7, color: '#d6dade' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8a95a0', marginBottom: 8 }}>
            <Logo url={middleware?.logoUrl} name={middleware?.name ?? 'app'} size={22} dark />
            <span>{middleware?.name ?? 'scandicommerce'}</span>
          </div>
          {codeLines.map((ln, i) => {
            const m = module(i)
            if (m <= 0) return null
            return (
              <div key={i} style={{ color: ln.a ? '#1EEFFA' : '#d6dade', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {ln.t.slice(0, Math.ceil(ln.t.length * m))}
              </div>
            )
          })}
          {proc <= 0 && <div>$ _</div>}
        </div>
      )}
      {hasMid && variant === 'direct' && middleware && <Node {...M} node={middleware} theme={theme} opacity={nodeIn(1)} lift={lift(1)} ring={ringFor(1)} check={to === 1 && land >= 1} />}
      <Node {...T} node={target} theme={theme} opacity={nodeIn(2)} lift={lift(2)} ring={ringFor(2)} check={to === 2 && land >= 1} />

      {step && trig > 0 && (
        <TriggerBadge x={from === 2 ? T.x + T.w - 190 : boxes[from].x} y={S.y - 64} kind={step.trigger} frequency={step.frequency} theme={theme} opacity={trig} lang={lang} />
      )}

      {pulse && step && <Pulse x={pulse.x} y={pulse.y} label={step.payload} theme={theme} above={pulse.fwd} />}

      <ReceiptList at={T} items={receiptsFor(2)} />
      <ReceiptList at={S} items={receiptsFor(0)} />
      {hasMid && variant === 'direct' && <ReceiptList at={M} items={receiptsFor(1)} />}
    </AbsoluteFill>
  )
}

/* ------------------------------------------------------------ overview */
function OverviewFlow({ theme, source, nodes = [], steps }: FlowProps & { theme: FlowTheme }) {
  const f = useCurrentFrame()
  const c = C[theme]
  const Hub = { x: 620, y: 140, w: 360, h: 320 }
  const P = [{ x: 100, y: 150 }, { x: 1140, y: 150 }, { x: 100, y: 350 }, { x: 1140, y: 350 }]
  const nw = 360
  const nh = 100
  const nodeIn = (i: number) => t01(f, 2 + i * 4, 16 + i * 4)
  const edges = t01(f, 18, 32)
  const period = 100
  const fade = f > 316 ? 1 - t01(f, 316, 330) : 1
  const breathe = 0.5 + 0.5 * Math.sin(f / 10)
  const pulses = P.map((n, i) => {
    const out = i % 2 === 0
    const start = 40 + i * 25
    const local = f < start ? -1 : ((f - start) % period) / 62
    const hubSide = i % 2 === 0 ? Hub.x : Hub.x + Hub.w
    const nodeSide = i % 2 === 0 ? n.x + nw : n.x
    const from = out ? hubSide : nodeSide
    const to = out ? nodeSide : hubSide
    const p = local < 0 || local > 1 ? null : interpolate(local, [0, 1], [0, 1], { easing: ease })
    // Hide the label over the last stretch so it never sits under the node it is arriving at.
    return { x: p === null ? null : from + (to - from) * p, y: n.y + nh / 2, label: p !== null && p < 0.72 ? steps[i]?.payload ?? '' : undefined, arriving: p !== null && p > 0.9 }
  })
  return (
    <AbsoluteFill data-frame={f} style={{ background: c.bg, opacity: fade, fontFamily: SANS }}>
      {P.map((n, i) => {
        const x1 = i % 2 === 0 ? n.x + nw : Hub.x + Hub.w
        const x2 = i % 2 === 0 ? Hub.x : n.x
        return <Edge key={i} x1={x1} x2={x2} y={n.y + nh / 2} progress={edges} active={pulses[i].x !== null} frame={f} theme={theme} />
      })}
      <div style={{ position: 'absolute', left: Hub.x, top: Hub.y, width: Hub.w, height: Hub.h, opacity: nodeIn(0), borderRadius: 14, background: c.ink, color: c.inkText, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, boxShadow: `0 0 0 ${6 + 6 * breathe}px ${c.halo}` }}>
        <Logo url={source.logoUrl} name={source.name} size={72} dark />
        <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 500 }}>{source.name}</div>
      </div>
      {P.map((n, i) => {
        const node = nodes[i]
        const arriving = pulses[i].arriving
        return (
          <div key={i} style={{ position: 'absolute', left: n.x, top: n.y + (1 - nodeIn(i + 1)) * 12, width: nw, height: nh, opacity: nodeIn(i + 1), boxSizing: 'border-box', padding: '0 22px', borderRadius: 12, background: c.card, border: `2px solid ${arriving ? c.pulse : c.cardBorder}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: c.text }}>{node?.label ?? ''}</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 26 }}>
              {(node?.logos ?? []).slice(0, 3).map((u, k) => (
                <Img key={k} src={u} style={{ height: 22, width: 'auto', maxWidth: 96, objectFit: 'contain', opacity: 0.85 }} />
              ))}
            </div>
          </div>
        )
      })}
      {pulses.map((p, i) => p.x !== null && <Pulse key={i} x={p.x} y={p.y} label={p.label} theme={theme} above={i < 2} />)}
    </AbsoluteFill>
  )
}

export default function FlowComposition(props: FlowProps) {
  const theme = props.theme ?? 'light'
  if (props.variant === 'overview') return <OverviewFlow {...props} theme={theme} />
  return <StepFlow {...props} theme={theme} />
}
