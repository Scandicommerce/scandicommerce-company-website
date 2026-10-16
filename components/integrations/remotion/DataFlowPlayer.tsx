'use client'

import { Player } from '@remotion/player'
import FlowComposition, { FPS, SIZE, durationFor, type FlowProps } from './FlowComposition'

/** Client-only wrapper around the Remotion Player. Loaded lazily by DataFlowAnimation. */
export default function DataFlowPlayer({ props, ariaLabel }: { props: FlowProps; ariaLabel: string }) {
  const size = SIZE[props.variant]
  return (
    <div role="img" aria-label={ariaLabel} className="overflow-hidden rounded-lg border border-sc-ink-100">
      <Player
        component={FlowComposition}
        inputProps={props}
        durationInFrames={durationFor(props)}
        fps={FPS}
        compositionWidth={size.width}
        compositionHeight={size.height}
        autoPlay
        loop
        controls={false}
        clickToPlay={false}
        acknowledgeRemotionLicense
        style={{ width: '100%', aspectRatio: `${size.width} / ${size.height}` }}
      />
    </div>
  )
}
