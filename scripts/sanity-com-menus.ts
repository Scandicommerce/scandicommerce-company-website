// TARGET_DATASET=production npx sanity exec scripts/sanity-com-menus.ts --with-user-token
// Main Menu for the en/sv/da/de header documents, mirroring the Norwegian
// menu now that the English service routes and Nexus POS exist.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })

const L: Record<string, Record<string, string>> = {
  en: { integrations: 'Integrations', bySystem: 'By system', allIntegrations: 'All integrations', erp: 'ERP and finance', pim: 'PIM and product data', logistics: 'Logistics and shipping', payments: 'Payments', partnersDesc: '46 partners across 8 disciplines', services: 'Services', deliveries: 'Services', overview: 'Services overview', overviewDesc: 'Everything we deliver and which package it belongs to', store: 'Shopify store', migrate: 'Migration to Shopify', b2b: 'B2B and order portal', dev: 'Development and custom work', packages: 'Packages', allPackages: 'All packages', partners: 'Partners', allPartners: 'All partners', becomePartner: 'Become a partner', agentic: 'Agentic commerce', agenticHref: '/agentic-commerce', becomeHref: '/partners/become-a-partner', work: 'Case studies', about: 'About', contact: 'Contact' },
  sv: { integrations: 'Integrationer', bySystem: 'Efter system', allIntegrations: 'Alla integrationer', erp: 'ERP och ekonomi', pim: 'PIM och produktdata', logistics: 'Logistik och frakt', payments: 'Betalning', partnersDesc: '46 partners inom 8 områden', services: 'Tjänster', deliveries: 'Leveranser', overview: 'Översikt över tjänster', overviewDesc: 'Allt vi levererar och vilket paket det ingår i', store: 'Shopify-butik', migrate: 'Migrering till Shopify', b2b: 'B2B och orderportal', dev: 'Utveckling och skräddarsytt', packages: 'Paket', allPackages: 'Alla paket', partners: 'Partners', allPartners: 'Alla partners', becomePartner: 'Bli partner', agentic: 'Agentisk handel', agenticHref: '/agentisk-handel', becomeHref: '/partners/bli-partner', work: 'Kundcase', about: 'Om oss', contact: 'Kontakt' },
  da: { integrations: 'Integrationer', bySystem: 'Efter system', allIntegrations: 'Alle integrationer', erp: 'ERP og økonomi', pim: 'PIM og produktdata', logistics: 'Logistik og fragt', payments: 'Betaling', partnersDesc: '46 partnere inden for 8 områder', services: 'Tjenester', deliveries: 'Leverancer', overview: 'Oversigt over tjenester', overviewDesc: 'Alt det, vi leverer, og hvilken pakke det hører til', store: 'Shopify-butik', migrate: 'Migrering til Shopify', b2b: 'B2B og ordreportal', dev: 'Udvikling og skræddersyet', packages: 'Pakker', allPackages: 'Alle pakker', partners: 'Partnere', allPartners: 'Alle partnere', becomePartner: 'Bliv partner', agentic: 'Agentisk handel', agenticHref: '/agentisk-handel', becomeHref: '/partnere/bliv-partner', work: 'Kundecases', about: 'Om os', contact: 'Kontakt' },
  de: { integrations: 'Integrationen', bySystem: 'Nach System', allIntegrations: 'Alle Integrationen', erp: 'ERP und Finanzen', pim: 'PIM und Produktdaten', logistics: 'Logistik und Versand', payments: 'Zahlung', partnersDesc: '46 Partner in 8 Bereichen', services: 'Leistungen', deliveries: 'Leistungen', overview: 'Leistungen im Überblick', overviewDesc: 'Alles, was wir liefern, und zu welchem Paket es gehört', store: 'Shopify-Shop', migrate: 'Migration zu Shopify', b2b: 'B2B und Bestellportal', dev: 'Entwicklung und Individuelles', packages: 'Pakete', allPackages: 'Alle Pakete', partners: 'Partner', allPartners: 'Alle Partner', becomePartner: 'Partner werden', agentic: 'Agentic Commerce', agenticHref: '/agentic-commerce', becomeHref: '/partner/partner-werden', work: 'Kundenprojekte', about: 'Über uns', contact: 'Kontakt' },
}

const menu = (t: Record<string, string>) => [
  { _type: 'menuItem', _key: 'services', label: t.services, columns: [
    { _type: 'menuColumn', _key: 'deliveries', title: t.deliveries, items: [
      { _type: 'menuLink', _key: 'sv-overview', label: t.overview, href: '/services', description: t.overviewDesc },
      { _type: 'menuLink', _key: 'sv-store', label: t.store, href: '/services/shopify' },
      { _type: 'menuLink', _key: 'sv-migrate', label: t.migrate, href: '/services/migrate' },
      { _type: 'menuLink', _key: 'sv-b2b', label: t.b2b, href: '/services/b2b' },
      { _type: 'menuLink', _key: 'sv-dev', label: t.dev, href: '/services/shopify-development' },
    ] },
    { _type: 'menuColumn', _key: 'packages', title: t.packages, items: [
      { _type: 'menuLink', _key: 'pk-all', label: t.allPackages, href: '/services/all-packages' },
      { _type: 'menuLink', _key: 'pk-growth', label: 'Growth', href: '/services/all-packages/growth', indent: true },
      { _type: 'menuLink', _key: 'pk-premium', label: 'Premium', href: '/services/all-packages/premium', indent: true },
      { _type: 'menuLink', _key: 'pk-enterprise', label: 'Enterprise', href: '/services/all-packages/enterprise', indent: true },
    ] },
  ] },
  { _type: 'menuItem', _key: 'integrations', label: t.integrations, columns: [
    { _type: 'menuColumn', _key: 'by-system', title: t.bySystem, items: [
      { _type: 'menuLink', _key: 'in-all', label: t.allIntegrations, href: '/integrations' },
      { _type: 'menuLink', _key: 'in-erp', label: t.erp, href: '/integrations/erp', description: 'Finago, 24SevenOffice, Tripletex' },
      { _type: 'menuLink', _key: 'in-pim', label: t.pim, href: '/integrations/pim' },
      { _type: 'menuLink', _key: 'in-logistics', label: t.logistics, href: '/integrations/logistikk', description: 'Profrakt, Holio, Quickship' },
      { _type: 'menuLink', _key: 'in-payments', label: t.payments, href: '/integrations/betaling', description: 'Nets, Vipps, Klarna, Qliro' },
    ] },
    { _type: 'menuColumn', _key: 'partners-col', title: t.partners, items: [
      { _type: 'menuLink', _key: 'pa-all', label: t.allPartners, href: '/partners', description: t.partnersDesc },
      { _type: 'menuLink', _key: 'pa-become', label: t.becomePartner, href: t.becomeHref },
    ] },
  ] },
  { _type: 'menuItem', _key: 'agentic', label: t.agentic, href: t.agenticHref },
  { _type: 'menuItem', _key: 'nexuspos', label: 'NexusPOS', href: '/nexuspos' },
  { _type: 'menuItem', _key: 'work', label: t.work, href: '/work' },
  { _type: 'menuItem', _key: 'about', label: t.about, href: '/about' },
  { _type: 'menuItem', _key: 'contact', label: t.contact, href: '/contact' },
]

async function main() {
  const headers: { _id: string; language: string }[] = await client.fetch('*[_type == "headerSettings" && language in ["en","sv","da","de"] && !(_id in path("drafts.**"))]{ _id, language }')
  for (const h of headers) {
    await client.patch(h._id).set({ menu: menu(L[h.language]) }).commit({ visibility: 'sync' })
    console.log(dataset, 'menu set for', h.language)
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
