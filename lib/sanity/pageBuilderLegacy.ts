import { normalizeDocumentSections, type SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

/**
 * [legacyRootField, section block `_type`] per page type.
 * Documentation / migration reference only: the site reads `sections[]` exclusively.
 * Consumed by scripts/sanity-unset-legacy-roots.ts to clear the old root objects in Sanity.
 */
export const LEGACY_OBJECT_PAIRS: Record<string, ReadonlyArray<readonly [string, string]>> = {
  workPage: [
    ['hero', 'workPageHeroSection'],
    ['caseStudies', 'workPageCaseStudiesSection'],
    ['cta', 'workPageCtaSection'],
  ],
  aboutPage: [
    ['hero', 'aboutPageHeroSection'],
    ['whyDifferent', 'aboutPageWhyDifferentSection'],
    ['ourStory', 'aboutPageOurStorySection'],
    ['ourValues', 'aboutPageOurValuesSection'],
    ['meetTheTeam', 'aboutPageMeetTheTeamSection'],
    ['trustedPartnerships', 'aboutPageTrustedPartnershipsSection'],
    ['cta', 'aboutPageCtaSection'],
  ],
  partnersPage: [
    ['hero', 'partnersPageHeroSection'],
    ['whyOurPartnership', 'partnersPageWhyOurPartnershipSection'],
    ['partnersGrid', 'partnersPagePartnersGridSection'],
    ['cta', 'partnersPageCtaSection'],
  ],
  migratePage: [
    ['hero', 'migratePageHeroSection'],
    ['platforms', 'migratePagePlatformsSection'],
    ['risksProtection', 'migratePageRisksProtectionSection'],
    ['process', 'migratePageProcessSection'],
    ['results', 'migratePageResultsSection'],
    ['cta', 'migratePageCtaSection'],
  ],
  allPackagesPage: [
    ['hero', 'allPackagesPageHeroSection'],
    ['packages', 'allPackagesPagePackagesSection'],
    ['faq', 'allPackagesPageFaqSection'],
  ],
  blogPage: [
    ['hero', 'blogPageHeroSection'],
    ['featuredArticle', 'blogPageFeaturedArticleSection'],
    ['articlesGrid', 'blogPageArticlesGridSection'],
    ['newsletterCta', 'blogPageNewsletterCtaSection'],
  ],
  merchPage: [
    ['hero', 'merchPageHeroSection'],
    ['qualityShowcase', 'merchPageQualityShowcaseSection'],
    ['newsletter', 'merchPageNewsletterSection'],
  ],
  shopifyDevelopmentPage: [
    ['hero', 'shopifyDevelopmentPageHeroSection'],
    ['whyShopify', 'shopifyDevelopmentPageWhyShopifySection'],
    ['scenarios', 'shopifyDevelopmentPageScenariosSection'],
    ['howWeWork', 'shopifyDevelopmentPageHowWeWorkSection'],
    ['testimonial', 'shopifyDevelopmentPageTestimonialSection'],
    ['cta', 'shopifyDevelopmentPageCtaSection'],
  ],
  shopifyPosPage: [
    ['hero', 'shopifyPosPageHeroSection'],
    ['features', 'shopifyPosPageFeaturesSection'],
    ['perfectFor', 'shopifyPosPagePerfectForSection'],
    ['cta', 'shopifyPosPageCtaSection'],
  ],
  shopifyPlatformPage: [
    ['hero', 'shopifyPlatformPageHeroSection'],
    ['bleedingMoney', 'shopifyPlatformPageBleedingMoneySection'],
    ['shopifyEmpires', 'shopifyPlatformPageShopifyEmpiresSection'],
    ['revenueForm', 'shopifyPlatformPageRevenueFormSection'],
    ['successStories', 'shopifyPlatformPageSuccessStoriesSection'],
  ],
  shopifyPosInfoPage: [
    ['hero', 'shopifyPosInfoPageHeroSection'],
    ['bleedingMoney', 'shopifyPosInfoPageBleedingMoneySection'],
    ['omnichannelFeatures', 'shopifyPosInfoPageOmnichannelFeaturesSection'],
    ['revenueForm', 'shopifyPosInfoPageRevenueFormSection'],
  ],
  shopifyTcoCalculatorPage: [['hero', 'shopifyTcoCalculatorPageHeroSection']],
  shopifyXPimPage: [
    ['hero', 'shopifyXPimPageHeroSection'],
    ['whatIsPim', 'shopifyXPimPageWhatIsPimSection'],
    ['integratingPim', 'shopifyXPimPageIntegratingPimSection'],
    ['whichBusinesses', 'shopifyXPimPageWhichBusinessesSection'],
    ['timeSavings', 'shopifyXPimPageTimeSavingsSection'],
    ['whyGoodInvestment', 'shopifyXPimPageWhyGoodInvestmentSection'],
    ['combinedSection', 'shopifyXPimCombinedSection'],
    ['cta', 'shopifyXPimPageCtaSection'],
  ],
  shopifyXAiPage: [
    ['hero', 'shopifyXAiPageHeroSection'],
    ['enhancingWithAi', 'shopifyXAiPageEnhancingWithAiSection'],
    ['howWeLeverageAi', 'shopifyXAiPageHowWeLeverageAiSection'],
    ['aiToolsToolkit', 'shopifyXAiPageAiToolsToolkitSection'],
    ['howWeApplyAi', 'shopifyXAiPageHowWeApplyAiSection'],
    ['aiEnhancedProcess', 'shopifyXAiPageAiEnhancedProcessSection'],
    ['faq', 'shopifyXAiPageFaqSection'],
    ['cta', 'shopifyXAiPageCtaSection'],
  ],
  whyShopifyPage: [
    ['hero', 'whyShopifyPageHeroSection'],
    ['whatIsShopify', 'whyShopifyPageWhatIsShopifySection'],
    ['shopifyFacts', 'whyShopifyPageShopifyFactsSection'],
    ['whyBusinessesChoose', 'whyShopifyPageWhyBusinessesChooseSection'],
    ['whyScandicommerceSpecializes', 'whyShopifyPageWhyScandicommerceSpecializesSection'],
    ['shopifyAi', 'whyShopifyPageShopifyAiSection'],
    ['cta', 'whyShopifyPageCtaSection'],
  ],
  vippsHurtigkassePage: [
    ['hero', 'vippsHurtigkassePageHeroSection'],
    ['features', 'vippsHurtigkassePageFeaturesSection'],
    ['howToGetStarted', 'vippsHurtigkassePageHowToGetStartedSection'],
    ['pricing', 'vippsHurtigkassePagePricingSection'],
    ['orderForm', 'vippsHurtigkassePageOrderFormSection'],
    ['support', 'vippsHurtigkassePageSupportSection'],
  ],
}

export type PageBuilderDocumentType =
  | keyof typeof LEGACY_OBJECT_PAIRS
  | 'contactPage'
  | 'packageDetailPage'
  | 'landingPage'

/** Page-builder sections for a page document. `documentType` only documents the caller's page type. */
export function normalizePageSections(
  documentType: PageBuilderDocumentType,
  doc: object | null | undefined
): SanitySectionItem[] {
  return normalizeDocumentSections(doc)
}
