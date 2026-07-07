'use client'

import { usePathname } from 'next/navigation'

/** Small fixed banner shown while draft mode (visual editing preview) is active. */
export default function DraftModeBanner() {
  const pathname = usePathname()
  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-3 rounded-full bg-[#1F1D1D] px-4 py-2 text-xs font-semibold text-white shadow-lg">
      <span className="h-2 w-2 rounded-full bg-[#1EEFFA] animate-pulse" />
      Forhåndsvisning (utkast)
      <a
        href={`/api/draft-mode/disable?redirect=${encodeURIComponent(pathname || '/')}`}
        className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20 transition-colors"
      >
        Avslutt
      </a>
    </div>
  )
}
