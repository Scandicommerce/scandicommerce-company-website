import { ui } from '@/components/integrations/labels'

interface ProcessStep {
  title?: string
  description?: string
}

interface AiEnhancedProcessData {
  title?: string
  processSteps?: ProcessStep[]
}

/** Process as numbered steps: mono numbers over a hairline, like HowWeWork. */
export default function AIEnhancedProcess({ aiEnhancedProcess, lang = 'no' }: { aiEnhancedProcess?: AiEnhancedProcessData; lang?: string }) {
  const steps = (aiEnhancedProcess?.processSteps ?? []).filter((s) => s?.title || s?.description)
  if (!aiEnhancedProcess?.title && steps.length === 0) return null
  const cols = steps.length >= 4 && steps.length % 3 !== 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{lang === 'no' ? 'Prosess' : 'Process'}</div>
          {aiEnhancedProcess?.title && <h2 className={ui.h2}>{aiEnhancedProcess.title}</h2>}
        </div>
        {steps.length > 0 && (
          <ol className={`m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 ${cols} lg:gap-8`}>
            {steps.map((step, i) => (
              <li key={i} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                <span className={ui.mono}>{String(i + 1).padStart(2, '0')}</span>
                {step.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{step.title}</h3>}
                {step.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{step.description}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
