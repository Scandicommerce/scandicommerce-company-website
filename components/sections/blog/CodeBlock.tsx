import type { CodeBlock as CodeBlockType } from '@/lib/blogBuilder'

/** Ink-900 code sample with the language in the corner. */
export function CodeSample({ code, language }: { code?: string | null; language?: string | null }) {
  const text = code?.trim()
  if (!text) return null
  const lang = language?.trim() || 'text'
  return (
    <div className="overflow-hidden rounded-lg border border-sc-ink-800 bg-sc-ink-900">
      <div className="flex items-center justify-between border-b border-sc-ink-800 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-sc-ink-400">{lang}</div>
      <pre className="m-0 overflow-x-auto p-4 font-mono text-[13px] leading-[1.6] text-sc-ink-100 md:p-5">
        <code className={`language-${lang}`}>{text}</code>
      </pre>
    </div>
  )
}

interface CodeBlockProps {
  block: CodeBlockType
}

export default function CodeBlock({ block }: CodeBlockProps) {
  return <CodeSample code={block.code} language={block.language} />
}
