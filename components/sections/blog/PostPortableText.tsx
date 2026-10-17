import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextReactComponents } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import { BODY_TEXT, H2, H3 } from './labels'
import { DataTable } from './TableBlock'
import { StatsGrid } from './StatsRow'
import { CodeSample } from './CodeBlock'
import type { MigratedStats, MigratedTable } from './outline'

type Size = 'body' | 'compact'

const P: Record<Size, string> = {
  body: `m-0 ${BODY_TEXT}`,
  compact: 'm-0 text-[15px] leading-relaxed text-sc-ink-600',
}
const LIST: Record<Size, string> = {
  body: `m-0 flex flex-col gap-2 pl-5 ${BODY_TEXT} marker:text-sc-cyan-500`,
  compact: 'm-0 flex flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-sc-ink-600 marker:text-sc-cyan-500',
}
const LINK = 'text-sc-cyan-600 underline underline-offset-2 transition-colors hover:text-sc-cyan-700'

const headingId = (value: unknown) => (value as { headingId?: string } | undefined)?.headingId

function embedUrl(url: string): string {
  try {
    if (url.includes('youtu.be')) return `https://www.youtube.com/embed/${url.split('/').pop()}`
    if (url.includes('youtube.com')) return `https://www.youtube.com/embed/${new URL(url).searchParams.get('v')}`
    if (url.includes('vimeo.com')) return `https://player.vimeo.com/video/${url.split('/').pop()}`
  } catch {
    /* fall through */
  }
  return url
}

function build(size: Size): Partial<PortableTextReactComponents> {
  const h2 = size === 'body' ? `${H2} mt-6` : 'm-0 mt-2 text-[18px] font-bold leading-snug text-sc-ink-900'
  const h3 = size === 'body' ? `${H3} mt-3` : 'm-0 text-[16px] font-bold leading-snug text-sc-ink-900'
  return {
    types: {
      image: ({ value }) => {
        const asset = value?.asset as { url?: string; metadata?: { dimensions?: { width?: number; height?: number } } } | undefined
        const url = asset?.url ?? (asset ? urlFor(value).width(1200).url() : null)
        if (!url) return null
        const dims = asset?.metadata?.dimensions
        return (
          <figure className="m-0 flex flex-col gap-2">
            <div className="overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
              <Image src={url} alt={value.alt || ''} width={dims?.width ?? 1200} height={dims?.height ?? 675} className="block h-auto w-full" sizes="(max-width: 768px) 100vw, 720px" />
            </div>
            {value.caption && <figcaption className="text-[13px] text-sc-ink-500">{value.caption}</figcaption>}
          </figure>
        )
      },
      codeBlock: ({ value }) => <CodeSample code={value?.code} language={value?.language} />,
      videoEmbed: ({ value }) => {
        if (!value?.url) return null
        return (
          <figure className="m-0 flex flex-col gap-2">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-900">
              <iframe src={embedUrl(value.url)} className="absolute inset-0 h-full w-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
            {value.caption && <figcaption className="text-[13px] text-sc-ink-500">{value.caption}</figcaption>}
          </figure>
        )
      },
      postTable: ({ value }) => {
        const rows = (value as MigratedTable).rows
        return <DataTable columns={rows[0]} rows={rows.slice(1)} />
      },
      postStats: ({ value }) => <StatsGrid stats={(value as MigratedStats).stats} />,
    },
    marks: {
      link: ({ children, value }) => {
        const href: string = value?.href ?? '#'
        if (href.startsWith('/')) {
          return (
            <Link href={href} className={LINK}>
              {children}
            </Link>
          )
        }
        return (
          <a href={href} rel="noreferrer noopener" target={value?.blank ? '_blank' : undefined} className={LINK}>
            {children}
          </a>
        )
      },
      strong: ({ children }) => <strong className="font-semibold text-sc-ink-900">{children}</strong>,
      code: ({ children }) => <code className="rounded bg-sc-ink-100 px-1.5 py-0.5 font-mono text-[0.85em] text-sc-ink-900">{children}</code>,
      tech: ({ children }) => <span className="font-mono font-semibold text-sc-ink-900">{children}</span>,
    },
    block: {
      h1: ({ children, value }) => (
        <h2 id={headingId(value)} className={h2}>
          {children}
        </h2>
      ),
      h2: ({ children, value }) => (
        <h2 id={headingId(value)} className={h2}>
          {children}
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3 id={headingId(value)} className={h3}>
          {children}
        </h3>
      ),
      h4: ({ children }) => <h4 className="m-0 text-[17px] font-semibold leading-snug text-sc-ink-900">{children}</h4>,
      normal: ({ children }) => <p className={P[size]}>{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="m-0 border-l-2 border-sc-cyan-500 pl-5 text-[19px] font-medium leading-[1.55] tracking-[-0.01em] text-sc-ink-900">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className={`${LIST[size]} list-disc`}>{children}</ul>,
      number: ({ children }) => <ol className={`${LIST[size]} list-decimal`}>{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="pl-1">{children}</li>,
      number: ({ children }) => <li className="pl-1">{children}</li>,
    },
  }
}

const COMPONENTS: Record<Size, Partial<PortableTextReactComponents>> = { body: build('body'), compact: build('compact') }

interface PostPortableTextProps {
  value: unknown
  /** `body` for the reading column, `compact` inside cards and panels. */
  size?: Size
  className?: string
}

/** Portable text on the post page type scale; headings carry the ids the table of contents links to. */
export default function PostPortableText({ value, size = 'body', className = '' }: PostPortableTextProps) {
  if (!Array.isArray(value) || value.length === 0) return null
  return (
    <div className={`flex flex-col ${size === 'body' ? 'gap-5' : 'gap-3'} ${className}`}>
      <PortableText value={value as never} components={COMPONENTS[size]} />
    </div>
  )
}
