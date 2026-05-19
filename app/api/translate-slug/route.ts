import { NextRequest, NextResponse } from 'next/server'
import { translatePath } from '@/lib/translatePath'

export const dynamic = 'force-dynamic'

/**
 * GET /api/translate-slug?currentPath=services/all-packages&currentLang=en&targetLang=no
 *
 * Resolves the slug of the current page in the target language.
 * Used by the language switcher to navigate to the correct slug-based URL.
 * Returns { slug: "tjenester/alle-pakker" } or { slug: null } if not found.
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
    const slug = await translatePath(currentPath, currentLang, targetLang)
    return NextResponse.json({ slug })
  } catch {
    return NextResponse.json({ slug: null })
  }
}
