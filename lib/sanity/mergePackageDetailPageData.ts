import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

/** Flattens `sections[]` blocks onto the page document into the shape sanityToPackage reads. */
export function mergePackageDetailPageData(
  pageData: object | null | undefined,
  sections: SanitySectionItem[]
): Record<string, unknown> {
  const base = { ...((pageData as Record<string, unknown> | null | undefined) ?? {}) }

  const out: Record<string, unknown> = { ...base }

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
