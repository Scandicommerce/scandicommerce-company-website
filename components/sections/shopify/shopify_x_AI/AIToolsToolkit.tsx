import { ui } from '@/components/integrations/labels'

interface ToolCategory {
  title?: string
  description?: string
}

interface AiToolsToolkitData {
  title?: string
  toolCategories?: ToolCategory[]
  bottomText?: string
}

/** Tool categories as numbered hairline cards. */
export default function AIToolsToolkit({ aiToolsToolkit, lang = 'no' }: { aiToolsToolkit?: AiToolsToolkitData; lang?: string }) {
  const categories = (aiToolsToolkit?.toolCategories ?? []).filter((c) => c?.title || c?.description)
  if (!aiToolsToolkit?.title && categories.length === 0) return null
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{lang === 'no' ? 'Verktøykassen' : 'The toolkit'}</div>
          {aiToolsToolkit?.title && <h2 className={ui.h2}>{aiToolsToolkit.title}</h2>}
        </div>
        {categories.length > 0 && (
          <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {categories.map((c, i) => (
              <li key={i} className={ui.card}>
                <span className={ui.mono}>{String(i + 1).padStart(2, '0')}</span>
                {c.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{c.title}</h3>}
                {c.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{c.description}</p>}
              </li>
            ))}
          </ol>
        )}
        {aiToolsToolkit?.bottomText && <p className="m-0 max-w-[760px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{aiToolsToolkit.bottomText}</p>}
      </div>
    </section>
  )
}
