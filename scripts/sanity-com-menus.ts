// TARGET_DATASET=production npx sanity exec scripts/sanity-com-menus.ts --with-user-token
// Main Menu for the en/sv/da/de header documents, mirroring the Norwegian
// menu now that the English service routes and Nexus POS exist.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })

const L: Record<string, Record<string, string>> = {
  en: { services: 'Services', deliveries: 'Services', overview: 'Services overview', overviewDesc: 'Everything we deliver and which package it belongs to', store: 'Shopify store', migrate: 'Migration to Shopify', b2b: 'B2B and order portal', dev: 'Development and custom work', packages: 'Packages', allPackages: 'All packages', partners: 'Partners', work: 'Case studies', about: 'About', contact: 'Contact' },
  sv: { services: 'Tjänster', deliveries: 'Leveranser', overview: 'Översikt över tjänster', overviewDesc: 'Allt vi levererar och vilket paket det ingår i', store: 'Shopify-butik', migrate: 'Migrering till Shopify', b2b: 'B2B och orderportal', dev: 'Utveckling och skräddarsytt', packages: 'Paket', allPackages: 'Alla paket', partners: 'Partners', work: 'Kundcase', about: 'Om oss', contact: 'Kontakt' },
  da: { services: 'Tjenester', deliveries: 'Leverancer', overview: 'Oversigt over tjenester', overviewDesc: 'Alt det, vi leverer, og hvilken pakke det hører til', store: 'Shopify-butik', migrate: 'Migrering til Shopify', b2b: 'B2B og ordreportal', dev: 'Udvikling og skræddersyet', packages: 'Pakker', allPackages: 'Alle pakker', partners: 'Partnere', work: 'Kundecases', about: 'Om os', contact: 'Kontakt' },
  de: { services: 'Leistungen', deliveries: 'Leistungen', overview: 'Leistungen im Überblick', overviewDesc: 'Alles, was wir liefern, und zu welchem Paket es gehört', store: 'Shopify-Shop', migrate: 'Migration zu Shopify', b2b: 'B2B und Bestellportal', dev: 'Entwicklung und Individuelles', packages: 'Pakete', allPackages: 'Alle Pakete', partners: 'Partner', work: 'Kundenprojekte', about: 'Über uns', contact: 'Kontakt' },
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
  { _type: 'menuItem', _key: 'nexuspos', label: 'NexusPOS', href: '/nexuspos' },
  { _type: 'menuItem', _key: 'partners', label: t.partners, href: '/partners' },
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
