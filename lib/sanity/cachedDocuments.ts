import { cache } from 'react'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import {
  aboutPageQuery,
  blogPostBySlugQuery,
  postBySlugQuery,
  caseStudyBySlugQuery,
} from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'

export const getAboutPageDocumentCached = cache(async (language: string) =>
  sanityPageFetch(aboutPageQuery, getQueryParams({}, language), {
    next: { revalidate: 0 },
  })
)

export const getBlogPostBySlugCached = cache(async (slug: string, language: string) =>
  sanityPageFetch(blogPostBySlugQuery, getQueryParams({ slug }, language), {
    next: { revalidate: 0 },
  })
)

export const getPostBySlugCached = cache(async (slug: string, language: string) =>
  sanityPageFetch(postBySlugQuery, getQueryParams({ slug }, language), {
    next: { revalidate: 0 },
  })
)

export const getCaseStudyBySlugCached = cache(async (slug: string, language: string) =>
  sanityPageFetch(caseStudyBySlugQuery, getQueryParams({ slug }, language), {
    next: { revalidate: 0 },
  })
)
