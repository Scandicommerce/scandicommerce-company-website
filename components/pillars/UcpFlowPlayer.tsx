'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useInView } from '@/lib/useInView'
import { UCP_SIZE } from '@/remotion/ucpSize'
import type { UcpLang } from '@/remotion/UcpFlow'

const UcpFlowLivePlayer = dynamic(() => import('./UcpFlowLivePlayer'), { ssr: false })

/**
 * Live Remotion animation of a UCP purchase. Wide layout on desktop, tall on phones,
 * paused on the last step for visitors who prefer reduced motion. The Remotion bundle
 * is only fetched once the figure nears the viewport.
 */
export default function UcpFlowPlayer({ lang, caption }: { lang: string; caption?: string | null }) {
  const [tall, setTall] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [ref, inView] = useInView<HTMLDivElement>()
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setTall(mq.matches)
      setReduced(rm.matches)
    }
    sync()
    mq.addEventListener('change', sync)
    rm.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      rm.removeEventListener('change', sync)
    }
  }, [])

  const layout: 'tall' | 'wide' = tall ? 'tall' : 'wide'
  const size = UCP_SIZE[layout]
  const l = (['no', 'en', 'sv', 'da', 'de'].includes(lang) ? lang : 'en') as UcpLang

  return (
    <figure className="my-2">
      <div ref={ref} className="overflow-hidden rounded-[10px] border border-sc-ink-100 bg-sc-ink-50" style={{ aspectRatio: `${size.width} / ${size.height}` }}>
        {inView && <UcpFlowLivePlayer lang={l} layout={layout} reduced={reduced} />}
      </div>
      {caption && <figcaption className="mt-3 text-sm text-sc-ink-500">{caption}</figcaption>}
    </figure>
  )
}
