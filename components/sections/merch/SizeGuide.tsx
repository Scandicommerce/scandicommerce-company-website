import { ui } from '@/components/integrations/labels'

interface SizeData {
  size?: string
  chest?: string
  length?: string
  sleeve?: string
}

interface SizeGuideData {
  title?: string
  description?: string
  contactButtonText?: string
  sizes?: SizeData[]
}

interface SizeGuideProps {
  sizeGuide?: SizeGuideData
}

const defaultSizes: SizeData[] = [
  { size: 'XS', chest: '86-91 cm', length: '66 cm', sleeve: '81 cm' },
  { size: 'S', chest: '91-97 cm', length: '68 cm', sleeve: '84 cm' },
  { size: 'M', chest: '97-102 cm', length: '71 cm', sleeve: '86 cm' },
  { size: 'L', chest: '102-107 cm', length: '73 cm', sleeve: '89 cm' },
  { size: 'XL', chest: '107-112 cm', length: '76 cm', sleeve: '91 cm' },
  { size: 'XXL', chest: '112-117 cm', length: '78 cm', sleeve: '94 cm' },
]

const COLUMNS: Array<{ key: keyof SizeData; label: string }> = [
  { key: 'size', label: 'Size' },
  { key: 'chest', label: 'Chest' },
  { key: 'length', label: 'Length' },
  { key: 'sleeve', label: 'Sleeve' },
]

/** Size table on the data-flow table pattern: mono values, hairline rows. */
export default function SizeGuide({ sizeGuide }: SizeGuideProps) {
  const title = sizeGuide?.title || 'Size Guide'
  const description = sizeGuide?.description || 'All measurements in centimeters. Need help choosing?'
  const contactButtonText = sizeGuide?.contactButtonText || 'Contact Support'
  const sizes = sizeGuide?.sizes && sizeGuide.sizes.length > 0 ? sizeGuide.sizes : defaultSizes

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>Sizing</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">
            {description}{' '}
            <a href="/contact" className="font-semibold text-sc-ink-900 underline decoration-sc-ink-300 underline-offset-4 transition-colors hover:text-sc-cyan-600">
              {contactButtonText}
            </a>
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-sc-ink-100 bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-sc-ink-200">
                {COLUMNS.map((col) => (
                  <th key={col.key} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-sc-ink-500">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map((sizeData, index) => (
                <tr key={sizeData.size || index} className="border-b border-sc-ink-100 last:border-b-0">
                  <td className="px-5 py-3.5 text-[15px] font-semibold text-sc-ink-900">{sizeData.size || ''}</td>
                  <td className="px-5 py-3.5 font-mono text-[13px] text-sc-ink-600">{sizeData.chest || ''}</td>
                  <td className="px-5 py-3.5 font-mono text-[13px] text-sc-ink-600">{sizeData.length || ''}</td>
                  <td className="px-5 py-3.5 font-mono text-[13px] text-sc-ink-600">{sizeData.sleeve || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
