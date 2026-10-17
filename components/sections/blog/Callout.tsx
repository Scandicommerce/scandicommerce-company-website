import type { CalloutBlock, CalloutVariant } from '@/lib/blogBuilder'
import { ui } from '@/components/integrations/labels'
import { postLabels } from './labels'

interface CalloutProps {
  block: CalloutBlock
  language?: string
}

const PANEL: Record<CalloutVariant, { box: string; eyebrow: string }> = {
  tldr: { box: 'bg-sc-cyan-50', eyebrow: 'text-sc-cyan-700' },
  success: { box: 'bg-sc-cyan-50', eyebrow: 'text-sc-cyan-700' },
  info: { box: 'bg-sc-ink-50 border-l-2 border-sc-ink-900', eyebrow: 'text-sc-ink-500' },
  warning: { box: 'bg-sc-ink-50 border-l-2 border-sc-ink-900', eyebrow: 'text-sc-ink-500' },
}

/** Note panel: cyan for TL;DR and positive notes, ink-50 with a left rule for information and warnings. */
export default function Callout({ block, language = 'no' }: CalloutProps) {
  const content = block.content?.trim()
  if (!content) return null
  const t = postLabels(language)
  const variant = (block.variant ?? 'info') as CalloutVariant
  const style = PANEL[variant] ?? PANEL.info
  const title = block.title?.trim() || (variant === 'tldr' ? t.tldr : variant === 'warning' ? t.note : '')

  return (
    <aside className={`rounded-lg p-6 lg:p-8 ${style.box}`}>
      {title && <div className={`${ui.eyebrow} mb-2 ${style.eyebrow}`}>{title}</div>}
      <p className="m-0 whitespace-pre-line text-base leading-relaxed text-sc-ink-700">{content}</p>
    </aside>
  )
}
