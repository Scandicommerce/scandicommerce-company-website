import type { VideoBlock as VideoBlockType } from '@/lib/blogBuilder'

interface VideoBlockProps {
  block: VideoBlockType
}

/** Self-hosted video in a hairline frame. Autoplay implies muted and looping. */
export default function VideoBlock({ block }: VideoBlockProps) {
  const url = block.url
  if (!url) return null
  const autoplay = !!block.autoplay

  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-900">
        <video src={url} poster={block.poster || undefined} controls={!autoplay} autoPlay={autoplay} muted={autoplay} loop={autoplay} playsInline preload="metadata" className="block h-auto w-full" />
      </div>
      {block.caption && <figcaption className="text-[13px] text-sc-ink-500">{block.caption}</figcaption>}
    </figure>
  )
}
