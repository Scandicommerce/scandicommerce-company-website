import { ui } from '@/components/integrations/labels'

interface Value {
  title?: string
  description?: string
}

interface OurValuesData {
  title?: string
  values?: Value[]
}

/** Values as a numbered hairline list, four to a row on desktop. */
export default function OurValues({ ourValues }: { ourValues?: OurValuesData }) {
  const values = (ourValues?.values ?? []).filter((v) => v?.title)
  if (values.length === 0) return null
  return (
    <section id="verdier" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>Verdier</div>
          {ourValues?.title && <h2 className={ui.h2}>{ourValues.title}</h2>}
        </div>
        <ol className="m-0 grid list-none grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li key={i} className="flex flex-col gap-3 bg-white p-6">
              <span className="font-mono text-[13px] text-sc-ink-500">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="m-0 text-[19px] font-bold leading-snug tracking-[-0.01em] text-sc-ink-900">{v.title}</h3>
              {v.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{v.description}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
