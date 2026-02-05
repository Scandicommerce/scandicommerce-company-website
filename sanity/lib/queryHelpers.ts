import { defaultLanguage } from "./languages";

/**
 * Helper function to add language parameter to queries
 * Usage: fetch(client, landingPageQuery, { slug: "home", language: "en" })
 */
export const addLanguageParam = (params: Record<string, any> = {}, language?: string) => {
  return {
    ...params,
    language: language || defaultLanguage,
  };
};

/**
 * Helper to get query params with language
 * Can accept language from searchParams or explicitly
 */
export const getQueryParams = (
  params: Record<string, any> = {}, 
  language?: string,
  searchParams?: { [key: string]: string | string[] | undefined }
) => {
  // Priority: explicit language > searchParams > default
  let finalLanguage = language;
  
  if (!finalLanguage && searchParams) {
    const langFromParams = searchParams.lang;
    if (typeof langFromParams === 'string') {
      finalLanguage = langFromParams;
    }
  }
  
  return addLanguageParam(params, finalLanguage);
};
