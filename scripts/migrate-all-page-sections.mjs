/**
 * Migrate legacy root fields -> sections[] for all page-builder document types.
 * Mirrors lib/sanity/pageBuilderLegacy.ts, normalizeContactPageSections, normalizePackageDetailPageSections, landing migration.
 *
 * Env: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_SANITY_DATASET (optional)
 *
 *   node scripts/migrate-all-page-sections.mjs
 *   node scripts/migrate-all-page-sections.mjs --dry-run
 *   node scripts/migrate-all-page-sections.mjs --unset
 *
 * Reads NEXT_PUBLIC_* and SANITY_* from `.env.local` / `.env` in the project root.
 */

import './load-env.mjs'
import { createClient } from '@sanity/client'

const dryRun = process.argv.includes('--dry-run')
const unsetLegacy = process.argv.includes('--unset')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.\n' +
      'Add them to `.env.local` (same as for Next.js) or export them in this shell.\n' +
      'Create a token with Editor rights: https://www.sanity.io/manage → project → API → Tokens.'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

/** @type {Record<string, [string, string][]>} */
const LEGACY_OBJECT_PAIRS = {
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

const LANDING_FIELD_ORDER = [
  ['hero', 'heroSection'],
  ['trustedBy', 'trustedBySection'],
  ['painPoints', 'painPointsSection'],
  ['servicesShowcase', 'servicesShowcaseSection'],
  ['results', 'resultsSection'],
  ['process', 'processSection'],
  ['partners', 'partnersSection'],
  ['cta', 'ctaSection'],
]

const CONTACT_LEGACY_KEYS = [
  'hero',
  'contactCards',
  'bookingSection',
  'messageSection',
  'benefits',
  'mapSection',
  'faq',
]

const PACKAGE_LEGACY_KEYS = [
  'packageInfo',
  'heroButtons',
  'bestFor',
  'idealFor',
  'highlights',
  'moreDeliverablesCount',
  'included',
  'includedCategories',
  'processSteps',
  'faq',
  'reviews',
  'tabLabels',
  'addOns',
  'caseStudiesBanner',
]

function randomKey() {
  return `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

function isNonEmptyObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length > 0
}

function blockFromObject(data, blockType) {
  if (!isNonEmptyObject(data)) return null
  const { _type: _ignore, _key: __ignore, ...rest } = data
  return {
    _key: randomKey(),
    _type: blockType,
    ...rest,
  }
}

function buildFromPairs(doc, pairs) {
  const sections = []
  for (const [field, blockType] of pairs) {
    const b = blockFromObject(doc[field], blockType)
    if (b) sections.push(b)
  }
  return sections
}

function buildLanding(doc) {
  const sections = []
  for (const [field, blockType] of LANDING_FIELD_ORDER) {
    const b = blockFromObject(doc[field], blockType)
    if (b) sections.push(b)
  }
  return sections
}

function buildContact(doc) {
  const sections = []
  const hero = blockFromObject(doc.hero, 'contactPageHeroSection')
  if (hero) sections.push(hero)
  const cards = blockFromObject(doc.contactCards, 'contactPageCardsSection')
  if (cards) sections.push(cards)

  const hasBooking = isNonEmptyObject(doc.bookingSection)
  const hasMessage = isNonEmptyObject(doc.messageSection)
  const hasBenefits = Array.isArray(doc.benefits) && doc.benefits.length > 0
  if (hasBooking || hasMessage || hasBenefits) {
    sections.push({
      _key: randomKey(),
      _type: 'contactPageBookingGroupSection',
      bookingSection: hasBooking ? doc.bookingSection : {},
      messageSection: hasMessage ? doc.messageSection : {},
      benefits: hasBenefits ? doc.benefits : [],
    })
  }

  const mapB = blockFromObject(doc.mapSection, 'contactPageMapSection')
  if (mapB) sections.push(mapB)
  const faqB = blockFromObject(doc.faq, 'contactPageFaqSection')
  if (faqB) sections.push(faqB)
  return sections
}

function buildPackageDetail(doc) {
  const sections = []
  const p1 = blockFromObject(doc.packageInfo, 'packageDetailPagePackageInfoSection')
  if (p1) sections.push(p1)
  const p2 = blockFromObject(doc.heroButtons, 'packageDetailPageHeroButtonsSection')
  if (p2) sections.push(p2)
  if (Array.isArray(doc.bestFor) && doc.bestFor.length > 0) {
    sections.push({
      _key: randomKey(),
      _type: 'packageDetailPageBestForSection',
      bestFor: doc.bestFor,
    })
  }
  if (Array.isArray(doc.idealFor) && doc.idealFor.length > 0) {
    sections.push({
      _key: randomKey(),
      _type: 'packageDetailPageIdealForSection',
      idealFor: doc.idealFor,
    })
  }
  if (Array.isArray(doc.highlights) && doc.highlights.length > 0) {
    sections.push({
      _key: randomKey(),
      _type: 'packageDetailPageHighlightsSection',
      highlights: doc.highlights,
    })
  }
  if (typeof doc.moreDeliverablesCount === 'number') {
    sections.push({
      _key: randomKey(),
      _type: 'packageDetailPageMoreDeliverablesSection',
      moreDeliverablesCount: doc.moreDeliverablesCount,
    })
  }
  if (Array.isArray(doc.included) && doc.included.length > 0) {
    sections.push({
      _key: randomKey(),
      _type: 'packageDetailPageIncludedListSection',
      included: doc.included,
    })
  }
  if (Array.isArray(doc.includedCategories) && doc.includedCategories.length > 0) {
    sections.push({
      _key: randomKey(),
      _type: 'packageDetailPageIncludedCategoriesSection',
      includedCategories: doc.includedCategories,
    })
  }
  if (Array.isArray(doc.processSteps) && doc.processSteps.length > 0) {
    sections.push({
      _key: randomKey(),
      _type: 'packageDetailPageProcessStepsSection',
      processSteps: doc.processSteps,
    })
  }
  if (Array.isArray(doc.faq) && doc.faq.length > 0) {
    sections.push({
      _key: randomKey(),
      _type: 'packageDetailPageFaqListSection',
      faq: doc.faq,
    })
  }
  if (Array.isArray(doc.reviews) && doc.reviews.length > 0) {
    sections.push({
      _key: randomKey(),
      _type: 'packageDetailPageReviewsListSection',
      reviews: doc.reviews,
    })
  }
  const tab = blockFromObject(doc.tabLabels, 'packageDetailPageTabLabelsSection')
  if (tab) sections.push(tab)
  const addOns = blockFromObject(doc.addOns, 'packageDetailPageAddOnsSection')
  if (addOns) sections.push(addOns)
  const banner = blockFromObject(doc.caseStudiesBanner, 'packageDetailPageCaseStudiesBannerSection')
  if (banner) sections.push(banner)
  return sections
}

async function migrateDocType(documentType, buildSections, legacyKeys) {
  const docs = await client.fetch(`*[_type == $t]{ ... }`, { t: documentType })
  for (const doc of docs) {
    const id = doc._id
    if (Array.isArray(doc.sections) && doc.sections.length > 0) {
      console.log(`[skip] ${documentType} ${id} — already has ${doc.sections.length} section(s)`)
      continue
    }
    const sections = buildSections(doc)
    if (sections.length === 0) {
      console.log(`[skip] ${documentType} ${id} — no legacy content`)
      continue
    }
    console.log(
      `[plan] ${documentType} ${id} — ${sections.length} blocks (${sections.map((s) => s._type).join(', ')})`
    )
    if (dryRun) continue
    let patch = client.patch(id).set({ sections })
    if (unsetLegacy && legacyKeys?.length) {
      patch = patch.unset(legacyKeys)
    }
    await patch.commit({ visibility: 'async' })
    console.log(`[ok] ${documentType} ${id}`)
  }
}

async function main() {
  for (const documentType of Object.keys(LEGACY_OBJECT_PAIRS)) {
    const pairs = LEGACY_OBJECT_PAIRS[documentType]
    const legacyKeys = pairs.map(([k]) => k)
    await migrateDocType(documentType, (doc) => buildFromPairs(doc, pairs), legacyKeys)
  }

  await migrateDocType(
    'contactPage',
    buildContact,
    unsetLegacy ? CONTACT_LEGACY_KEYS : undefined
  )

  await migrateDocType(
    'packageDetailPage',
    buildPackageDetail,
    unsetLegacy ? PACKAGE_LEGACY_KEYS : undefined
  )

  const landingLegacyKeys = LANDING_FIELD_ORDER.map(([k]) => k)
  await migrateDocType(
    'landingPage',
    buildLanding,
    unsetLegacy ? landingLegacyKeys : undefined
  )

  if (dryRun) {
    console.log('\nDry run only; no writes.')
  } else if (!unsetLegacy) {
    console.log('\nLegacy root fields remain. Re-run with --unset after verifying in Studio.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
