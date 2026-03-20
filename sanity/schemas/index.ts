// ============================================
// Object Types (reusable schema objects)
// ============================================
import {
  link,
  button,
  seo,
  blockContent,
  richTextBlock,
  keyTakeawaysBlock,
  statsRowBlock,
  tableBlock,
  comparisonCardsBlock,
  calloutBlock,
  prosConsBlock,
  codeBlock,
  faqBlock,
  ctaBlock,
  gradientTitleBlock,
  imageBlock,
  dividerBlock,
} from "./objects";

// ============================================
// Document Types (e.g. post page builder)
// ============================================
import { post } from "./documents";

// ============================================
// Page Types (document types for pages)
// ============================================
import { calendlyBooking } from "./calendlyBooking";
import {
  landingPage,
  servicesPage,
  aboutPage,
  contactPage,
  workPage,
  blogPage,
  blogPost,
  shopifyDevelopmentPage,
  migratePage,
  shopifyPosPage,
  allPackagesPage,
  shopifyPlatformPage,
  shopifyPosInfoPage,
  shopifyTcoCalculatorPage,
  shopifyXPimPage,
  shopifyXAiPage,
  whyShopifyPage,
  partnersPage,
  partnerCategory,
  packageDetailPage,
  merchPage,
  merchProductSettings,
  headerSettings,
  footerSettings,
  vippsHurtigkassePage,
} from "./pages";

// ============================================
// Export All Schema Types
// ============================================
export const schemaTypes = [
  // Object types
  link,
  button,
  seo,
  blockContent,
  // Blog page builder blocks
  richTextBlock,
  keyTakeawaysBlock,
  statsRowBlock,
  tableBlock,
  comparisonCardsBlock,
  calloutBlock,
  prosConsBlock,
  codeBlock,
  faqBlock,
  ctaBlock,
  gradientTitleBlock,
  imageBlock,
  dividerBlock,

  // Document types
  post,

  // Page types
  landingPage,
  servicesPage,
  aboutPage,
  contactPage,
  workPage,
  blogPage,
  blogPost,
  shopifyDevelopmentPage,
  migratePage,
  shopifyPosPage,
  allPackagesPage,
  shopifyPlatformPage,
  shopifyPosInfoPage,
  shopifyTcoCalculatorPage,
  shopifyXPimPage,
  shopifyXAiPage,
  whyShopifyPage,
  partnersPage,
  partnerCategory,
  packageDetailPage,
  merchPage,
  merchProductSettings,
  headerSettings,
  footerSettings,
  vippsHurtigkassePage,
  calendlyBooking,
];
