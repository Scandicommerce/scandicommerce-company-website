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
    pricingSignal,
    namedClients,
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
