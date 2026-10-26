'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, type ReactNode } from 'react'
import { useInView } from '@/lib/useInView'
import { DataFlowPoster, type FlowStep, type FlowSystem } from './DataFlow'
import type { FlowNode, FlowProps, FlowTheme, FlowVariant, OverviewNode } from './remotion/FlowComposition'
import { SIZE } from './remotion/flowSize'

const DataFlowPlayer = dynamic(() => import('./remotion/DataFlowPlayer'), { ssr: false })

const STATIC_LOGOS: { match: RegExp; url: string }[] = [
  { match: /shopify/i, url: '/images/integrations/logos/shopify.svg' },
  { match: /make/i, url: '/images/integrations/logos/make.svg' },
  { match: /tripletex/i, url: '/images/integrations/logos/tripletex.svg' },
  { match: /omnium/i, url: '/images/integrations/logos/omnium.svg' },
  { match: /google og meta|google/i, url: '/images/integrations/logos/googlesheets.svg' },
]

function resolveLogo(name: string, vendorName?: string | null, vendorLogoUrl?: string | null, explicit?: string | null): string | null {
  if (explicit) return explicit
  if (vendorName && vendorLogoUrl && name.toLowerCase() === vendorName.toLowerCase()) return vendorLogoUrl
  const hit = STATIC_LOGOS.find((s) => s.match.test(name))
  return hit?.url ?? null
}

/**
 * Data-flow animation with the static SVG poster as its fallback. The poster
 * is server-rendered and shown until the block scrolls into view (the
 * Remotion bundle is only fetched then), when the visitor prefers reduced
 * motion, and when JavaScript is off.
 */
export default function DataFlowAnimation({
  variant,
  systems,
  steps,
  language,
  theme = 'light',
  nodes,
  twoWay,
  vendorName,
  vendorLogoUrl,
  poster,
}: {
  variant: FlowVariant
  systems: FlowSystem[]
  steps: FlowStep[]
  language: string
  theme?: FlowTheme
  nodes?: OverviewNode[]
  twoWay?: boolean
  vendorName?: string | null
  vendorLogoUrl?: string | null
  /** Replaces the generic poster as the no-motion fallback. */
  poster?: ReactNode
}) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [ref, inView] = useInView<HTMLDivElement>('0px')
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const toNode = (s?: FlowSystem, fallback = ''): FlowNode => ({ name: s?.name ?? fallback, logoUrl: resolveLogo(s?.name ?? fallback, vendorName, vendorLogoUrl, s?.logoUrl) })
  const source = toNode(systems.find((s) => s.role === 'source'), 'Shopify')
  const middleware = systems.find((s) => s.role === 'middleware')
  const target = toNode(systems.find((s) => s.role === 'target'))
  const props: FlowProps = {
    variant,
    theme,
    source,
    middleware: middleware ? toNode(middleware) : null,
    target,
    twoWay,
    nodes,
    lang: language === 'no' ? 'no' : 'en',
    steps: steps.map((s) => ({
      payload: s.payload,
      from: s.from,
      to: s.to,
      trigger: (s.trigger as FlowProps['steps'][number]['trigger']) ?? 'webhook',
      frequency: s.frequency ?? null,
    })),
  }
  const label = steps.map((s) => `${s.from} → ${s.to}, ${s.payload}`).join('; ')

  const fallback = poster ?? <DataFlowPoster systems={systems} steps={steps} language={language} />
  // The player's box is reserved from the server render on, so swapping the poster for the player doesn't shift the page.
  const size = SIZE[variant]
  return (
    <div ref={ref} className="flex flex-col justify-center" style={reducedMotion ? undefined : { aspectRatio: `${size.width} / ${size.height}` }}>
      {inView && !reducedMotion ? <DataFlowPlayer props={props} ariaLabel={label} /> : fallback}
    </div>
  )
}
