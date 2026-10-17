import Image from 'next/image'
import Link from 'next/link'
import { Author } from '@/lib/articles'
import { authorHref } from '@/lib/routes'
import { ui } from '@/components/integrations/labels'

interface AuthorBioProps {
  author: Author
  lang?: string
}

const T: Record<string, { eyebrow: string; more: string }> = {
  no: { eyebrow: 'Skrevet av', more: 'Flere artikler av' },
  en: { eyebrow: 'Written by', more: 'More articles by' },
}

/** Author card after the body: portrait, name (linked to /team/<slug>), role. */
export default function AuthorBio({ author, lang = 'no' }: AuthorBioProps) {
  if (!author.name) return null
  const t = T[lang] ?? T.en
  const link = author.slug ? authorHref(author.slug, lang) : undefined

  return (
    <section className="border-t border-sc-ink-100 bg-white py-12 lg:py-16">
      <div className={ui.container}>
        <div className="flex max-w-[720px] flex-col gap-5 rounded-lg border border-sc-ink-100 bg-white p-6 sm:flex-row sm:items-center sm:gap-6 lg:p-8">
          {author.image ? (
            <Image src={author.image} alt={author.name} width={96} height={96} className="h-20 w-20 flex-shrink-0 rounded-full border border-sc-ink-100 object-cover sm:h-24 sm:w-24" />
          ) : (
            <span aria-hidden="true" className="h-20 w-20 flex-shrink-0 rounded-full border border-sc-ink-100 bg-sc-ink-50 sm:h-24 sm:w-24" />
          )}
          <div className="flex flex-col gap-1.5">
            <div className={ui.eyebrow}>{t.eyebrow}</div>
            <h2 className="m-0 text-[20px] font-bold leading-tight text-sc-ink-900">{author.name}</h2>
            {author.role && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{author.role}</p>}
            {link && (
              <Link href={link} className="mt-1 text-sm font-semibold text-sc-ink-900 no-underline transition-colors hover:text-sc-cyan-600">
                {t.more} {author.name.split(' ')[0]} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
