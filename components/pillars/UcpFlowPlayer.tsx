'use client'

import { Player } from '@remotion/player'
import { useEffect, useState } from 'react'
import { UcpFlow, UCP_DURATION, UCP_SIZE, type UcpLang } from '@/remotion/UcpFlow'

/**
 * Live Remotion animation of a UCP purchase. Wide layout on desktop, tall on phones,
 * paused on the last step for visitors who prefer reduced motion.
 */
export default function UcpFlowPlayer({ lang, caption }: { lang: string; caption?: string | null }) {
  const [tall, setTall] = useState(false)
  const [reduced, setReduced] = useState(false)
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
      <div className="overflow-hidden rounded-[10px] border border-sc-ink-100 bg-sc-ink-50">
        <Player
          key={layout}
          component={UcpFlow}
          inputProps={{ lang: l, layout }}
          durationInFrames={UCP_DURATION}
          fps={30}
          compositionWidth={size.width}
          compositionHeight={size.height}
          style={{ width: '100%', aspectRatio: `${size.width} / ${size.height}` }}
          autoPlay={!reduced}
          loop={!reduced}
          initialFrame={reduced ? UCP_DURATION - 70 : 0}
          controls={reduced}
          clickToPlay
          acknowledgeRemotionLicense
        />
      </div>
      {caption && <figcaption className="mt-3 text-sm text-sc-ink-500">{caption}</figcaption>}
    </figure>
  )
}
