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
  *[_type == "landingPage" && slug.current == $slug && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    isHomepage,
    sections[] {
      _type,
      _key,
      _type == "heroSection" => {
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
        "heroImageUrl": heroImage.asset->url,
        "heroVideoFileUrl": heroVideoFile.asset->url,
        "heroVideoFileMobileUrl": heroVideoFileMobile.asset->url,
        heroVideo,
        heroPackages[] {
          title,
          price
        }
      },
      _type == "trustedBySection" => {
        title,
        brands[] {
          name,
          logo { ${imageFragment} },
          alt,
          link
        }
      },
      _type == "painPointsSection" => {
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
      _type == "servicesShowcaseSection" => {
        title {
          text,
          highlight
        },
        subtitle,
        viewAllText,
        viewAllLink,
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
      _type == "resultsSection" => {
        title,
        subtitle,
        items[] {
          clientImage { ${imageFragment} },
          clientName,
          category,
          stat,
          metricName,
          description,
          ctaText,
          ctaLink
        },
        theme
      },
      _type == "homepageTestimonialSection" => {
        testimonialRating,
        testimonialQuote,
        testimonialAuthorName,
        testimonialAuthorTitle,
        testimonialButtonText,
        testimonialButtonLink
      },
      _type == "processSection" => {
        processTitle,
        processSubtitle,
        processSteps[] {
          number,
          title,
          description
        }
      },
      _type == "partnersSection" => {
        partnersBadges[] {
          text,
          link
        },
        partnersDescription
      },
      _type == "ctaSection" => {
        title,
        subtitle,
        buttons[] {
          text,
          link,
          variant
        },
        backgroundColor
      },
      _type == "technicalDepthSection" => {
        headline,
        body
      },
      _type == "blogTeaserSection" => {
        eyebrow,
        title,
        linkText,
        linkHref,
        count
      }
    }
  }
`;

export const homepageQuery = groq`
  *[_type == "landingPage" && isHomepage == true && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "heroSection" => {
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
        "heroImageUrl": heroImage.asset->url,
        "heroVideoFileUrl": heroVideoFile.asset->url,
        "heroVideoFileMobileUrl": heroVideoFileMobile.asset->url,
        heroVideo,
        heroPackages[] {
          title,
          price
        }
      },
      _type == "trustedBySection" => {
        title,
        brands[] {
          name,
          logo { ${imageFragment} },
          alt,
          link
        }
      },
      _type == "painPointsSection" => {
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
      _type == "servicesShowcaseSection" => {
        title {
          text,
          highlight
        },
        subtitle,
        viewAllText,
        viewAllLink,
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
      _type == "resultsSection" => {
        title,
        subtitle,
        items[] {
          clientImage { ${imageFragment} },
          clientName,
          category,
          stat,
          metricName,
          description,
          ctaText,
          ctaLink
        },
        theme
      },
      _type == "homepageTestimonialSection" => {
        testimonialRating,
        testimonialQuote,
        testimonialAuthorName,
        testimonialAuthorTitle,
        testimonialButtonText,
        testimonialButtonLink
      },
      _type == "processSection" => {
        processTitle,
        processSubtitle,
        processSteps[] {
          number,
          title,
          description
        }
      },
      _type == "partnersSection" => {
        partnersBadges[] {
          text,
          link
        },
        partnersDescription
      },
      _type == "ctaSection" => {
        title,
        subtitle,
        buttons[] {
          text,
          link,
          variant
        },
        backgroundColor
      },
      _type == "technicalDepthSection" => {
        headline,
        body
      },
      _type == "blogTeaserSection" => {
        eyebrow,
        title,
        linkText,
        linkHref,
        count
      }
    }
  }
`;

// ============================================
// Shopify Development Page Query
// ============================================

export const shopifyDevelopmentPageQuery = groq`
  *[_type == "shopifyDevelopmentPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "shopifyDevelopmentPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription,
        heroButtons[] { text, link, variant }
      },
      _type == "shopifyDevelopmentPageWhyShopifySection" => {
        whyShopifyTitle,
        whyShopifySubtitle,
        whyShopifyFeatures[] { title, description, icon }
      },
      _type == "shopifyDevelopmentPageScenariosSection" => {
        scenariosTitle,
        scenariosLinkText,
        scenariosItems[] { title, description, link }
      },
      _type == "shopifyDevelopmentPageHowWeWorkSection" => {
        howWeWorkTitle,
        howWeWorkSteps[] { number, title, description }
      },
      _type == "shopifyDevelopmentPageTestimonialSection" => {
        testimonialRating,
        testimonialQuote,
        testimonialAuthorName,
        testimonialAuthorTitle,
        testimonialButtonText,
        testimonialButtonLink
      },
      _type == "shopifyDevelopmentPageCtaSection" => {
        ctaTitle,
        ctaDescription,
        ctaButtonText,
        ctaButtonLink
      }
    }
  }
`;

// ============================================
// Migrate Page Query
// ============================================

export const migratePageQuery = groq`
  *[_type == "migratePage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "migratePageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription,
        heroButtons[] { text, link, variant }
      },
      _type == "migratePagePlatformsSection" => {
        platformsTitle,
        platformsItems[] { name, duration }
      },
      _type == "migratePageRisksProtectionSection" => {
        risksTitle,
        risksItems[] { text },
        protectionTitle,
        protectionItems[] { title, description }
      },
      _type == "migratePageProcessSection" => {
        processTitle,
        processSubtitle,
        processPhases[] { week, title, activities }
      },
      _type == "migratePageResultsSection" => {
        resultsTitle,
        resultsItems[] { metric, title, description }
      },
      _type == "migratePageCtaSection" => {
        ctaTitle,
        ctaDescription,
        ctaButtonText,
        ctaButtonLink
      }
    }
  }
`;

// ============================================
// Shopify POS Page Query
// ============================================

export const shopifyPosPageQuery = groq`
  *[_type == "shopifyPosPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "shopifyPosPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription,
        heroButtonText,
        heroButtonLink
      },
      _type == "shopifyPosPageFeaturesSection" => {
        featuresTitle,
        featuresItems[] { title, description, icon }
      },
      _type == "shopifyPosPagePerfectForSection" => {
        perfectForTitle,
        perfectForItems[] { title, description }
      },
      _type == "shopifyPosPageCtaSection" => {
        ctaTitle,
        ctaDescription,
        ctaButtonText,
        ctaButtonLink
      }
    }
  }
`;

// ============================================
// All Packages Page Query
// ============================================

export const allPackagesPageQuery = groq`
  *[_type == "allPackagesPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "allPackagesPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription
      },
      _type == "allPackagesPagePackagesSection" => {
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
          "slug": page->slug.current,
          href,
          "bookCallSlug": bookCallPage->slug.current,
          bookCallHref
        }
      },
      _type == "allPackagesPageFaqSection" => {
        faqTitle,
        faqItems[] { question, answer }
      }
    }
  }
`;

// ============================================
// Shopify Platform Page Query
// ============================================

export const shopifyPlatformPageQuery = groq`
  *[_type == "shopifyPlatformPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "shopifyPlatformPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription
      },
      _type == "shopifyPlatformPageBleedingMoneySection" => {
        title,
        leftPoints,
        rightPoints,
        bottomPoint
      },
      _type == "shopifyPlatformPageShopifyEmpiresSection" => {
        title,
        features[] { title, description, highlight }
      },
      _type == "shopifyPlatformPageRevenueFormSection" => {
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
      _type == "shopifyPlatformPageSuccessStoriesSection" => {
        title,
        subtitle,
        caseStudies[] {
          clientName,
          heading,
          description,
          "imageUrl": image.asset->url
        }
      }
    }
  }
`;

// ============================================
// Shopify POS Info Page Query
// ============================================

export const shopifyPosInfoPageQuery = groq`
  *[_type == "shopifyPosInfoPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "shopifyPosInfoPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription,
        stats[] { value, label }
      },
      _type == "shopifyPosInfoPageBleedingMoneySection" => {
        title,
        leftPoints,
        rightPoints
      },
      _type == "shopifyPosInfoPageOmnichannelFeaturesSection" => {
        title,
        features[] { title, description, highlight }
      },
      _type == "shopifyPosInfoPageRevenueFormSection" => {
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
      }
    }
  }
`;

// ============================================
// Shopify TCO Calculator Page Query
// ============================================

export const shopifyTcoCalculatorPageQuery = groq`
  *[_type == "shopifyTcoCalculatorPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "shopifyTcoCalculatorPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription,
        platforms
      },
      _type == "shopifyTcoCalculatorPageCalculatorSection" => {
        formTitle,
        hubspotPortalId,
        hubspotFormId
      }
    }
  }
`;

// ============================================
// Shopify x PIM Page Query
// ============================================
export const shopifyXPimPageQuery = groq`
  *[_type == "shopifyXPimPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "shopifyXPimPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription
      },
      _type == "shopifyXPimPageWhatIsPimSection" => {
        title,
        paragraph1,
        paragraph2,
        quote { text, author }
      },
      _type == "shopifyXPimPageIntegratingPimSection" => {
        title,
        description,
        leftColumnTitle,
        leftColumnDescription,
        integrationPoints,
        impactTitle,
        impactParagraph1,
        impactParagraph2,
        linkText,
        "linkSlug": linkPage->slug.current,
        linkHref
      },
      _type == "shopifyXPimPageWhichBusinessesSection" => {
        title,
        description,
        businessCards[] { title, description },
        bottomNote
      },
      _type == "shopifyXPimPageTimeSavingsSection" => {
        title,
        description,
        savingsCards[] { title, description, hours },
        summaryTitle,
        summaryDescription
      },
      _type == "shopifyXPimPageWhyGoodInvestmentSection" => {
        title,
        description,
        benefits[] { title, description },
        bottomNote
      },
      _type == "shopifyXPimCombinedSection" => {
        choosingPim {
          title,
          description,
          leftColumnTitle,
          leftColumnDescription,
          selectionCriteria,
          impactParagraph1,
          impactParagraph2,
          linkText,
          "linkSlug": linkPage->slug.current,
          linkHref
        },
        gettingStarted {
          title,
          description,
          steps[] { title, description },
          bottomNote
        },
        faq {
          title,
          items[] { question, answer }
        },
        transformExperience {
          title,
          paragraph1,
          paragraph2,
          quoteText
        }
      },
      _type == "shopifyXPimPageCtaSection" => {
        title,
        description,
        buttonText,
        "buttonSlug": buttonPage->slug.current,
        buttonLink
      }
    }
  }
`;

// ============================================
// Shopify x AI Page Query
// ============================================
export const shopifyXAiPageQuery = groq`
  *[_type == "shopifyXAiPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "shopifyXAiPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription
      },
      _type == "shopifyXAiPageEnhancingWithAiSection" => {
        title,
        paragraph1,
        paragraph2,
        quote { text, author }
      },
      _type == "shopifyXAiPageHowWeLeverageAiSection" => {
        title,
        capabilities[] {
          title,
          description,
          bgColor,
          features,
          impactTitle,
          impactParagraph1,
          impactParagraph2,
          linkText,
          "linkSlug": linkPage->slug.current,
          linkHref
        }
      },
      _type == "shopifyXAiPageAiToolsToolkitSection" => {
        title,
        toolCategories[] { title, description },
        bottomText
      },
      _type == "shopifyXAiPageHowWeApplyAiSection" => {
        title,
        applicationAreas[] { title, description, features, benefit }
      },
      _type == "shopifyXAiPageAiEnhancedProcessSection" => {
        title,
        processSteps[] { title, description }
      },
      _type == "shopifyXAiPageFaqSection" => {
        title,
        items[] { question, answer }
      },
      _type == "shopifyXAiPageCtaSection" => {
        title,
        description,
        buttonText,
        "buttonSlug": buttonPage->slug.current,
        buttonLink
      }
    }
  }
`;

// ============================================
// Why Shopify Page Query
// ============================================
export const whyShopifyPageQuery = groq`
  *[_type == "whyShopifyPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "whyShopifyPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription
      },
      _type == "whyShopifyPageWhatIsShopifySection" => {
        title,
        paragraph1,
        paragraph2
      },
      _type == "whyShopifyPageShopifyFactsSection" => {
        title,
        facts[] { statistic, description, source }
      },
      _type == "whyShopifyPageWhyBusinessesChooseSection" => {
        title,
        reasons[] { title, description, bulletPoints, concludingParagraph }
      },
      _type == "whyShopifyPageWhyScandicommerceSpecializesSection" => {
        title,
        description,
        specializations[] { title, description }
      },
      _type == "whyShopifyPageShopifyAiSection" => {
        title,
        description,
        aiSolutions[] { title, description }
      },
      _type == "whyShopifyPageCtaSection" => {
        title,
        description,
        buttonText,
        buttonLink
      }
    }
  }
`;

// Work Page Query
export const workPageQuery = groq`
  *[_type == "workPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "workPageHeroSection" => {
        eyebrow,
        heroTitle {
          text,
          highlight
        },
        heroDescription,
        hideJumpLinks
      },
      _type == "workPageCaseStudiesSection" => {
        eyebrow,
        heading,
        intro,
        featuredLabel,
        deckLabel,
        archiveLabel,
        includeDocuments,
        ctaText,
        studies[] {
          title,
          client,
          category,
          tags,
          challenge[] {
            ...,
            _type == "image" => {
              ...,
              asset-> {
                _id,
                url,
                metadata { dimensions, lqip },
                alt
              }
            }
          },
          solution[] {
            ...,
            _type == "image" => {
              ...,
              asset-> {
                _id,
                url,
                metadata { dimensions, lqip },
                alt
              }
            }
          },
          results[] {
            value,
            label
          },
          "imageUrl": image.asset->url,
          imageAlt,
          link
        }
      },
      _type == "workPageCtaSection" => {
        title,
        description,
        buttonText,
        buttonLink,
        secondaryButtonText,
        secondaryButtonLink,
        hideSecondaryButton
      }
    }
  }
`;

// Latest posts for the homepage blog teaser (2026 design). Newest first,
// filtered to the page language.
export const latestPostsTeaserQuery = groq`
  *[_type == "post" && defined(slug.current) && (language == $language || !defined(language))]
    | order(coalesce(publishedAt, _createdAt) desc) [0...6] {
    _id,
    _type,
    language,
    title,
    "slug": slug.current,
    "category": category,
    "tag": coalesce(category, tags[0].label, tags[0]),
    publishedAt,
    _createdAt
  }
`;

// All case-study documents as lightweight cards for the Kundecaser overview
// grid (filterable by industry / tag). Not language-filtered: the case-study
// portfolio is shared across locales, so we surface every case and dedupe by
// slug on the client.
export const caseStudyCardsQuery = groq`
  *[_type == "caseStudy" && defined(slug.current)]
    | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    language,
    title,
    "slug": slug.current,
    excerpt,
    industry,
    tags,
    pakke,
    "heroImageUrl": heroImage.asset->url,
    heroVideo,
    "clientLogoUrl": clientLogo.asset->url
  }
`;

// Blog posts that tell a customer story (tagged "Case study" / "Case-studie").
// Shown on the work page after the curated studies, and lend their image to a
// curated study that links to them. Not language-filtered; the page dedupes.
export const caseStudyPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && count(tags[label match "case*" || label match "kundecase*"]) > 0]
    | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    _type,
    language,
    title,
    "slug": slug.current,
    "excerpt": coalesce(description, excerpt),
    "imageUrl": coalesce(featuredImage.asset->url, image.asset->url),
    publishedAt
  }
`;

// About Page Query
export const aboutPageQuery = groq`
  *[_type == "aboutPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "aboutPageHeroSection" => {
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
      _type == "aboutPageWhyDifferentSection" => {
        title,
        subtitle,
        features[] {
          icon,
          title,
          description
        }
      },
      _type == "aboutPageOurStorySection" => {
        title,
        description,
        "image": image {
          "asset": asset->,
          crop,
          hotspot
        },
        imageAlt
      },
      _type == "aboutPageOurValuesSection" => {
        title,
        values[] {
          title,
          description
        }
      },
      _type == "aboutPageMeetTheTeamSection" => {
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
      _type == "aboutPageTrustedPartnershipsSection" => {
        title,
        subtitle,
        partnerships[] {
          name,
          status,
          logo {
            ...,
            asset->
          },
          logoIcon
        }
      },
      _type == "aboutPageCtaSection" => {
        title,
        description,
        buttonText,
        buttonLink
      }
    }
  }
`;

// Partners Page Query
export const partnersPageQuery = groq`
  *[_type == "partnersPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "partnersPageHeroSection" => {
        heroTitle {
          text,
          highlight
        },
        heroDescription
      },
      _type == "partnersPageWhyOurPartnershipSection" => {
        title,
        features[] {
          icon,
          title,
          description
        }
      },
      _type == "partnersPagePartnersGridSection" => {
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
          },
          url,
          linkText
        }
      },
      _type == "partnersPageCtaSection" => {
        title,
        description,
        buttonText,
        buttonLink
      }
    }
  }
`;

// Contact Page Query
export const contactPageQuery = groq`
  *[_type == "contactPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "contactPageHeroSection" => {
        heroTitle {
          text,
          highlight
        },
        heroDescription
      },
      _type == "contactPageCardsSection" => {
        cards[] {
          icon,
          title,
          subtitle,
          detail,
          href
        }
      },
      _type == "contactPageBookingGroupSection" => {
        bookingSection {
          enabled,
          useCalendly,
          calendlySchedulingUrl,
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
        }
      },
      _type == "contactPageMapSection" => {
        title,
        description,
        latitude,
        longitude
      },
      _type == "contactPageFaqSection" => {
        title,
        subtitle,
        faqs[] {
          question,
          answer
        }
      }
    }
  }
`;

// Package Detail Page Query
export const packageDetailPageQuery = groq`
  *[_type == "packageDetailPage" && slug.current == $slug && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "packageDetailPagePackageInfoSection" => {
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
      _type == "packageDetailPageHeroButtonsSection" => {
        primaryButtonText,
        primaryButtonLink,
        secondaryButtonText,
        secondaryButtonLink
      },
      _type == "packageDetailPageBestForSection" => {
        bestFor
      },
      _type == "packageDetailPageIdealForSection" => {
        idealFor
      },
      _type == "packageDetailPageHighlightsSection" => {
        highlights
      },
      _type == "packageDetailPageMoreDeliverablesSection" => {
        moreDeliverablesCount
      },
      _type == "packageDetailPageIncludedListSection" => {
        included
      },
      _type == "packageDetailPageIncludedCategoriesSection" => {
        includedCategories[] { category, items }
      },
      _type == "packageDetailPageProcessStepsSection" => {
        processSteps[] { week, title, description }
      },
      _type == "packageDetailPageFaqListSection" => {
        faq[] { question, answer }
      },
      _type == "packageDetailPageReviewsListSection" => {
        reviews[] { name, rating, comment, title }
      },
      _type == "packageDetailPageTabLabelsSection" => {
        overview,
        whatsIncluded,
        process,
        faq,
        reviews,
        idealFor,
        bestFor
      },
      _type == "packageDetailPageAddOnsSection" => {
        sectionTitle,
        sectionSubtitle,
        items[] { title, description, price }
      },
      _type == "packageDetailPageCaseStudiesBannerSection" => {
        title,
        description,
        buttonText,
        buttonLink
      }
    }
  }
`;

// Blog Page Query (resolves featured article and grid from post / caseStudy references)
export const blogPageQuery = groq`
  *[_type == "blogPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "blogPageHeroSection" => {
        heroTitle { highlight, text },
        heroDescription,
        searchPlaceholder
      },
      _type == "blogPageFeaturedArticleSection" => {
        "articleSlug": article->slug.current,
        "articleType": article->_type,
        "imageUrl": coalesce(article->heroImage.asset->url, article->image.asset->url, image.asset->url),
        "tags": coalesce(article->tags[]{ label, isPrimary }, tags[]{ label, isPrimary }),
        "title": coalesce(article->title, title),
        "description": coalesce(article->description, article->introduction, article->excerpt, description),
        "date": coalesce(article->publishedAt, article->date, date),
        "readTime": coalesce(article->readTime, readTime),
        link,
        "articleSlug": coalesce(articleSlug, article->slug.current),
        "articleType": article->_type,
        "articleLanguage": article->language,
        buttonText,
        pageHeaderEyebrow,
        pageHeaderTitle,
        "author": article->author->{ name, "imageUrl": image.asset->url }
      },
      _type == "blogPageArticlesGridSection" => {
        "articles": *[_type in ["post", "caseStudy"] && (language == $language || !defined(language))] | order(coalesce(publishedAt, date) desc) {
          _type,
          title,
          "description": select(
            _type == "caseStudy" => coalesce(excerpt, description),
            _type == "post" => coalesce(excerpt, description),
            coalesce(description, introduction)
          ),
          "date": coalesce(publishedAt, date),
          "readTime": null,
          "category": select(
            _type == "caseStudy" => coalesce(industry, "Case Study"),
            _type == "post" => coalesce(tags[isPrimary == true][0].label, tags[0].label),
            category
          ),
          "imageUrl": select(
            _type == "caseStudy" => coalesce(heroImage.asset->url, image.asset->url),
            coalesce(featuredImage.asset->url, image.asset->url)
          ),
          "slug": slug.current,
          "author": coalesce(
            author->{ name, "imageUrl": image.asset->url },
            select(_type == "caseStudy" => { "name": authorName }, null)
          )
        },
        latestPostsLabel,
        archiveLabel,
        searchPlaceholder
      },
      _type == "blogPageNewsletterCtaSection" => {
        title,
        description,
        emailPlaceholder,
        buttonText
      }
    }
  }
`;

// ============================================
// Post (Page Builder) Queries
// ============================================

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    _type,
    _updatedAt,
    language,
    title,
    "slug": slug.current,
    excerpt,
    "metaDescription": coalesce(seoExtended.metaDescription, excerpt),
    publishedAt,
    "image": image.asset->url,
    "author": author->{ name, role, "image": image.asset->url, "slug": slug.current },
    tags[] { label, isPrimary },
    content[] {
      _type,
      _key,
      // richTextBlock (portable text; expand images in body)
      (_type == "richTextBlock") => {
        body[] {
          ...,
          _type == "image" => {
            "asset": asset->{ _id, url, metadata { dimensions, lqip } },
            alt,
            caption
          }
        }
      },
      // keyTakeawaysBlock (rich text + colors)
      (_type == "keyTakeawaysBlock") => {
        content[] {
          ...,
          _type == "image" => {
            "asset": asset->{ _id, url, metadata { dimensions, lqip } },
            alt,
            caption
          }
        },
        backgroundColor,
        borderColor,
        topBorderColor,
        topBorderColorEnd
      },
      // statsRowBlock
      (_type == "statsRowBlock") => { stats[] { value, label } },
      // tableBlock
      (_type == "tableBlock") => { title, columns, rows[] { cells } },
      // comparisonCardsBlock
      (_type == "comparisonCardsBlock") => {
        leftCard {
          title,
          body[] {
            ...,
            _type == "image" => {
              "asset": asset->{ _id, url, metadata { dimensions, lqip } },
              alt,
              caption
            }
          }
        },
        rightCard {
          title,
          body[] {
            ...,
            _type == "image" => {
              "asset": asset->{ _id, url, metadata { dimensions, lqip } },
              alt,
              caption
            }
          }
        }
      },
      // calloutBlock
      (_type == "calloutBlock") => { variant, title, content },
      // prosConsBlock
      (_type == "prosConsBlock") => { consTitle, cons, prosTitle, pros },
      // codeBlock
      (_type == "codeBlock") => { language, code },
      // faqBlock
      (_type == "faqBlock") => { title, items[] { question, answer } },
      // ctaBlock (rich text body)
      (_type == "ctaBlock") => {
        heading,
        body[] {
          ...,
          _type == "image" => {
            "asset": asset->{ _id, url, metadata { dimensions, lqip } },
            alt,
            caption
          }
        },
        buttons[] {
          label,
          url,
          variant
        },
        buttonLabel,
        buttonUrl
      },
      // gradientTitleBlock
      (_type == "gradientTitleBlock") => { title, highlightPrefix },
      // imageBlock
      (_type == "imageBlock") => {
        image { ${imageFragment} },
        alt,
        caption
      },
      // dividerBlock
      (_type == "dividerBlock") => { spacing },
      // videoBlock
      (_type == "videoBlock") => {
        url,
        "poster": poster.asset->url,
        caption,
        autoplay
      },
    }
  }
`;

// Resolve post by slug (for routing)
export const resolvePostBySlugQuery = groq`
  *[_type == "post" && lower(slug.current) == lower($slug) && (language == $language || !defined(language))] | order(defined(language) desc) [0] { _type, _id, "slug": slug.current }
`;

// Merch Page Query
export const merchPageQuery = groq`
  *[_type == "merchPage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "merchPageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription
      },
      _type == "merchPageQualityShowcaseSection" => {
        title,
        description,
        products[] { handle, name }
      },
      _type == "merchPageNewsletterSection" => {
        title,
        description,
        emailPlaceholder,
        buttonText,
        successMessage
      }
    }
  }
`;

// Merch Product Settings Query
export const merchProductSettingsQuery = groq`
  *[_type == "merchProductSettings" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
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

// Header Settings Query – resolves page references to slug so header links follow Sanity slugs
export const headerSettingsQuery = groq`
  *[_type == "headerSettings" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    settingsTitle,
    menu[] {
      label,
      href,
      "slug": page->slug.current,
      columns[] {
        title,
        items[] {
          label,
          href,
          description,
          indent,
          "slug": page->slug.current
        }
      }
    },
    ctaButton {
      label,
      href,
      "slug": page->slug.current
    }
  }
`;

// Footer Settings Query
export const footerSettingsQuery = groq`
  *[_type == "footerSettings" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    settingsTitle,
    columns[] {
      title,
      links[] {
        label,
        "slug": page->slug.current,
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
        "slug": page->slug.current,
        href
      },
      copyrightText
    },
    newsletter {
      variant,
      overskrift,
      undertekst
    }
  }
`;

// ============================================
// Vipps Hurtigkasse Page Query
// ============================================
export const vippsHurtigkassePageQuery = groq`
  *[_type == "vippsHurtigkassePage" && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    pageTitle,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      _type == "vippsHurtigkassePageHeroSection" => {
        heroTitle { text, highlight },
        heroDescription,
        heroButtons[] { text, link, variant }
      },
      _type == "vippsHurtigkassePageFeaturesSection" => {
        title,
        paragraphs,
        demoStore { text, url, password },
        productImage {
          "src": image.asset->url,
          alt
        }
      },
      _type == "vippsHurtigkassePageHowToGetStartedSection" => {
        title,
        steps[] { title, description, subSteps }
      },
      _type == "vippsHurtigkassePagePricingSection" => {
        sectionTitle,
        priceItems[] { priceText },
        priceNote,
        supportText
      },
      _type == "vippsHurtigkassePageOrderFormSection" => {
        title,
        description
      },
      _type == "vippsHurtigkassePageSupportSection" => {
        title,
        buttonText,
        buttonLink
      }
    }
  }
`;

// ============================================
// Sitemap: fetch all pages with slug and title for the current language
// ============================================

export const sitemapPagesQuery = groq`
  *[_type in [
    "landingPage",
    "aboutPage",
    "contactPage",
    "workPage",
    "partnersPage",
    "blogPage",
    "allPackagesPage",
    "migratePage",
    "shopifyPosPage",
    "shopifyPosInfoPage",
    "shopifyXAiPage",
    "shopifyXPimPage",
    "whyShopifyPage",
    "shopifyPlatformPage",
    "vippsHurtigkassePage",
    "shopifyTcoCalculatorPage",
    "shopifyDevelopmentPage",
    "merchPage",
    "packageDetailPage",
    "pillarPage",
    "integrationPage",
    "migrationPage",
    "legalPage"
  ] && defined(slug.current) && (language == $language || !defined(language))] | order(pageTitle asc) {
    _type,
    "title": pageTitle,
    "slug": slug.current
  }
`;

// Articles and case studies for the human sitemap.
export const sitemapBlogPostsQuery = groq`
  *[_type in ["post", "caseStudy"] && defined(slug.current) && (language == $language || !defined(language))] | order(title asc) {
    _type,
    title,
    "slug": slug.current
  }
`;

// ============================================
// Resolve page by path (slug) + language
// Used by app/[lang]/[[...slug]]/page.tsx for slug-driven routing.
// Path is the URL path without locale, e.g. "about", "om-oss", "services/all_packages".
// Returns _type and _id so the app can fetch full data and render the right component.
// ============================================
const PAGE_TYPES_WITH_SLUG = [
  "aboutPage",
  "contactPage",
  "workPage",
  "partnersPage",
  "blogPage",
  "allPackagesPage",
  "migratePage",
  "shopifyPosPage",
  "shopifyPosInfoPage",
  "shopifyXAiPage",
  "shopifyXPimPage",
  "whyShopifyPage",
  "shopifyPlatformPage",
  "vippsHurtigkassePage",
  "shopifyTcoCalculatorPage",
  "shopifyDevelopmentPage",
  "merchPage",
  "packageDetailPage",
  "pillarPage",
  "integrationPage",
  "integrationCategory",
  "migrationPage",
];

// Matches slug with or without locale prefix (e.g. "tjenester/vare_pakker" or "no/tjenester/vare_pakker")
export const resolvePageByPathQuery = groq`
  *[
    _type in $pageTypes
    && defined(slug.current)
    && (lower(slug.current) == lower($path) || lower(slug.current) == lower($pathWithLocale))
    && (language == $language || !defined(language))
  ] | order(defined(language) desc) [0] { _type, _id, "slug": slug.current }
`;

export const RESOLVE_PAGE_TYPES = PAGE_TYPES_WITH_SLUG;

// Breadcrumb JSON-LD: titles for slugs that match cumulative path, locale-prefixed path, or leaf slug (packages, posts).
export const breadcrumbTitlesQuery = groq`
  *[
    _type in $types
    && defined(slug.current)
    && slug.current in $slugs
    && (language == $language || !defined(language))
  ] | order(defined(language) desc) {
    "slug": slug.current,
    "title": coalesce(pageTitle, title)
  }
`;

export const resolvePackageDetailBySlugQuery = groq`
  *[_type == "packageDetailPage" && lower(slug.current) == lower($slug) && (language == $language || !defined(language))] | order(defined(language) desc) [0] { _type, _id, "slug": slug.current }
`;

// ============================================
// Case Study by slug
// ============================================
export const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug && (language == $language || !defined(language))] | order(defined(language) desc) [0] {
    _id,
    _type,
    _updatedAt,
    language,
    title,
    "slug": slug.current,
    excerpt,
    "metaDescription": coalesce(seoExtended.metaDescription, excerpt),
    publishedAt,
    "heroImage": heroImage {
      asset->{ _id, url, metadata { dimensions, lqip } },
      alt
    },
    "clientLogo": clientLogo {
      asset->{ _id, url, metadata { dimensions, lqip } },
      alt
    },
    tags,
    industry,
    partner,
    previousPlatform,
    products,
    pakke,
    ctaText,
    heroVideo,
    "relatedCaseStudies": relatedCaseStudies[]-> {
      _id,
      language,
      title,
      "slug": slug.current,
      excerpt,
      industry,
      "heroImageUrl": heroImage.asset->url
    },
    sections[] {
      _type,
      _key,
      (_type == "caseStudyIntroSection") => {
        text[] { ..., },
        metrics[] { text }
      },
      (_type == "caseStudyContentSection") => {
        heading,
        body[] { ..., },
        bullets[] { lead, text }
      },
      (_type == "caseStudyTestimonialSection") => {
        quote,
        company,
        authorName,
        authorRole,
        "imageUrl": image.asset->url
      },
      (_type == "caseStudyStatsSection") => {
        headline,
        stats[] { value, label }
      },
      (_type == "caseStudyRelatedSection") => {
        headline,
        brands[] {
          name,
          "logo": {
            "url": logo.asset->url,
            "alt": logo.alt
          },
          url
        }
      }
    }
  }
`;

export const resolveCaseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && lower(slug.current) == lower($slug) && (language == $language || !defined(language))] | order(defined(language) desc) [0] { _type, _id, "slug": slug.current }
`;

// ============================================
// Author pages (/team/<slug>)
// Authors are language-neutral (no language filter).
// ============================================
export const resolveAuthorBySlugQuery = groq`
  *[_type == "author" && lower(slug.current) == lower($slug)][0] { _type, _id, "slug": slug.current }
`;

export const authorBySlugQuery = groq`
  *[_type == "author" && lower(slug.current) == lower($slug)][0] {
    _id,
    name,
    role,
    "slug": slug.current,
    bio,
    longBio,
    expertise,
    linkedin,
    "imageUrl": image.asset->url,
    seoExtended { metaTitle, metaDescription }
  }
`;

// Everything the author has written, as cards (posts, case studies)
export const authorArticlesQuery = groq`
  *[_type in ["post", "caseStudy"] && author._ref == $authorId && defined(slug.current)]
    | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    _type,
    language,
    title,
    "slug": slug.current,
    "excerpt": coalesce(excerpt, description),
    "category": coalesce(category, industry),
    publishedAt,
    "imageUrl": coalesce(image.asset->url, featuredImage.asset->url, heroImage.asset->url)
  }
`;

// ============================================
// Per-page SEO fetch (generateMetadata)
// ============================================
// Returns the new `seoExtended` object plus legacy `seo` fallback shape,
// scoped to a specific page document. Consumed by lib/sanity/pageSeo.ts.
// The page is identified by ($type, $slug, $language). When $slug is empty
// the query matches the homepage landingPage (slug.current == "home" OR
// isHomepage == true).
//
// Also projects `translations` — the translated siblings via the
// `@sanity/document-internationalization` `translation.metadata` document.
// Each entry carries _key (language id) + the resolved doc's slug/isHomepage/
// noIndex so the frontend can build hreflang URLs without an extra round-trip.
export const pageSeoQuery = groq`
  *[
    _type == $type
    && (
      ($slug == "" && (slug.current == "home" || slug.current == "/" || isHomepage == true))
      || lower(slug.current) in $slugCandidates
    )
    && (language == $language || !defined(language))
  ] | order(defined(language) desc) [0] {
    _id,
    _type,
    "language": coalesce(language, "en"),
    "pageTitle": coalesce(pageTitle, title, name),
    "excerpt": coalesce(excerpt, description, bio),
    "slug": slug.current,
    "isHomepage": coalesce(isHomepage, false),
    "seoExtended": seoExtended {
      metaTitle,
      metaDescription,
      canonical,
      ogTitle,
      ogDescription,
      ogImage,
      ogImageAlt,
      structuredDataType,
      noIndex,
      noFollow
    },
    "faqItems": coalesce(select(
      _type == "allPackagesPage" => coalesce(sections[_type == "allPackagesPageFaqSection"][0].faqItems[]{ question, answer }, []),
      _type == "contactPage" => coalesce(sections[_type == "contactPageFaqSection"][0].faqs[]{ question, answer }, []),
      _type == "shopifyXAiPage" => coalesce(sections[_type == "shopifyXAiPageFaqSection"][0].items[]{ question, answer }, []),
      _type == "packageDetailPage" => coalesce(sections[_type == "packageDetailPageFaqListSection"][0].faq[]{ question, answer }, []),
      _type == "post" => coalesce(content[_type == "faqBlock"][0].items[]{ question, answer }, []),
      _type == "shopifyXPimPage" => coalesce(sections[_type == "shopifyXPimCombinedSection"][0].faq.items[]{ question, answer }, []),
      _type in ["pillarPage", "integrationPage", "migrationPage"] => coalesce(faq[]{ question, answer }, [])
    ), []),
    "translations": *[_type == "translation.metadata" && references(^._id)][0]{
      translations[] {
        _key,
        "doc": value->{
          _id,
          _type,
          "language": coalesce(language, _key),
          "slug": slug.current,
          "isHomepage": coalesce(isHomepage, false),
          "noIndex": coalesce(seoExtended.noIndex, false)
        }
      }
    }.translations
  }
`;

// Per-page SEO fetch by slug only (when document _type is not known up front).
// Used for blog post / case study / package detail style routes where the slug
// is unique across the site.
export const pageSeoBySlugQuery = groq`
  *[
    _type in $types
    && slug.current == $slug
    && (language == $language || !defined(language))
  ] | order(defined(language) desc) [0] {
    _id,
    _type,
    "language": coalesce(language, "en"),
    "pageTitle": coalesce(pageTitle, title, name),
    "excerpt": coalesce(excerpt, description, bio),
    "slug": slug.current,
    "isHomepage": coalesce(isHomepage, false),
    "seoExtended": seoExtended {
      metaTitle,
      metaDescription,
      canonical,
      ogTitle,
      ogDescription,
      ogImage,
      ogImageAlt,
      structuredDataType,
      noIndex,
      noFollow
    },
    "faqItems": coalesce(select(
      _type == "allPackagesPage" => coalesce(sections[_type == "allPackagesPageFaqSection"][0].faqItems[]{ question, answer }, []),
      _type == "contactPage" => coalesce(sections[_type == "contactPageFaqSection"][0].faqs[]{ question, answer }, []),
      _type == "shopifyXAiPage" => coalesce(sections[_type == "shopifyXAiPageFaqSection"][0].items[]{ question, answer }, []),
      _type == "packageDetailPage" => coalesce(sections[_type == "packageDetailPageFaqListSection"][0].faq[]{ question, answer }, []),
      _type == "post" => coalesce(content[_type == "faqBlock"][0].items[]{ question, answer }, []),
      _type == "shopifyXPimPage" => coalesce(sections[_type == "shopifyXPimCombinedSection"][0].faq.items[]{ question, answer }, []),
      _type in ["pillarPage", "integrationPage", "migrationPage"] => coalesce(faq[]{ question, answer }, [])
    ), []),
    "translations": *[_type == "translation.metadata" && references(^._id)][0]{
      translations[] {
        _key,
        "doc": value->{
          _id,
          _type,
          "language": coalesce(language, _key),
          "slug": slug.current,
          "isHomepage": coalesce(isHomepage, false),
          "noIndex": coalesce(seoExtended.noIndex, false)
        }
      }
    }.translations
  }
`;

// ============================================
// Site settings (per language)
// ============================================
// Used to drive site-wide defaults (title template, default OG image,
// verification, robots kill switch) in generateMetadata and robots.ts.
export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && language == $language] | order(_updatedAt desc) [0] {
    siteName,
    titleTemplate,
    defaultMetaDescription,
    favicon,
    logo,
    defaultOgImage,
    defaultOgImageAlt,
    verification,
    robots,
    socialProfiles,
    organization
  }
`;

// Robots kill switch lookup (used by app/robots.ts). Falls back across languages
// so the toggle works regardless of which siteSettings doc the editor flips.
export const siteSettingsRobotsQuery = groq`
  *[_type == "siteSettings" && defined(robots.noIndexEntireSite)] | order(_updatedAt desc) {
    language,
    "noIndexEntireSite": robots.noIndexEntireSite
  }
`;

// ============================================
// Legal pages (privacy policy, terms, …)
// ============================================
// Rendered at /legal/[slug]. Falls back to the English document when no
// translation exists for the requested language (e.g. the EN privacy
// policy served on scandicommerce.no until a NO translation is created).
export const legalPageBySlugQuery = groq`
  coalesce(
    *[_type == "legalPage" && slug.current == $slug && language == $language][0] {
      pageTitle,
      language,
      lastUpdated,
      content,
      seoExtended
    },
    *[_type == "legalPage" && slug.current == $slug && language == "en"][0] {
      pageTitle,
      language,
      lastUpdated,
      content,
      seoExtended
    }
  )
`;
