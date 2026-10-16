import { groq } from 'next-sanity'

/**
 * Queries for the SEO templates (pillarPage / integrationPage / migrationPage).
 * Kept separate from queries.ts to keep the templates self-contained.
 */
const LINK_PROJECTION = `{
  _id,
  _type,
  language,
  "slug": slug.current,
  "title": coalesce(pageTitle, title),
  "excerpt": coalesce(definition, excerpt, description)
}`

export const templatePageBySlugQuery = groq`
  *[_type in ["pillarPage", "integrationPage", "migrationPage"]
    && lower(slug.current) == lower($slug)
    && language == $language][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    language,
    pageTitle,
    "slug": slug.current,
    definition,
    intro,
    "heroImage": heroImage { "url": asset->url, alt, "lqip": asset->metadata.lqip },
    "author": author-> { name, role, "slug": slug.current, "imageUrl": image.asset->url },
    schemaType,
    integrationName,
    vendorUrl,
    whatItIs,
    whyItMatters,
    implementationSteps[] { name, text },
    "dataFlow": dataFlow { "url": asset->url, alt },
    prerequisites,
    namedClients,
    "logo": logo { "url": asset->url, "alt": coalesce(asset->altText, integrationName) },
    "category": category-> { _id, title, key, "slug": slug.current },
    shortDescription,
    integrationMethod,
    status,
    syncDirection,
    capabilities,
    notIncluded,
    systems[] { _key, name, role, "logoUrl": logo.asset->url },
    dataFlowSteps[] { _key, from, to, payload, trigger, frequency },
    featured,
    sourcePlatform,
    whatTransfers,
    whatDoesNot,
    timeline,
    risks,
    costBand,
    "namedCase": namedCase-> ${LINK_PROJECTION},
    sections[] { _key, heading, anchor, body },
    faq[] { question, answer },
    cta,
    "pillar": pillar-> ${LINK_PROJECTION},
    "clusterLinks": clusterLinks[]-> ${LINK_PROJECTION},
    "relatedPages": relatedPages[]-> ${LINK_PROJECTION},
    "relatedCaseStudies": relatedCaseStudies[]-> {
      _id, _type, language, title, "slug": slug.current, excerpt, industry, "heroImageUrl": heroImage.asset->url
    },
    "children": *[_type in ["integrationPage", "migrationPage"] && pillar._ref == ^._id && language == ^.language] | order(pageTitle asc) ${LINK_PROJECTION},
    "seoExtended": seoExtended { metaTitle, metaDescription, ogImage, ogImageAlt, noIndex }
  }
`

/** Card projection shared by the hub grid, category pages and sibling lists. */
export const INTEGRATION_CARD_PROJECTION = `{
  _id,
  _type,
  language,
  "slug": slug.current,
  integrationName,
  pageTitle,
  shortDescription,
  integrationMethod,
  status,
  syncDirection,
  capabilities,
  featured,
  "logoUrl": logo.asset->url,
  "category": category-> { title, key, "slug": slug.current },
  "firstStep": dataFlowSteps[0] { from, to }
}`

export const integrationHubQuery = groq`{
  "categories": *[_type == "integrationCategory" && language == $language] | order(order asc, title asc) {
    _id,
    title,
    key,
    "slug": slug.current,
    definition,
    "count": count(*[_type == "integrationPage" && category._ref == ^._id && language == ^.language]),
    "vendors": *[_type == "integrationPage" && category._ref == ^._id && language == ^.language] | order(featured desc, pageTitle asc)[0..4].integrationName
  },
  "integrations": *[_type == "integrationPage" && language == $language] | order(featured desc, pageTitle asc) ${INTEGRATION_CARD_PROJECTION}
}`

export const integrationCategoryBySlugQuery = groq`
  *[_type == "integrationCategory" && lower(slug.current) == lower($slug) && language == $language][0] {
    _id,
    _type,
    _updatedAt,
    language,
    title,
    key,
    "slug": slug.current,
    definition,
    intro,
    "heroImage": heroImage { "url": asset->url, alt },
    faq[] { question, answer },
    cta,
    "relatedPages": relatedPages[]-> ${LINK_PROJECTION},
    "integrations": *[_type == "integrationPage" && category._ref == ^._id && language == ^.language] | order(featured desc, pageTitle asc) ${INTEGRATION_CARD_PROJECTION},
    "siblings": *[_type == "integrationCategory" && language == ^.language && _id != ^._id] | order(order asc, title asc) { _id, title, key, "slug": slug.current, "count": count(*[_type == "integrationPage" && category._ref == ^._id && language == ^.language]) },
    "pillar": *[_type == "pillarPage" && language == ^.language && (slug.current == "integrasjoner" || slug.current == "integrations")][0] { _id, _type, language, "slug": slug.current, "title": pageTitle }
  }
`
