import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

/** Normalizes legacy wrapper objects and merges `sections[]` into flat package detail shape for sanityToPackage. */
export function mergePackageDetailPageData(
  pageData: object | null | undefined,
  sections: SanitySectionItem[]
): Record<string, unknown> {
  const base = { ...((pageData as Record<string, unknown> | null | undefined) ?? {}) }

  const strArr = (v: unknown, inner: string): string[] | undefined => {
    if (v == null) return undefined
    if (Array.isArray(v)) return v as string[]
    if (typeof v === 'object' && inner in (v as object)) {
      const x = (v as Record<string, unknown>)[inner]
      return Array.isArray(x) ? (x as string[]) : undefined
    }
    return undefined
  }

  const numField = (v: unknown, inner: string): number | undefined => {
    if (v == null) return undefined
    if (typeof v === 'number') return v
    if (typeof v === 'object' && inner in (v as object)) {
      const x = (v as Record<string, unknown>)[inner]
      return typeof x === 'number' ? x : undefined
    }
    return undefined
  }

  const arrField = <T>(v: unknown, inner: string): T[] | undefined => {
    if (v == null) return undefined
    if (Array.isArray(v)) return v as T[]
    if (typeof v === 'object' && inner in (v as object)) {
      const x = (v as Record<string, unknown>)[inner]
      return Array.isArray(x) ? (x as T[]) : undefined
    }
    return undefined
  }

  const out: Record<string, unknown> = {
    ...base,
    bestFor: strArr(base.bestFor, 'bestFor') ?? base.bestFor,
    idealFor: strArr(base.idealFor, 'idealFor') ?? base.idealFor,
    highlights: strArr(base.highlights, 'highlights') ?? base.highlights,
    included: strArr(base.included, 'included') ?? base.included,
    moreDeliverablesCount: numField(base.moreDeliverablesCount, 'moreDeliverablesCount') ?? base.moreDeliverablesCount,
    includedCategories:
      arrField<{ category?: string; items?: string[] }>(base.includedCategories, 'includedCategories') ??
      base.includedCategories,
    processSteps:
      arrField<{ week?: string; title?: string; description?: string }>(base.processSteps, 'processSteps') ??
      base.processSteps,
    faq: arrField<{ question?: string; answer?: string }>(base.faq, 'faq') ?? base.faq,
    reviews: arrField<{ name?: string; rating?: number; comment?: string; title?: string }>(base.reviews, 'reviews') ??
      base.reviews,
  }

  for (const s of sections) {
    const { _type, _key, ...rest } = s
    const r = rest as Record<string, unknown>
    switch (_type) {
      case 'packageDetailPagePackageInfoSection':
        out.packageInfo = { ...(out.packageInfo as object | undefined), ...r }
        break
      case 'packageDetailPageHeroButtonsSection':
        out.heroButtons = { ...(out.heroButtons as object | undefined), ...r }
        break
      case 'packageDetailPageBestForSection':
        if (r.bestFor != null) out.bestFor = r.bestFor
        break
      case 'packageDetailPageIdealForSection':
        if (r.idealFor != null) out.idealFor = r.idealFor
        break
      case 'packageDetailPageHighlightsSection':
        if (r.highlights != null) out.highlights = r.highlights
        break
      case 'packageDetailPageMoreDeliverablesSection':
        if (r.moreDeliverablesCount != null) out.moreDeliverablesCount = r.moreDeliverablesCount
        break
      case 'packageDetailPageIncludedListSection':
        if (r.included != null) out.included = r.included
        break
      case 'packageDetailPageIncludedCategoriesSection':
        if (r.includedCategories != null) out.includedCategories = r.includedCategories
        break
      case 'packageDetailPageProcessStepsSection':
        if (r.processSteps != null) out.processSteps = r.processSteps
        break
      case 'packageDetailPageFaqListSection':
        if (r.faq != null) out.faq = r.faq
        break
      case 'packageDetailPageReviewsListSection':
        if (r.reviews != null) out.reviews = r.reviews
        break
      case 'packageDetailPageTabLabelsSection':
        out.tabLabels = { ...(out.tabLabels as object | undefined), ...r }
        break
      case 'packageDetailPageAddOnsSection':
        out.addOns = { ...(out.addOns as object | undefined), ...r }
        break
      case 'packageDetailPageCaseStudiesBannerSection':
        out.caseStudiesBanner = { ...(out.caseStudiesBanner as object | undefined), ...r }
        break
      default:
        break
    }
  }

  return out
}
