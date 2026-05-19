/**
 * Resolve a public URL path in another locale via Sanity (translation.metadata).
 * Used by middleware (cross-domain redirects) and /api/translate-slug.
 */

import {
    isNoSlugEnglishificationRedirect,
    normalizePath,
    translatePath as translatePathJs,
  } from '@/lib/sanity/redirectTranslate'
  
  export { normalizePath, isNoSlugEnglishificationRedirect }
  
  export async function translatePath(
    currentPath: string,
    currentLang: string,
    targetLang: string
  ): Promise<string | null> {
    return translatePathJs(currentPath, currentLang, targetLang)
  }
  