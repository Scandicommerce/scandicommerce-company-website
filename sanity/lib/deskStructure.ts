import { StructureBuilder } from 'sanity/structure'
import {
  DocumentsIcon,
  ComposeIcon,
  CogIcon,
  CalendarIcon,
  PlugIcon,
  EarthGlobeIcon,
  LinkIcon,
  DocumentTextIcon,
  CaseIcon,
  TagIcon,
  BasketIcon,
  UsersIcon,
} from '@sanity/icons'
import { PageListWithDelete } from '@/sanity/components/PageListWithDelete'
import { CalendlySetup } from '@/sanity/components/CalendlySetup'
import { languages } from '@/sanity/lib/languages'

const API_VERSION = '2025-02-19'

/**
 * One document type, one folder, with the language picked first so no list
 * mixes five languages. The "All languages" entry stays for bulk work.
 */
function byLanguage(S: StructureBuilder, schemaType: string, title: string) {
  return S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(
      S.list()
        .title(title)
        .items([
          ...languages.map((lang) =>
            S.listItem()
              .id(`${schemaType}-${lang.id}`)
              .title(lang.title)
              .schemaType(schemaType)
              .child(
                S.documentList()
                  .id(`${schemaType}-list-${lang.id}`)
                  .title(`${title} (${lang.title})`)
                  .schemaType(schemaType)
                  .apiVersion(API_VERSION)
                  .filter('_type == $type && language == $lang')
                  .params({ type: schemaType, lang: lang.id })
              )
          ),
          S.divider(),
          S.listItem()
            .id(`${schemaType}-all`)
            .title('All languages')
            .schemaType(schemaType)
            .child(S.documentTypeList(schemaType).title(`${title} (all)`)),
        ])
    )
}

/** Plain type list for types without a language field. */
function plain(S: StructureBuilder, schemaType: string, title: string) {
  return S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(S.documentTypeList(schemaType).title(title))
}

function folder(S: StructureBuilder, title: string, icon: React.ComponentType, items: ReturnType<StructureBuilder['listItem']>[]) {
  return S.listItem().title(title).icon(icon).child(S.list().title(title).items(items))
}

/**
 * Studio desk. Every document type appears exactly once, grouped the way the
 * site is organised: site pages, services, Shopify lead-gen pages, SEO
 * templates, articles, case studies, partners, merch, legal, bookings,
 * settings. Lists are filtered by language.
 */
export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      folder(S, 'Site pages', DocumentsIcon, [
        byLanguage(S, 'landingPage', 'Home page'),
        byLanguage(S, 'aboutPage', 'About'),
        byLanguage(S, 'contactPage', 'Contact'),
        byLanguage(S, 'partnersPage', 'Partners page'),
        byLanguage(S, 'workPage', 'Case studies page'),
        byLanguage(S, 'blogPage', 'Blog page'),
        byLanguage(S, 'merchPage', 'Merch page'),
      ]),
      folder(S, 'Services and packages', CogIcon, [
        byLanguage(S, 'allPackagesPage', 'All packages'),
        byLanguage(S, 'packageDetailPage', 'Package detail pages'),
        byLanguage(S, 'shopifyDevelopmentPage', 'Development (tjenester/utvikling)'),
        byLanguage(S, 'migratePage', 'Migration hub (tjenester/migrering)'),
        byLanguage(S, 'shopifyPosPage', 'Shopify POS service page'),
        byLanguage(S, 'vippsHurtigkassePage', 'Vipps Hurtigkasse'),
      ]),
      folder(S, 'Shopify lead-gen pages', ComposeIcon, [
        byLanguage(S, 'shopifyPlatformPage', 'Shopify platform'),
        byLanguage(S, 'shopifyPosInfoPage', 'Shopify POS info'),
        byLanguage(S, 'shopifyTcoCalculatorPage', 'TCO calculator'),
        byLanguage(S, 'shopifyXPimPage', 'Shopify x PIM'),
        byLanguage(S, 'shopifyXAiPage', 'Shopify x AI'),
        byLanguage(S, 'whyShopifyPage', 'Why Shopify'),
      ]),
      folder(S, 'SEO templates', EarthGlobeIcon, [
        byLanguage(S, 'pillarPage', 'Pillar pages'),
        byLanguage(S, 'integrationCategory', 'Integration categories'),
        byLanguage(S, 'integrationPage', 'Integration pages'),
        byLanguage(S, 'migrationPage', 'Migration pages (per platform)'),
      ]),
      S.divider(),
      folder(S, 'Articles', DocumentTextIcon, [
        byLanguage(S, 'post', 'Articles'),
        plain(S, 'author', 'Authors'),
      ]),
      folder(S, 'Case studies', CaseIcon, [byLanguage(S, 'caseStudy', 'Case studies')]),
      folder(S, 'Partners', UsersIcon, [plain(S, 'partnerCategory', 'Partner categories')]),
      folder(S, 'Merch', BasketIcon, [byLanguage(S, 'merchProductSettings', 'Product settings')]),
      byLanguage(S, 'legalPage', 'Legal pages'),
      S.divider(),
      folder(S, 'Calendly bookings', CalendarIcon, [
        S.listItem().title('Sync existing meetings').icon(PlugIcon).child(S.component(CalendlySetup).id('calendly-setup')),
        S.listItem()
          .title('Bookings')
          .schemaType('calendlyBooking')
          .child(S.documentTypeList('calendlyBooking').title('Calendly bookings').defaultOrdering([{ field: 'startTime', direction: 'desc' }])),
      ]),
      folder(S, 'Site settings', CogIcon, [
        S.listItem()
          .title('Site settings (global)')
          .icon(EarthGlobeIcon)
          .schemaType('siteSettings')
          .child(
            S.list()
              .title('Site settings by language')
              .items(
                languages.map((lang) =>
                  S.listItem()
                    .id(`siteSettings-${lang.id}`)
                    .title(lang.title)
                    .schemaType('siteSettings')
                    .child(S.editor().id(`siteSettings-${lang.id}`).schemaType('siteSettings').documentId(`siteSettings-${lang.id}`))
                )
              )
          ),
        byLanguage(S, 'headerSettings', 'Header'),
        byLanguage(S, 'footerSettings', 'Footer'),
        S.listItem()
          .title('Redirects')
          .icon(LinkIcon)
          .schemaType('redirect')
          .child(S.documentTypeList('redirect').title('Redirects').defaultOrdering([{ field: 'source', direction: 'asc' }])),
        S.listItem()
          .title('Bulk delete pages')
          .icon(TagIcon)
          .child(
            S.list()
              .title('Bulk delete')
              .items(
                ['landingPage', 'aboutPage', 'contactPage', 'workPage', 'blogPage', 'partnersPage'].map((t) =>
                  S.listItem().title(t).schemaType(t).child(S.component(PageListWithDelete).options({ schemaType: t, title: t }).id(`pages-${t}`))
                )
              )
          ),
      ]),
    ])
