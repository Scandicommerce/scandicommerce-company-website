import { cache } from 'react'
import { client } from '@/sanity/lib/client'
import {
  aboutPageQuery,
  blogPostBySlugQuery,
  postBySlugQuery,
} from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'

export const getAboutPageDocumentCached = cache(async (language: string) =>
  client.fetch(aboutPageQuery, getQueryParams({}, language), {
    next: { revalidate: 0 },
  })
)

export const getBlogPostBySlugCached = cache(async (slug: string, language: string) =>
  client.fetch(blogPostBySlugQuery, getQueryParams({ slug }, language), {
    next: { revalidate: 0 },
  })
)

export const getPostBySlugCached = cache(async (slug: string, language: string) =>
  client.fetch(postBySlugQuery, getQueryParams({ slug }, language), {
    next: { revalidate: 0 },
  })
)
