import { groq } from "next-sanity";
import { defaultLanguage } from "./languages";

// ============================================
// Image Fragment
// ============================================

const imageFragment = groq`
  asset->{
    _id,
    url,
    metadata {
      dimensions,
      lqip
    }
  },
  alt
`;

// ============================================
// Helper: Language filter
// ============================================
// Use this in queries: language == $language || language == null
// This allows fetching documents with a specific language or without language set (legacy)

// ============================================
// Landing Page Query
// ============================================

export const landingPageQuery = groq`
  *[_type == "landingPage" && slug.current == $slug && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    isHomepage,
    hero {
      heroBadge,
      heroTitle {
        text,
        highlight
      },
      heroDescription,
      heroButtons[] {
        text,
        link,
        variant
      },
      heroTagline,
      heroPackages[] {
        title,
        price
      }
    },
    trustedBy {
      title,
      brands[] {
        name,
        logo { ${imageFragment} },
        alt,
        link
      }
    },
    painPoints {
      painPointsTitle {
        text,
        highlight
      },
      painPointsItems[] {
        text
      },
      painPointsBottomText,
      painPointsCta {
        text,
        url
      }
    },
    servicesShowcase {
      title {
        text,
        highlight
      },
      subtitle,
      categories[] {
        title,
        icon,
        description,
        price,
        link,
        linkText
      },
      packages[] {
        title,
        subtitle,
        price,
        priceType,
        timeline,
        rating,
        ratingValue,
        bestFor,
        buttonText,
        buttonLink
      }
    },
    results {
      title,
      subtitle,
      items[] {
        clientImage { ${imageFragment} },
        clientName,
        stat,
        metricName,
        description,
        ctaText,
        ctaLink
      },
      theme
    },
    process {
      processTitle,
      processSubtitle,
      processSteps[] {
        number,
        title,
        description
      }
    },
    partners {
      partnersBadges[] {
        text,
        link
      },
      partnersDescription
    },
    cta {
      title,
      subtitle,
      buttons[] {
        text,
        link,
        variant
      },
      backgroundColor
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage { ${imageFragment} }
    }
  }
`;

export const homepageQuery = groq`
  *[_type == "landingPage" && isHomepage == true && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroBadge,
      heroTitle {
        text,
        highlight
      },
      heroDescription,
      heroButtons[] {
        text,
        link,
        variant
      },
      heroTagline,
      heroPackages[] {
        title,
        price
      }
    },
    trustedBy {
      title,
      brands[] {
        name,
        logo { ${imageFragment} },
        alt,
        link
      }
    },
    painPoints {
      painPointsTitle {
        text,
        highlight
      },
      painPointsItems[] {
        text
      },
      painPointsBottomText,
      painPointsCta {
        text,
        url
      }
    },
    servicesShowcase {
      title {
        text,
        highlight
      },
      subtitle,
      categories[] {
        title,
        icon,
        description,
        price,
        link,
        linkText
      },
      packages[] {
        title,
        subtitle,
        price,
        priceType,
        timeline,
        rating,
        ratingValue,
        bestFor,
        buttonText,
        buttonLink
      }
    },
    results {
      title,
      subtitle,
      items[] {
        clientImage { ${imageFragment} },
        clientName,
        stat,
        metricName,
        description,
        ctaText,
        ctaLink
      },
      theme
    },
    process {
      processTitle,
      processSubtitle,
      processSteps[] {
        number,
        title,
        description
      }
    },
    partners {
      partnersBadges[] {
        text,
        link
      },
      partnersDescription
    },
    cta {
      title,
      subtitle,
      buttons[] {
        text,
        link,
        variant
      },
      backgroundColor
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage { ${imageFragment} }
    }
  }
`;

export const allLandingPagesQuery = groq`
  *[_type == "landingPage" && (language == $language || !defined(language))] | order(pageTitle asc) {
    _id,
    pageTitle,
    "slug": slug.current,
    isHomepage
  }
`;

// ============================================
// Services Page Query
// ============================================

export const servicesPageQuery = groq`
  *[_type == "servicesPage" && slug.current == $slug && (language == $language || !defined(language))][0] {
    _id,
    title,
    "slug": slug.current,
    hero,
    introduction,
    services,
    sections,
    seo
  }
`;

// ============================================
// Shopify Development Page Query
// ============================================

export const shopifyDevelopmentPageQuery = groq`
  *[_type == "shopifyDevelopmentPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription,
      heroButtons[] {
        text,
        link,
        variant
      }
    },
    whyShopify {
      whyShopifyTitle,
      whyShopifySubtitle,
      whyShopifyFeatures[] {
        title,
        description,
        icon
      }
    },
    scenarios {
      scenariosTitle,
      scenariosItems[] {
        title,
        description,
        link
      }
    },
    howWeWork {
      howWeWorkTitle,
      howWeWorkSteps[] {
        number,
        title,
        description
      }
    },
    testimonial {
      testimonialRating,
      testimonialQuote,
      testimonialAuthorName,
      testimonialAuthorTitle,
      testimonialButtonText,
      testimonialButtonLink
    },
    cta {
      ctaTitle,
      ctaDescription,
      ctaButtonText,
      ctaButtonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ============================================
// Migrate Page Query
// ============================================

export const migratePageQuery = groq`
  *[_type == "migratePage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription,
      heroButtons[] {
        text,
        link,
        variant
      }
    },
    platforms {
      platformsTitle,
      platformsItems[] {
        name,
        duration
      }
    },
    risksProtection {
      risksTitle,
      risksItems[] {
        text
      },
      protectionTitle,
      protectionItems[] {
        title,
        description
      }
    },
    process {
      processTitle,
      processSubtitle,
      processPhases[] {
        week,
        title,
        activities
      }
    },
    results {
      resultsTitle,
      resultsItems[] {
        metric,
        title,
        description
      }
    },
    cta {
      ctaTitle,
      ctaDescription,
      ctaButtonText,
      ctaButtonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ============================================
// Shopify POS Page Query
// ============================================

export const shopifyPosPageQuery = groq`
  *[_type == "shopifyPosPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription,
      heroButtonText,
      heroButtonLink
    },
    features {
      featuresTitle,
      featuresItems[] {
        title,
        description,
        icon
      }
    },
    perfectFor {
      perfectForTitle,
      perfectForItems[] {
        title,
        description
      }
    },
    cta {
      ctaTitle,
      ctaDescription,
      ctaButtonText,
      ctaButtonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ============================================
// All Packages Page Query
// ============================================

export const allPackagesPageQuery = groq`
  *[_type == "allPackagesPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription
    },
    packages {
      packagesItems[] {
        title,
        subtitle,
        price,
        priceType,
        timeline,
        rating,
        ratingValue,
        bestFor,
        included,
        description,
        href
      }
    },
    faq {
      faqTitle,
      faqItems[] {
        question,
        answer
      }
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ============================================
// Shopify Platform Page Query
// ============================================

export const shopifyPlatformPageQuery = groq`
  *[_type == "shopifyPlatformPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription
    },
    bleedingMoney {
      title,
      leftPoints,
      rightPoints,
      bottomPoint
    },
    shopifyEmpires {
      title,
      features[] {
        title,
        description,
        highlight
      }
    },
    revenueForm {
      title,
      subtitle,
      testimonial {
        quote,
        authorName,
        authorRole,
        authorCompany,
        "authorImageUrl": authorImage.asset->url
      },
      form {
        formTitle,
        formSubtitle,
        formDescription,
        submitButtonText
      }
    },
    successStories {
      title,
      subtitle,
      caseStudies[] {
        clientName,
        heading,
        description,
        "imageUrl": image.asset->url
      }
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ============================================
// Shopify POS Info Page Query
// ============================================

export const shopifyPosInfoPageQuery = groq`
  *[_type == "shopifyPosInfoPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription,
      stats[] {
        value,
        label
      }
    },
    bleedingMoney {
      title,
      leftPoints,
      rightPoints
    },
    omnichannelFeatures {
      title,
      features[] {
        title,
        description,
        highlight
      }
    },
    revenueForm {
      title,
      subtitle,
      testimonial {
        quote,
        authorName,
        authorRole,
        authorCompany,
        "authorImageUrl": authorImage.asset->url
      },
      form {
        formTitle,
        formSubtitle,
        formDescription,
        submitButtonText
      }
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ============================================
// Shopify TCO Calculator Page Query
// ============================================

export const shopifyTcoCalculatorPageQuery = groq`
  *[_type == "shopifyTcoCalculatorPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription,
      platforms
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ============================================
// Shopify x PIM Page Query
// ============================================
export const shopifyXPimPageQuery = groq`
  *[_type == "shopifyXPimPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription
    },
    whatIsPim {
      title,
      paragraph1,
      paragraph2,
      quote {
        text,
        author
      }
    },
    integratingPim {
      title,
      description,
      leftColumnTitle,
      leftColumnDescription,
      integrationPoints,
      impactTitle,
      impactParagraph1,
      impactParagraph2,
      linkText
    },
    whichBusinesses {
      title,
      description,
      businessCards[] {
        title,
        description
      },
      bottomNote
    },
    timeSavings {
      title,
      description,
      savingsCards[] {
        title,
        description,
        hours
      },
      summaryTitle,
      summaryDescription
    },
    whyGoodInvestment {
      title,
      description,
      benefits[] {
        title,
        description
      },
      bottomNote
    },
    combinedSection {
      choosingPim {
        title,
        description,
        leftColumnTitle,
        leftColumnDescription,
        selectionCriteria,
        impactParagraph1,
        impactParagraph2,
        linkText
      },
      gettingStarted {
        title,
        description,
        steps[] {
          title,
          description
        },
        bottomNote
      },
      faq {
        title,
        items[] {
          question,
          answer
        }
      },
      transformExperience {
        title,
        paragraph1,
        paragraph2,
        quoteText
      }
    },
    cta {
      title,
      description,
      buttonText,
      buttonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ============================================
// Shopify x AI Page Query
// ============================================
export const shopifyXAiPageQuery = groq`
  *[_type == "shopifyXAiPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription
    },
    enhancingWithAi {
      title,
      paragraph1,
      paragraph2,
      quote {
        text,
        author
      }
    },
    howWeLeverageAi {
      title,
      capabilities[] {
        title,
        description,
        bgColor,
        features,
        impactTitle,
        impactParagraph1,
        impactParagraph2,
        linkText
      }
    },
    aiToolsToolkit {
      title,
      toolCategories[] {
        title,
        description
      },
      bottomText
    },
    howWeApplyAi {
      title,
      applicationAreas[] {
        title,
        description,
        features,
        benefit
      }
    },
    aiEnhancedProcess {
      title,
      processSteps[] {
        title,
        description
      }
    },
    faq {
      title,
      items[] {
        question,
        answer
      }
    },
    cta {
      title,
      description,
      buttonText,
      buttonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ============================================
// Why Shopify Page Query
// ============================================
export const whyShopifyPageQuery = groq`
  *[_type == "whyShopifyPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription
    },
    whatIsShopify {
      title,
      paragraph1,
      paragraph2
    },
    shopifyFacts {
      title,
      facts[] {
        statistic,
        description,
        source
      }
    },
    whyBusinessesChoose {
      title,
      reasons[] {
        title,
        description,
        bulletPoints,
        concludingParagraph
      }
    },
    whyScandicommerceSpecializes {
      title,
      description,
      specializations[] {
        title,
        description
      }
    },
    shopifyAi {
      title,
      description,
      aiSolutions[] {
        title,
        description
      }
    },
    cta {
      title,
      description,
      buttonText,
      buttonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// Work Page Query
export const workPageQuery = groq`
  *[_type == "workPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription
    },
    caseStudies {
      studies[] {
        title,
        category,
        tags,
        challenge,
        solution,
        results[] {
          value,
          label
        },
        "imageUrl": image.asset->url,
        imageAlt,
        link
      }
    },
    cta {
      title,
      description,
      buttonText,
      buttonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// About Page Query
export const aboutPageQuery = groq`
  *[_type == "aboutPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription,
      stats[] {
        value,
        label
      }
    },
    whyDifferent {
      title,
      subtitle,
      features[] {
        icon,
        title,
        description
      }
    },
    ourStory {
      title,
      description,
      "image": image {
        "asset": asset->,
        crop,
        hotspot
      },
      imageAlt
    },
    ourValues {
      title,
      values[] {
        title,
        description
      }
    },
    meetTheTeam {
      title,
      subtitle,
      teamMembers[] {
        name,
        role,
        specialties,
        funFact,
        "image": image {
          "asset": asset->,
          crop,
          hotspot
        }
      },
      buttonText,
      buttonLink
    },
    trustedPartnerships {
      title,
      subtitle,
      partnerships[] {
        name,
        status,
        logoIcon
      }
    },
    cta {
      title,
      description,
      buttonText,
      buttonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// Partner Categories (dynamic filter list for partners page)
export const partnerCategoriesQuery = groq`
  *[_type == "partnerCategory"] {
    _id,
    title,
    icon
  }
`;

// Partners Page Query
export const partnersPageQuery = groq`
  *[_type == "partnersPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription
    },
    whyOurPartnership {
      title,
      features[] {
        icon,
        title,
        description
      }
    },
    partnersGrid {
      partners[] {
        name,
        category,
        "categories": categories[]->{ _id, title, icon },
        description,
        benefits,
        "image": image {
          "asset": asset->,
          crop,
          hotspot
        },
        "logo": logo {
          "asset": asset->,
          crop,
          hotspot
        }
      }
    },
    cta {
      title,
      description,
      buttonText,
      buttonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// Contact Page Query
export const contactPageQuery = groq`
  *[_type == "contactPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription
    },
    contactCards {
      cards[] {
        icon,
        title,
        subtitle,
        detail,
        href
      }
    },
    bookingSection {
      enabled,
      label,
      title,
      description,
      meetingTypes[] {
        title,
        description,
        durationMinutes
      },
      availableSlots[] {
        date,
        times
      },
      confirmButtonText
    },
    messageSection {
      label,
      title,
      description,
      submitButtonText
    },
    benefits[] {
      icon,
      text
    },
    mapSection {
      title,
      description
    },
    faq {
      title,
      subtitle,
      faqs[] {
        question,
        answer
      }
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// Package Detail Page Query
export const packageDetailPageQuery = groq`
  *[_type == "packageDetailPage" && slug.current == $slug && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    packageInfo {
      title,
      subtitle,
      price,
      priceType,
      timeline,
      rating,
      ratingValue,
      reviewCount,
      description
    },
    heroButtons {
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink
    },
    bestFor,
    idealFor,
    highlights,
    moreDeliverablesCount,
    included,
    includedCategories[] {
      category,
      items
    },
    processSteps[] {
      week,
      title,
      description
    },
    faq[] {
      question,
      answer
    },
    reviews[] {
      name,
      rating,
      comment,
      title
    },
    addOns {
      sectionTitle,
      sectionSubtitle,
      items[] {
        title,
        description,
        price
      }
    },
    caseStudiesBanner {
      title,
      description,
      buttonText,
      buttonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// Blog Page Query
export const blogPageQuery = groq`
  *[_type == "blogPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        highlight,
        text
      },
      heroDescription,
      searchPlaceholder
    },
    featuredArticle {
      "imageUrl": image.asset->url,
      tags[] {
        label,
        isPrimary
      },
      title,
      description,
      date,
      readTime,
      link,
      buttonText
    },
    articlesGrid {
      articles[] {
        title,
        description,
        category,
        date,
        readTime,
        "imageUrl": image.asset->url,
        slug
      },
      loadMoreButtonText
    },
    newsletterCta {
      title,
      description,
      emailPlaceholder,
      buttonText
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// Merch Page Query
export const merchPageQuery = groq`
  *[_type == "merchPage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription
    },
    qualityShowcase {
      title,
      description,
      products[] {
        handle,
        name
      }
    },
    newsletter {
      title,
      description,
      emailPlaceholder,
      buttonText,
      successMessage
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// Merch Product Settings Query
export const merchProductSettingsQuery = groq`
  *[_type == "merchProductSettings" && (language == $language || !defined(language))][0] {
    _id,
    settingsTitle,
    productFeatures {
      features[] {
        title,
        description
      }
    },
    productDetails {
      title,
      description,
      bulletPoints,
      "imageUrl": image.asset->url
    },
    sizeGuide {
      title,
      description,
      contactButtonText,
      sizes[] {
        size,
        chest,
        length,
        sleeve
      }
    },
    relatedProducts {
      title,
      products[] {
        handle,
        name
      }
    }
  }
`;

// Header Settings Query
export const headerSettingsQuery = groq`
  *[_type == "headerSettings" && (language == $language || !defined(language))][0] {
    _id,
    settingsTitle,
    servicesMenu {
      label,
      items[] {
        label,
        href
      }
    },
    shopifyMenu {
      label,
      items[] {
        label,
        href
      }
    },
    mainNavLinks[] {
      label,
      href
    },
    ctaButton {
      label,
      href
    }
  }
`;

// Footer Settings Query
export const footerSettingsQuery = groq`
  *[_type == "footerSettings" && (language == $language || !defined(language))][0] {
    _id,
    settingsTitle,
    columns[] {
      title,
      links[] {
        label,
        href
      }
    },
    connectSection {
      title,
      email,
      phone,
      socialLinks[] {
        platform,
        url
      }
    },
    bottomSection {
      badgeText,
      orgNumber,
      legalLinks[] {
        label,
        href
      },
      copyrightText
    }
  }
`;

// ============================================
// Vipps Hurtigkasse Page Query
// ============================================
export const vippsHurtigkassePageQuery = groq`
  *[_type == "vippsHurtigkassePage" && (language == $language || !defined(language))][0] {
    _id,
    pageTitle,
    "slug": slug.current,
    hero {
      heroTitle {
        text,
        highlight
      },
      heroDescription,
      heroButtons[] {
        text,
        link,
        variant
      }
    },
    features {
      title,
      paragraphs,
      demoStore {
        text,
        url,
        password
      },
      productImage {
        "src": image.asset->url,
        alt
      }
    },
    howToGetStarted {
      title,
      steps[] {
        title,
        description,
        subSteps
      }
    },
    pricing {
      sectionTitle,
      // price,
      priceItems[] { priceText },
      priceNote,
      supportText
    },
    orderForm {
      title,
      description
    },
    support {
      title,
      buttonText,
      buttonLink
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;
