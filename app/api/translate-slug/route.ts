import { NextRequest, NextResponse } from 'next/server'
import { resolvePageByPath } from '@/lib/resolvePageByPath'
import { client } from '@/sanity/lib/client'
import { resolveTranslatedSlugQuery } from '@/sanity/lib/queries'

export const dynamic = 'force-dynamic'

/**
 * GET /api/translate-slug?currentPath=services/all-packages&currentLang=en&targetLang=no
 *
 * Resolves the slug of the current page in the target language.
 * Used by the language switcher to navigate to the correct slug-based URL.
 * Returns { slug: "tjenester/vare-pakker" } or { slug: null } if not found.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const currentPath = searchParams.get('currentPath') || ''
  const currentLang = searchParams.get('currentLang') || 'en'
  const targetLang = searchParams.get('targetLang') || 'en'

  if (currentLang === targetLang || !currentPath) {
    return NextResponse.json({ slug: null })
  }

  try {
    const resolved = await resolvePageByPath(currentPath, currentLang)
    if (!resolved) {
      return NextResponse.json({ slug: null })
    }

    const translation = await client.fetch<{ slug: string | null } | null>(
      resolveTranslatedSlugQuery,
      { type: resolved.type, targetLang },
      { next: { revalidate: 60 } }
    )

    return NextResponse.json({ slug: translation?.slug ?? null })
  } catch {
    return NextResponse.json({ slug: null })
  }
}
