import Image from 'next/image'
import { sanityImg } from '@/lib/sanityImage'
import { ui } from '@/components/integrations/labels'
import BlogContent from './BlogContent'
import PostToc from './PostToc'
import type { OutlineItem, PreparedBlock } from './outline'

interface PostBodyProps {
  blocks: PreparedBlock[]
  outline: OutlineItem[]
  language: string
  image?: string | null
  imageAlt: string
}

/**
 * Hero image in a 16:9 hairline frame, then the table of contents sticky
 * beside a 720px reading column (the case-study page rhythm).
 */
export default function PostBody({ blocks, outline, language, image, imageAlt }: PostBodyProps) {
  const hasToc = outline.length > 0

  return (
    <section className="bg-white pb-16 lg:pb-20">
      {image && (
        <div className={`${ui.container} mb-10 lg:mb-14`}>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
            <Image src={sanityImg(image, 1600) as string} alt={imageAlt} fill priority className="object-cover" sizes="(max-width: 1100px) 100vw, 1036px" />
          </div>
        </div>
      )}

      <div className={`${ui.container} grid grid-cols-1 gap-10 ${hasToc ? 'lg:grid-cols-[240px_minmax(0,720px)] lg:gap-14' : ''}`}>
        {hasToc && (
          <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
            <PostToc items={outline} language={language} />
          </aside>
        )}
        <div className="w-full min-w-0 max-w-[720px]">
          <BlogContent blocks={blocks} language={language} />
        </div>
      </div>
    </section>
  )
}
