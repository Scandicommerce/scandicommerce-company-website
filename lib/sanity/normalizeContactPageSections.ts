import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

function nonEmptyObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length > 0)
}

/** Prefer `sections`; legacy root fields merge booking + message + benefits into one block in order. */
export function normalizeContactPageSections(page: Record<string, unknown> | null | undefined): SanitySectionItem[] {
  if (!page) return []
  const raw = page.sections
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.filter((item): item is SanitySectionItem => {
      return Boolean(item && typeof item === 'object' && '_type' in item && '_key' in item)
    }) as SanitySectionItem[]
  }

  const out: SanitySectionItem[] = []
  if (nonEmptyObject(page.hero)) {
    out.push({ _key: 'legacy-hero', _type: 'contactPageHeroSection', ...(page.hero as object) })
  }
  if (nonEmptyObject(page.contactCards)) {
    out.push({ _key: 'legacy-cards', _type: 'contactPageCardsSection', ...(page.contactCards as object) })
  }

  const hasBooking = nonEmptyObject(page.bookingSection)
  const hasMessage = nonEmptyObject(page.messageSection)
  const hasBenefits = Array.isArray(page.benefits) && page.benefits.length > 0
  if (hasBooking || hasMessage || hasBenefits) {
    out.push({
      _key: 'legacy-booking',
      _type: 'contactPageBookingGroupSection',
      bookingSection: hasBooking ? page.bookingSection : {},
      messageSection: hasMessage ? page.messageSection : {},
      benefits: hasBenefits ? page.benefits : [],
    })
  }

  if (nonEmptyObject(page.mapSection)) {
    out.push({ _key: 'legacy-map', _type: 'contactPageMapSection', ...(page.mapSection as object) })
  }
  if (nonEmptyObject(page.faq)) {
    out.push({ _key: 'legacy-faq', _type: 'contactPageFaqSection', ...(page.faq as object) })
  }

  return out
}
