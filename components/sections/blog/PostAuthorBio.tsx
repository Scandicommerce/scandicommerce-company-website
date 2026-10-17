import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/blogBuilder'
import { authorHref } from '@/lib/routes'
import { sanityImg } from '@/lib/sanityImage'
import { ui } from '@/components/integrations/labels'
import { postLabels } from './labels'

interface PostAuthorBioProps {
  author: Post['author']
  language: string
}

/** Author card after the body: portrait, name linked to /team/<slug>, role. */
export default function PostAuthorBio({ author, language }: PostAuthorBioProps) {
  if (!author?.name) return null
  const t = postLabels(language)
  const link = author.slug ? authorHref(author.slug, language) : null

  return (
    <section className="border-t border-sc-ink-100 bg-white py-12 lg:py-16">
      <div className={ui.container}>
        <div className="flex max-w-[720px] flex-col gap-5 rounded-lg border border-sc-ink-100 bg-white p-6 sm:flex-row sm:items-center sm:gap-6 lg:p-8">
          {author.image ? (
            <Image src={sanityImg(author.image, 192) as string} alt={author.name} width={96} height={96} className="h-20 w-20 flex-shrink-0 rounded-full border border-sc-ink-100 object-cover sm:h-24 sm:w-24" />
          ) : (
            <span aria-hidden="true" className="h-20 w-20 flex-shrink-0 rounded-full border border-sc-ink-100 bg-sc-ink-50 sm:h-24 sm:w-24" />
          )}
          <div className="flex flex-col gap-1.5">
            <div className={ui.eyebrow}>{t.writtenBy}</div>
            <h2 className="m-0 text-[20px] font-bold leading-tight text-sc-ink-900">{author.name}</h2>
            {author.role && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{author.role}</p>}
            {link && (
              <Link href={link} className="mt-1 text-sm font-semibold text-sc-ink-900 no-underline transition-colors hover:text-sc-cyan-600">
                {t.morePostsBy} {author.name.split(' ')[0]} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
