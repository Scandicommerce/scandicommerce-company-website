'use client'

import dynamic from 'next/dynamic'
import DraftModeBanner from './DraftModeBanner'

const VisualEditing = dynamic(() => import('next-sanity').then((m) => m.VisualEditing), { ssr: false })

/** Click-to-edit overlays and the draft banner. next-sanity is only fetched when this renders (draft mode). */
export default function DraftModeTools() {
  return (
    <>
      <VisualEditing />
      <DraftModeBanner />
    </>
  )
}
