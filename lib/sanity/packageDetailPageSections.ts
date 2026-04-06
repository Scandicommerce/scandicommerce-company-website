import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

function nonEmptyObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length > 0)
}

/** Prefer `sections[]`; otherwise build ordered blocks from legacy root fields (including root arrays). */
export function normalizePackageDetailPageSections(
  doc: Record<string, unknown> | null | undefined
): SanitySectionItem[] {
  if (!doc) return []
  const raw = doc.sections
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.filter((item): item is SanitySectionItem => {
      return Boolean(item && typeof item === 'object' && '_type' in item && '_key' in item)
    }) as SanitySectionItem[]
  }

  const out: SanitySectionItem[] = []
  if (nonEmptyObject(doc.packageInfo)) {
    out.push({
      _key: 'legacy-packageInfo',
      _type: 'packageDetailPagePackageInfoSection',
      ...(doc.packageInfo as object),
    })
  }
  if (nonEmptyObject(doc.heroButtons)) {
    out.push({
      _key: 'legacy-heroButtons',
      _type: 'packageDetailPageHeroButtonsSection',
      ...(doc.heroButtons as object),
    })
  }
  if (Array.isArray(doc.bestFor) && doc.bestFor.length > 0) {
    out.push({
      _key: 'legacy-bestFor',
      _type: 'packageDetailPageBestForSection',
      bestFor: doc.bestFor as string[],
    })
  }
  if (Array.isArray(doc.idealFor) && doc.idealFor.length > 0) {
    out.push({
      _key: 'legacy-idealFor',
      _type: 'packageDetailPageIdealForSection',
      idealFor: doc.idealFor as string[],
    })
  }
  if (Array.isArray(doc.highlights) && doc.highlights.length > 0) {
    out.push({
      _key: 'legacy-highlights',
      _type: 'packageDetailPageHighlightsSection',
      highlights: doc.highlights as string[],
    })
  }
  if (typeof doc.moreDeliverablesCount === 'number') {
    out.push({
      _key: 'legacy-moreDeliverablesCount',
      _type: 'packageDetailPageMoreDeliverablesSection',
      moreDeliverablesCount: doc.moreDeliverablesCount,
    })
  }
  if (Array.isArray(doc.included) && doc.included.length > 0) {
    out.push({
      _key: 'legacy-included',
      _type: 'packageDetailPageIncludedListSection',
      included: doc.included as string[],
    })
  }
  if (Array.isArray(doc.includedCategories) && doc.includedCategories.length > 0) {
    out.push({
      _key: 'legacy-includedCategories',
      _type: 'packageDetailPageIncludedCategoriesSection',
      includedCategories: doc.includedCategories as unknown[],
    })
  }
  if (Array.isArray(doc.processSteps) && doc.processSteps.length > 0) {
    out.push({
      _key: 'legacy-processSteps',
      _type: 'packageDetailPageProcessStepsSection',
      processSteps: doc.processSteps as unknown[],
    })
  }
  if (Array.isArray(doc.faq) && doc.faq.length > 0) {
    out.push({
      _key: 'legacy-faq',
      _type: 'packageDetailPageFaqListSection',
      faq: doc.faq as unknown[],
    })
  }
  if (Array.isArray(doc.reviews) && doc.reviews.length > 0) {
    out.push({
      _key: 'legacy-reviews',
      _type: 'packageDetailPageReviewsListSection',
      reviews: doc.reviews as unknown[],
    })
  }
  if (nonEmptyObject(doc.tabLabels)) {
    out.push({
      _key: 'legacy-tabLabels',
      _type: 'packageDetailPageTabLabelsSection',
      ...(doc.tabLabels as object),
    })
  }
  if (nonEmptyObject(doc.addOns)) {
    out.push({
      _key: 'legacy-addOns',
      _type: 'packageDetailPageAddOnsSection',
      ...(doc.addOns as object),
    })
  }
  if (nonEmptyObject(doc.caseStudiesBanner)) {
    out.push({
      _key: 'legacy-caseStudiesBanner',
      _type: 'packageDetailPageCaseStudiesBannerSection',
      ...(doc.caseStudiesBanner as object),
    })
  }
  return out
}
