import { client } from '@/sanity/lib/client'
import { latestInsightsPostsQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import type { HomepageSectionBlock } from '@/types/homepage'

export interface LatestInsightPost {
  _type?: string
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  publishedAt?: string | null
  imageUrl?: string | null
  readTime?: string | null
  tagLabel?: string | null
}

export async function fetchLatestInsightsBySectionKey(
  sections: HomepageSectionBlock[] | undefined,
  language: string
): Promise<Record<string, LatestInsightPost[]>> {
  if (!sections?.length) return {}

  const blocks = sections.filter(
    (s): s is HomepageSectionBlock & { _key: string } =>
      s._type === 'latestInsightsSection' && typeof s._key === 'string'
  )

  if (blocks.length === 0) return {}

  const pairs = await Promise.all(
    blocks.map(async (block) => {
      const rawMax = typeof block.maxPosts === 'number' ? block.maxPosts : 3
      const maxPosts = Math.min(6, Math.max(1, Math.floor(rawMax)))
      const filterTag =
        typeof block.filterByTag === 'string' ? block.filterByTag.trim() : ''

      const posts = await client.fetch<LatestInsightPost[]>(
        latestInsightsPostsQuery,
        {
          ...getQueryParams({}, language),
          maxPosts,
          filterTag,
        },
        { next: { revalidate: 0 } }
      )

      return [block._key, posts ?? []] as const
    })
  )

  return Object.fromEntries(pairs)
}
