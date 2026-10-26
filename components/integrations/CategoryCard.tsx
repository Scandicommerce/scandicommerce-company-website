import Link from 'next/link'
import { CalendarCheck, Calculator, CreditCard, Database, Megaphone, Store, Truck, Warehouse, type LucideIcon } from 'lucide-react'
import { hrefFor } from '@/lib/routes'
import { T, lang, ui, type CategorySummary } from './labels'

/** One Lucide icon per category key, drawn white on the site's cyan disc. */
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  erp: Calculator,
  oms: Warehouse,
  pim: Database,
  logistikk: Truck,
  betaling: CreditCard,
  pos: Store,
  markedsforing: Megaphone,
  booking: CalendarCheck,
}

export function CategoryIcon({ categoryKey, size = 48 }: { categoryKey: string; size?: number }) {
  const Icon = CATEGORY_ICON[categoryKey] ?? Database
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-sc-cyan-500 text-white" style={{ width: size, height: size }} aria-hidden="true">
      <Icon size={Math.round(size * 0.46)} strokeWidth={1.75} />
    </span>
  )
}

export default function CategoryCard({ category, language }: { category: CategorySummary; language: string }) {
  const t = T[lang(language)]
  const vendors = (category.vendors ?? []).filter(Boolean)
  return (
    <Link href={hrefFor({ _type: 'integrationCategory', slug: category.slug, language }, language)} className={`${ui.card} p-7`}>
      <CategoryIcon categoryKey={category.key} />
      <span className="text-xl font-semibold text-sc-ink-900">{category.title}</span>
      {vendors.length > 0 && <span className={ui.mono}>{vendors.join(' · ')}</span>}
      <span className="mt-auto text-sm font-medium text-sc-cyan-600">{t.integrationsCount(category.count ?? 0)} →</span>
    </Link>
  )
}
