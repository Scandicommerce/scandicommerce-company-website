/** App locale → BCP 47 for schema.org `inLanguage`. */
export function getSchemaInLanguageTag(localeId: string): string {
  const primary = localeId.toLowerCase().split('-')[0] || localeId
  const map: Record<string, string> = {
    en: 'en-US',
    no: 'nb-NO',
    sv: 'sv-SE',
    da: 'da-DK',
    de: 'de-DE',
  }
  return map[primary] || localeId
}
