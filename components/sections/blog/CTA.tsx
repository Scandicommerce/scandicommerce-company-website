import Link from 'next/link'
import type { CtaBlock } from '@/lib/blogBuilder'
import { ensureInternalHref } from '@/lib/routes'
import PostPortableText from './PostPortableText'

interface CTAProps {
  block: CtaBlock
}

const PRIMARY = 'inline-flex min-h-[46px] items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 no-underline transition-colors hover:bg-sc-ink-50'
const SECONDARY = 'inline-flex min-h-[46px] items-center justify-center rounded-lg border border-white/40 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white no-underline transition-colors hover:bg-white/10'

/** In-column call to action on the ink-900 band the rest of the site uses. */
export default function CTA({ block }: CTAProps) {
  const heading = block.heading?.trim()
  const body = Array.isArray(block.body) && block.body.length > 0 ? block.body : null
  const fromSchema = (block.buttons ?? [])
    .filter((b) => b?.label?.trim() && b?.url?.trim())
    .map((b) => ({ label: b!.label!.trim(), url: b!.url!.trim(), variant: b?.variant ?? 'primary' }))
  const legacy = block.buttonLabel?.trim() && block.buttonUrl?.trim() ? [{ label: block.buttonLabel.trim(), url: block.buttonUrl.trim(), variant: 'primary' as const }] : []
  const buttons = fromSchema.length > 0 ? fromSchema : legacy

  if (!heading && buttons.length === 0) return null

  return (
    <aside className="rounded-lg bg-sc-ink-900 p-7 text-white lg:p-10">
      <div className="flex flex-col gap-4">
        {heading && <h2 className="m-0 text-[24px] font-bold leading-[1.15] tracking-[-0.02em] md:text-[28px]">{heading}</h2>}
        {body && <PostPortableText value={body} size="compact" className="[&_p]:text-sc-ink-200 [&_li]:text-sc-ink-200 [&_strong]:text-white [&_a]:text-white" />}
        {buttons.length > 0 && (
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            {buttons.map((button, i) => (
              <Link key={`${button.label}-${i}`} href={ensureInternalHref(button.url)} className={button.variant === 'secondary' ? SECONDARY : PRIMARY}>
                {button.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
