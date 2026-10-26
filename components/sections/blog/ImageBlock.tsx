import Image from 'next/image'
import type { ImageBlock as ImageBlockType } from '@/lib/blogBuilder'
import { urlFor } from '@/sanity/lib/image'

interface ImageBlockProps {
  block: ImageBlockType
}

/** Image in a hairline frame at its own ratio, caption underneath. */
export default function ImageBlock({ block }: ImageBlockProps) {
  const image = block.image
  if (!image) return null
  const asset = image.asset as { url?: string; metadata?: { dimensions?: { width?: number; height?: number } } } | undefined
  const src = asset?.url ?? urlFor(image).width(1440).url()
  if (!src) return null
  const dims = asset?.metadata?.dimensions
  const alt = block.alt ?? image.alt ?? ''
  const caption = block.caption ?? (image as { caption?: string }).caption

  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
        <Image src={src} alt={alt} width={dims?.width ?? 1440} height={dims?.height ?? 810} className="block h-auto w-full" sizes="(max-width: 768px) 100vw, 720px" />
      </div>
      {caption && <figcaption className="text-[13px] text-sc-ink-500">{caption}</figcaption>}
    </figure>
  )
}
