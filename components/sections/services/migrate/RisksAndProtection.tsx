import { Check, X } from 'lucide-react'
import { ui } from '@/components/integrations/labels'

interface RisksProtectionData {
  risksTitle?: string
  risksItems?: Array<{ text: string }>
  protectionTitle?: string
  protectionItems?: Array<{ title: string; description: string }>
}

interface RisksAndProtectionProps {
  risksProtection?: RisksProtectionData
}

/** Two columns: the risks a migration carries, and what we do about each. */
export default function RisksAndProtection({ risksProtection }: RisksAndProtectionProps) {
  const risks = risksProtection?.risksItems ?? []
  const protections = risksProtection?.protectionItems ?? []
  if (risks.length === 0 && protections.length === 0) return null

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12`}>
        <div className="flex flex-col gap-6">
          {risksProtection?.risksTitle && (
            <div className="flex flex-col gap-2.5">
              <div className={ui.eyebrow}>Risiko</div>
              <h2 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[32px]">{risksProtection.risksTitle}</h2>
            </div>
          )}
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {risks.map((risk, index) => (
              <li key={index} className="flex items-start gap-3 rounded-lg border border-sc-ink-100 bg-white p-5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sc-ink-100 text-sc-ink-700">
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <p className="m-0 text-[15px] leading-relaxed text-sc-ink-700">{risk.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          {risksProtection?.protectionTitle && (
            <div className="flex flex-col gap-2.5">
              <div className={ui.eyebrow}>Slik sikrer vi deg</div>
              <h2 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[32px]">{risksProtection.protectionTitle}</h2>
            </div>
          )}
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {protections.map((protection, index) => (
              <li key={index} className="flex items-start gap-3 rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sc-cyan-500 text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                  {protection.title && <h3 className="m-0 text-base font-semibold leading-snug text-sc-ink-900">{protection.title}</h3>}
                  {protection.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{protection.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
