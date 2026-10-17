import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { ui } from '@/components/integrations/labels'
import type { Image as SanityImage } from 'sanity'

interface OurStoryData {
  title?: string
  description?: string
  imageUrl?: string
  image?: SanityImage
  imageAlt?: string
}

/** The story as readable paragraphs beside the team photo in a hairline frame. */
export default function OurStory({ ourStory }: { ourStory?: OurStoryData }) {
  if (!ourStory?.title && !ourStory?.description) return null
  const src = ourStory?.image && (ourStory.image as { asset?: unknown }).asset ? urlFor(ourStory.image).width(1200).url() : ourStory?.imageUrl
  const paragraphs = (ourStory?.description ?? '').split(/\n\s*\n|(?<=[.!?])\s+(?=[A-ZÆØÅ][^.]{60,})/).filter(Boolean)
  return (
    <section id="historie" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className={`${ui.container} grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16`}>
        <div>
          <div className={`${ui.eyebrow} mb-4`}>Historien</div>
          {ourStory?.title && <h2 className={`${ui.h2} mb-6`}>{ourStory.title}</h2>}
          <div className="flex flex-col gap-4 text-base leading-relaxed text-sc-ink-600 lg:text-[17px]">
            {paragraphs.map((p, i) => <p key={i} className="m-0">{p.trim()}</p>)}
          </div>
        </div>
        {src && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50 lg:sticky lg:top-24">
            <Image src={src} alt={ourStory?.imageAlt || ''} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 540px" />
          </div>
        )}
      </div>
    </section>
  )
}
