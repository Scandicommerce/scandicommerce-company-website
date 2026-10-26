'use client'

import { Player } from '@remotion/player'
import { UcpFlow, UCP_DURATION, UCP_SIZE, type UcpLang } from '@/remotion/UcpFlow'

/** The Remotion Player itself. Loaded lazily by UcpFlowPlayer once it nears the viewport. */
export default function UcpFlowLivePlayer({ lang, layout, reduced }: { lang: UcpLang; layout: 'tall' | 'wide'; reduced: boolean }) {
  const size = UCP_SIZE[layout]
  return (
    <Player
      key={layout}
      component={UcpFlow}
      inputProps={{ lang, layout }}
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
  )
}
