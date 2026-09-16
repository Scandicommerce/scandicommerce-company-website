import { defineArrayMember, defineField } from "sanity";

/**
 * Internal-linking backbone (SITE-SEO-ARCHITECTURE §8): every document carries
 * ≥2 related pages so no indexable page is an orphan. Legacy page types warn;
 * the new pillar / integration / migration templates require it.
 */
export const RELATED_PAGE_TYPES = [
  "pillarPage",
  "integrationPage",
  "migrationPage",
  "post",
  "blogPost",
  "caseStudy",
  "allPackagesPage",
  "packageDetailPage",
  "migratePage",
  "shopifyPosPage",
  "shopifyDevelopmentPage",
  "vippsHurtigkassePage",
  "shopifyXPimPage",
  "shopifyXAiPage",
  "whyShopifyPage",
  "shopifyPlatformPage",
  "shopifyPosInfoPage",
  "shopifyTcoCalculatorPage",
  "aboutPage",
  "contactPage",
  "partnersPage",
  "workPage",
  "blogPage",
] as const;

export function relatedPagesField(options: { required?: boolean; group?: string } = {}) {
  const { required = false, group } = options;
  return defineField({
    name: "relatedPages",
    title: "Related pages (internal links)",
    type: "array",
    ...(group ? { group } : {}),
    description:
      "At least two pages in the same language this page should link to (pillar, siblings, case studies). Rendered as a related-links block and used by the orphan check.",
    of: [
      defineArrayMember({
        type: "reference",
        to: RELATED_PAGE_TYPES.map((type) => ({ type })),
        options: {
          filter: ({ document }) =>
            document?.language
              ? { filter: "language == $language", params: { language: document.language } }
              : {},
        },
      }),
    ],
    validation: (rule) =>
      required
        ? rule.min(2).error("Add at least two related pages – every page needs internal links.")
        : rule.min(2).warning("Add at least two related pages so this page is not an orphan."),
  });
}
