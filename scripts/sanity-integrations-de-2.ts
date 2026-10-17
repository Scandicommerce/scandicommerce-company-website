// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-de-2.ts --with-user-token
// Creates German versions (-de, Sie-form) of 12 Norwegian integrationPage documents and adds the
// de entry to the existing translation.metadata (integration-<x>-meta). Fetches the -no
// document in full, swaps the text fields for German, remaps references to the -de
// counterparts and keeps everything else (logo, systems, capabilities, author, order, ...) as is.
// Idempotent: createOrReplace on fixed ids; metadata is only patched when no 'de' key exists.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const toDe = (id: string, extMap: Record<string, string | null>): string | null =>
  id.endsWith('-no') ? id.slice(0, -3) + '-de' : id in extMap ? extMap[id] : id
const weak = (id: string, key?: string) => ({ _type: 'reference', _ref: id, _weak: true, ...(key ? { _key: key } : {}) })

const FREQ: Record<string, string> = {
  'sanntid': 'Echtzeit', 'løpende': 'laufend', 'etter levering': 'nach Lieferung', 'periodisk': 'periodisch',
  'ved pakking': 'beim Packen', 'ved ordre': 'pro Bestellung', 'ved endring': 'bei Änderung', 'daglig': 'täglich',
  'månedlig': 'monatlich', 'ukentlig': 'wöchentlich', 'ukentlig eller månedlig': 'wöchentlich oder monatlich', 'samme kjøring': 'gleicher Lauf',
}

// Shared German copy for the standard FAQ / steps / CTA that most pages use.
const stdSteps = (name: string): [string, string][] => [
  ['Analyse', `Was zwischen Shopify und ${name} fließen soll, welches System wofür die führende Quelle ist, und was bei Fehlern passiert. Ein Arbeitstermin.`],
  ['Einrichtung', 'Anbindung in Ihrem eigenen Konto, Mapping der Felder und Testdaten durch den gesamten Ablauf.'],
  ['Test mit echten Daten', 'Die ersten Bestellungen oder Produkte werden manuell verfolgt, bevor wir alles einschalten.'],
  ['Go-live und Überwachung', 'Wir begleiten die ersten Wochen. Fehler werden mit Verweis auf die Bestellung gemeldet.'],
]
const stdFaq = (name: string, startWith: string): [string, string][] => [
  [`Gehört die Integration zu ${name} uns selbst?`, 'Ja. Make.com-Szenarien liegen in Ihrem Konto, und Code wird mit Quellcode geliefert. Wir betreiben die Integration auf Wunsch, aber Sie sind nicht an uns gebunden.'],
  ['Was passiert, wenn ein Lauf fehlschlägt?', 'Jeder Lauf liegt mit Ein- und Ausgabedaten in der Historie. Fehler werden mit Referenz gemeldet, und wir räumen gemeinsam auf. Ein automatisches Rollback gibt es nicht, und das sagen wir offen.'],
  [`Können wir mit ${startWith} anfangen und später erweitern?`, 'Ja. Die meisten starten mit einem Ablauf, zum Beispiel Bestellungen, und ergänzen Lager oder Kunden danach.'],
  ['Wie lange dauert die Einrichtung?', 'Make.com-Abläufe werden innerhalb von Tagen geliefert, sobald die Analyse abgeschlossen ist. Eigener Code dauert länger, und wir nennen Ihnen nach dem ersten Gespräch einen Zeitplan.'],
]
const stdCta = (name: string) => ({ heading: `Nutzen Sie heute ${name}?`, text: 'Sagen Sie uns, welche Systeme Sie haben, und Sie erhalten Methode, Datenfluss und Zeitplan innerhalb von zwei Werktagen.', buttonLabel: 'Gespräch vereinbaren', buttonHref: '/contact' })

type Tr = {
  pageTitle: string; definition: string; shortDescription: string
  whatItIs: string; whyItMatters: string
  steps: [string, string][]; faq: [string, string][]; cta: Doc
  prerequisites: string[]; notIncluded: string[]
  dataFlow: string[] // payload per dataFlowSteps index
}

const T: Record<string, Tr> = {
  'judge-me': {
    pageTitle: 'Judge.me für Shopify',
    definition: 'Die Judge.me-Integration bittet den Kunden nach der Lieferung um eine Bewertung, zeigt die Bewertungen auf den Produktseiten und sendet sie als strukturierte Daten an Google. Wir richten die App, den Zeitpunkt der Anfrage, die Darstellung im Theme und den Import bestehender Bewertungen bei der Migration ein, damit nichts verloren geht.',
    shortDescription: 'Produktbewertungen, die nach dem Kauf gesammelt und im Shop und bei Google angezeigt werden.',
    whatItIs: 'Judge.me ist eine Bewertungs-App für Shopify. Offizielle App, die Arbeit liegt im Theme und im Import von der vorherigen Plattform.',
    whyItMatters: 'Bewertungen steigern die Conversion und bringen Sterne bei Google. Verlieren Sie sie bei einer Migration, verlieren Sie beides.',
    steps: stdSteps('Judge.me'), faq: stdFaq('Judge.me', 'Bewertungen'), cta: stdCta('Judge.me'),
    prerequisites: ['Judge.me-Konto', 'Shopify', 'Export der bestehenden Bewertungen'], notIncluded: [],
    dataFlow: ['Bestellung → Bewertungsanfrage', 'Bewertungen im Theme'],
  },
  'klarna': {
    pageTitle: 'Klarna für Shopify',
    definition: 'Die Klarna-Integration bringt Rechnungskauf und Ratenzahlung in den Shopify-Checkout über die Klarna-Zahlungs-App und bucht die Klarna-Auszahlungen auf ein eigenes Verrechnungskonto in der Buchhaltung, damit Gebühren und Auszahlungen pro Periode abgestimmt werden können. Wir richten die App ein, testen den Checkout auf Mobilgerät und Desktop und klären Konten und Umsatzsteuer auf den Gebühren mit Ihrem Steuerberater vor dem Go-live.',
    shortDescription: 'Rechnungskauf und Ratenzahlung im Shopify-Checkout, mit Abrechnung auf ein eigenes Verrechnungskonto in der Buchhaltung.',
    whatItIs: 'Klarna ist der Zahlungsdienst für Jetzt kaufen, später bezahlen. In Shopify ist es eine Zahlungsmethode, kein eigener Checkout.',
    whyItMatters: 'Ratenzahlung erhöht den durchschnittlichen Bestellwert in Mode und Einrichtung. Die Abrechnung muss in der Buchhaltung trotzdem stimmen.',
    steps: stdSteps('Klarna'), faq: stdFaq('Klarna', 'Zahlung'), cta: stdCta('Klarna'),
    prerequisites: ['Klarna-Vertrag', 'Shopify', 'Verrechnungskonto für Klarna in der Buchhaltung'], notIncluded: [],
    dataFlow: ['bezahlte Bestellung', 'Abrechnung → Verrechnungskonto'],
  },
  'klaviyo': {
    pageTitle: 'Klaviyo für Shopify',
    definition: 'Die Klaviyo-Integration sendet Kunden, Bestellungen und Ereignisse aus Shopify an Klaviyo, und wir bauen die Abläufe, die tatsächlich verkaufen: abgebrochener Warenkorb, Willkommen, nach dem Kauf und Rückgewinnung. Wir richten die App, die Segmente und die Einwilligung ein und nehmen die Abläufe bei jeder Migration mit, damit unterwegs nichts verloren geht.',
    shortDescription: 'E-Mail und SMS auf Basis der Kundendaten aus Shopify. Abläufe für abgebrochenen Warenkorb, Willkommen und nach dem Kauf.',
    whatItIs: 'Klaviyo ist die E-Mail- und SMS-Plattform mit der tiefsten Shopify-Anbindung. Die App ist offiziell, die Arbeit liegt in Segmenten, Abläufen und Einwilligung.',
    whyItMatters: 'E-Mail ist der günstigste Kanal, den Sie selbst besitzen. Der abgebrochene Warenkorb allein zahlt sich in den meisten Shops aus.',
    steps: stdSteps('Klaviyo'), faq: stdFaq('Klaviyo', 'E-Mail'), cta: stdCta('Klaviyo'),
    prerequisites: ['Klaviyo-Konto', 'Shopify', 'Consent-Banner, das die Auswahl respektiert'], notIncluded: [],
    dataFlow: ['Kunden + Bestellungen + Ereignisse'],
  },
  'lipscore': {
    pageTitle: 'Lipscore für Shopify',
    definition: 'Die Lipscore-Integration sammelt nach dem Kauf verifizierte Bewertungen und zeigt sie auf den Produktseiten und als Sterne bei Google. Wir richten die Shopify-App von Lipscore, den Zeitpunkt der Anfrage nach der Lieferung und die Darstellung im Theme ein und übernehmen bestehende Bewertungen von der vorherigen Plattform, damit bei der Migration nichts verloren geht.',
    shortDescription: 'Nordische Bewertungsplattform mit verifizierten Käufen, für Shops, die einen nordischen Anbieter wünschen.',
    whatItIs: 'Lipscore ist eine nordische Bewertungsplattform mit nordischem Support. Eine Alternative zu Judge.me für Shops, die einen nordischen Anbieter wünschen.',
    whyItMatters: 'Verifizierte Bewertungen in der Sprache des Kunden wiegen bei nordischen Kunden schwer.',
    steps: stdSteps('Lipscore'), faq: stdFaq('Lipscore', 'Bewertungen'), cta: stdCta('Lipscore'),
    prerequisites: ['Lipscore-Vertrag', 'Shopify'], notIncluded: [],
    dataFlow: ['Bestellung → Anfrage', 'Bewertungen im Theme'],
  },
  'logistra': {
    pageTitle: 'Logistra für Shopify',
    definition: 'Die Logistra-Integration bietet Versandauswahl im Checkout und Etiketten für mehrere Transporteure aus einer einzigen Shopify-App, mit Sendungsverfolgung zurück zur Bestellung und zum Kunden. Wir richten Versandregeln pro Zone und Gewicht ein, verbinden den Etikettenablauf mit dem Lager, das packt, und passen die Einrichtung für B2B-Shops mit Mindestbestellwert und festen Liefertagen an.',
    shortDescription: 'Versandauswahl und Etiketten für mehrere Transporteure, eingerichtet für B2B mit Mindestbestellwert.',
    whatItIs: 'Logistra ist ein norwegisches Versandportal mit Shopify-App. Mehrere Transporteure in einem einzigen Vertrag.',
    whyItMatters: 'Eine Versand-App für alle Transporteure hält den Checkout einfach und die Etiketten einheitlich.',
    steps: stdSteps('Logistra'), faq: stdFaq('Logistra', 'Versand'), cta: stdCta('Logistra'),
    prerequisites: ['Logistra-Konto', 'Shopify', 'Transporteurverträge'], notIncluded: [],
    dataFlow: ['Versandauswahl', 'Etikett', 'Sendungsverfolgung'],
  },
  'marketingplatform': {
    pageTitle: 'MarketingPlatform-Integration für Shopify',
    definition: 'Die MarketingPlatform-Integration sendet neue Newsletter-Anmeldungen aus Shopify an die richtige Liste in MarketingPlatform pro Markt und prüft vor dem Hinzufügen, ob das Profil bereits existiert, damit niemand doppelt landet. Sie läuft als Make.com-Ablauf in Ihrem eigenen Konto, gebaut für Shops, die mit Shopify Markets aus demselben Shopify in mehrere Länder verkaufen.',
    shortDescription: 'Newsletter-Anmeldungen aus Shopify an MarketingPlatform pro Markt, mit Dublettenprüfung.',
    whatItIs: 'MarketingPlatform ist eine nordische E-Mail-Plattform. Shopify hat keine offizielle Anbindung, also ist der Ablauf unserer.',
    whyItMatters: 'Drei Märkte bedeuten drei Listen. Anmeldungen müssen richtig landen, ohne dass jemand sie von Hand verschiebt.',
    steps: stdSteps('MarketingPlatform'), faq: stdFaq('MarketingPlatform', 'E-Mail'), cta: stdCta('MarketingPlatform'),
    prerequisites: ['MarketingPlatform mit API', 'Shopify Markets', 'Make.com-Konto'], notIncluded: [],
    dataFlow: ['Anmeldung → Liste pro Markt'],
  },
  'moodle': {
    pageTitle: 'Moodle-Integration für Shopify',
    definition: 'Die Moodle-Integration gibt dem Kunden Zugang zum richtigen Kurs in Moodle, sobald der Kurs in Shopify gekauft wurde: Ein Benutzer wird angelegt, falls er fehlt, und der Kunde wird in den Kurs eingeschrieben, der dem Produkt entspricht. Sie läuft als Make.com-Szenario in Ihrem eigenen Konto und lässt sich um Zugangszeiträume, Kursstufen und E-Mail-Abläufe erweitern.',
    shortDescription: 'Der Kauf eines Kurses in Shopify gibt automatisch Zugang zum richtigen Kurs in Moodle.',
    whatItIs: 'Moodle ist eine offene Lernplattform. Shopify verkauft den Kurs, Moodle liefert ihn, und der Ablauf dazwischen ist unserer.',
    whyItMatters: 'Kursanbieter, die Teilnehmer von Hand einschreiben, verlieren Zeit und bekommen unzufriedene Kunden, die auf ihren Zugang warten.',
    steps: [
      ['Analyse', 'Welche Produkte welchen Kursen entsprechen, Zugangszeitraum und was bei einer Erstattung passiert.'],
      ['Einrichtung in Make.com', 'Webhook bei bezahlter Bestellung, Abgleich der E-Mail-Adresse in Moodle, Anlegen des Benutzers und Einschreibung über die Moodle-API.'],
      ['Test mit echten Käufen', 'Die ersten Käufe werden vom Checkout bis zum Kurs verfolgt.'],
      ['Go-live und Überwachung', 'Fehler werden mit Bestellnummer und Kurs gemeldet.'],
    ],
    faq: stdFaq('Moodle', 'Kursen'), cta: stdCta('Moodle'),
    prerequisites: ['Moodle mit API-Zugang (Web Services)', 'Shopify', 'Make.com-Konto, wir richten eines ein, falls Sie keines haben'], notIncluded: [],
    dataFlow: ['bezahlte Bestellung → Benutzer + Einschreibung'],
  },
  'nshift': {
    pageTitle: 'nShift-Integration für Shopify',
    definition: 'Die nShift-Integration bündelt die Transporteure in einem Versand-Checkout und einem Etikettensystem, mit allen Transporteuren in einem einzigen Vertrag, für Shops, die aus Shopify Plus in mehrere Länder verkaufen. Wir richten den Checkout, Versandregeln pro Markt und den Etikettenablauf ein und verbinden ihn mit dem Lager, in dem die Ware tatsächlich gepackt wird.',
    shortDescription: 'Mehrere Transporteure in einem Checkout und einem Etikettensystem, für Shops, die in mehrere Länder versenden.',
    whatItIs: 'nShift, früher Unifaun und Consignor, ist eine nordische Versandplattform. Die App bietet Versandauswahl im Checkout und Etiketten für alle Transporteure in einem einzigen Vertrag.',
    whyItMatters: 'Mehr Märkte bedeuten mehr Transporteure. Eine Plattform hält den Checkout einfach und die Etiketten einheitlich.',
    steps: stdSteps('nShift'), faq: stdFaq('nShift', 'Versand'), cta: stdCta('nShift'),
    prerequisites: ['nShift-Konto mit Transporteurverträgen', 'Shopify Plus mit Markets', 'Lager oder 3PL, das packt'], notIncluded: [],
    dataFlow: ['Versandauswahl pro Markt', 'Etikett', 'Sendungsverfolgung'],
  },
  'omnium': {
    pageTitle: 'Omnium-Integration für Shopify',
    definition: 'Die Omnium-Integration macht Omnium zum Bestell- und Lagersystem für Shopify: Bestellungen gehen in Omnium ein, Lagerbestand pro Standort kommt zurück nach Shopify, und Produkte können aus Omnium veröffentlicht werden. EDI-Bestellungen von Coop, XXL und Sport Holding werden in Omnium empfangen und mit GLN und Skonto an Tripletex weitergeleitet. Wir richten den Omnium-Shopify-Konnektor ein und bauen den EDI-Ablauf in Make.com.',
    shortDescription: 'Bestellungen aus Shopify in Omnium, Lagerbestand zurück nach Shopify. EDI-Bestellungen von Coop, XXL und Sport Holding weiter in die Buchhaltung.',
    whatItIs: 'Omnium ist ein norwegisches Order-Management-System für Großhändler und Ketten mit mehreren Kanälen. Der Shopify-Konnektor ist der eigene von Omnium und braucht die richtige Einrichtung von Markt, Lager und Standort-ID, um zu laufen. Der EDI-Teil ist unser Make.com-Ablauf, der die Bestellung mit Kundendaten anreichert und Auftrag, Rechnung und Lieferadresse in Tripletex anlegt.',
    whyItMatters: 'Großhändler, die sowohl an Ketten als auch im eigenen Onlineshop verkaufen, brauchen einen Ort für Bestellungen und Lager. Ohne OMS lebt der Lagerbestand an drei Stellen, und EDI-Bestellungen werden von Hand eingetippt.',
    steps: [
      ['Analyse', 'Märkte, Lager und Standorte in Omnium, welche Kanäle angebunden werden sollen, und welche Ketten EDI senden.'],
      ['Einrichtung des Konnektors', 'Globaler und marktspezifischer Shopify-Konnektor, Standort-ID am Lager und erste Synchronisation der Produkte.'],
      ['EDI-Ablauf in Make.com', 'Webhook aus Omnium, Kundenabgleich, GLN und Skonto, Auftrag und Rechnung in Tripletex.'],
      ['Test und Go-live', 'Zuerst die Testumgebung von Omnium, dann Produktion. Wir verfolgen die ersten EDI-Bestellungen manuell.'],
    ],
    faq: [
      ['Warum bleiben Produkte in Omnium in der Warteschlange hängen?', 'Meistens fehlt die Standort-ID am Lager, die Store-ID hat die falsche Schreibweise, oder der globale Konnektor, der den Synchronisationsjob anstößt, existiert nicht. Wir haben die Checkliste.'],
      ['Kann Omnium das Lager von Shopify ersetzen?', 'Ja. Omnium wird zur führenden Quelle für den Lagerbestand, und Shopify zeigt, was Omnium sagt. Genau das ist der Sinn.'],
      ['Was ist mit EDI von anderen Ketten als Coop, XXL und Sport Holding?', 'Jede neue Kette braucht einen Kunden in der Buchhaltung, die Unternehmensnummer im Mapping, GLN und Skonto. Das ist eine bekannte Aufgabe.'],
      ['Ist das Make.com oder Konnektor?', 'Beides. Die Shopify-Anbindung ist der Konnektor von Omnium. Der EDI-Ablauf in die Buchhaltung ist Make.com in Ihrem Konto.'],
    ],
    cta: stdCta('Omnium'),
    prerequisites: ['Omnium-Tenant mit Shopify-Konnektor', 'Shopify oder Shopify Plus mit Standorten', 'Tripletex oder ein anderes Buchhaltungssystem für den EDI-Ablauf', 'Make.com-Konto für EDI'],
    notIncluded: ['FEFO und Chargenverfolgung. Wird als Zusatz vom Omnium-Team geliefert'],
    dataFlow: ['Bestellungen', 'Lagerbestand', 'EDI-Bestellung → Auftrag + Rechnung', 'Produkte'],
  },
  'ongoing': {
    pageTitle: 'Ongoing WMS-Integration für Shopify',
    definition: 'Die Ongoing WMS-Integration sendet Shopify-Bestellungen an das Fremdlager, das Ongoing nutzt, und bekommt Lagerbestand und Sendungsnummern zurück an Shopify und den Kunden. Wir richten die eigene Shopify-App von Ongoing pro Markt ein, stimmen die Versandmethoden gemeinsam mit dem Lager ab und testen Kommissionierung, Packen, Retouren und Bestandskorrekturen vor dem Go-live.',
    shortDescription: 'Bestellungen ans 3PL-Lager, Lagerbestand und Sendungsverfolgung zurück. Eingerichtet für Shopify Plus mit mehreren Märkten.',
    whatItIs: 'Ongoing WMS ist das Lagersystem, das viele nordische 3PL-Dienstleister nutzen. Der Shop bekommt keinen Zugang zum Lager selbst, sondern zur App, die es mit Shopify verbindet.',
    whyItMatters: 'Wenn das Lager ausgelagert ist, müssen Bestellungen raus und Lagerbestand rein, ohne dass jemand sie anfasst. Fehler bei den Versandmethoden sind die häufigste Ursache für Stillstand.',
    steps: stdSteps('Ongoing'), faq: stdFaq('Ongoing', 'Lager'), cta: stdCta('Ongoing WMS'),
    prerequisites: ['3PL, das Ongoing nutzt', 'Shopify Plus oder Shopify', 'Versandmethoden mit dem Lager abgestimmt'], notIncluded: [],
    dataFlow: ['Bestellungen', 'Lagerbestand + Sendungsverfolgung'],
  },
  'podio': {
    pageTitle: 'Podio-Buchungen nach Shopify',
    definition: 'Die Podio-Integration macht Buchungen in Podio zu Bestellungen in Shopify, sendet Stornierungen zurück an Podio und löst die Rechnung in Tripletex aus, wenn die Miete geliefert wurde, nicht wenn sie gebucht wurde. Sie läuft als Make.com-Abläufe in Ihrem eigenen Konto, mit Zahlungslink, Versandetikett über Profrakt und Abgleich der E-Mail-Adresse.',
    shortDescription: 'Buchungen werden zu Shopify-Bestellungen, Stornierungen gehen zurück, und die Rechnungsstellung wird ausgelöst, wenn die Miete geliefert wurde.',
    whatItIs: 'Podio ist ein flexibles Arbeitswerkzeug, das als Buchungssystem genutzt wird. Shopify ist die Zahlung und der Eingang zur Buchhaltung. Der Ablauf hält beide im Takt.',
    whyItMatters: 'Vermietung folgt nicht dem Rhythmus des Checkouts. Zahlung, Lieferung und Rechnungsstellung passieren an verschiedenen Tagen, und jeder Schritt muss das richtige System treffen.',
    steps: stdSteps('Podio'), faq: stdFaq('Podio', 'Buchungen'), cta: stdCta('Podio'),
    prerequisites: ['Podio-Arbeitsbereich', 'Shopify', 'Make.com-Konto', 'Tripletex für die Rechnungsstellung'], notIncluded: [],
    dataFlow: ['Buchung → Bestellentwurf + Zahlungslink', 'Stornierung', 'Rechnung 72 h nach Lieferung'],
  },
  'poweroffice-go': {
    pageTitle: 'PowerOffice Go-Integration für Shopify',
    definition: 'Die PowerOffice Go-Integration bucht Shopify-Verkäufe als Buchungsjournal in PowerOffice Go, verteilt auf Erlöskonto pro Land und Verrechnungskonto pro Zahlungsart, statt einer Rechnung pro Kunde. Erstattungen werden als Gegenbuchungen erfasst. Sie passt zu B2C-Shops, deren Steuerberater saubere, gesammelte Belege möchte, und läuft als Make.com-Szenario in Ihrem Konto, pro Woche oder pro Monat.',
    shortDescription: 'Shopify-Verkäufe als Buchungsjournal, verteilt auf Erlöskonto und Zahlungsart. Erstattungen werden zurückgebucht.',
    whatItIs: 'PowerOffice Go ist ein norwegisches cloudbasiertes Buchhaltungssystem. Unsere Integration nutzt den Import-Endpunkt für das Buchungsjournal: Jede Bestellung wird zu Soll- und Habenzeilen für Waren und Versand, und die gesamte Periode wird als ein Beleg mit eindeutiger Referenz hochgeladen, damit sie nie doppelt gebucht wird.',
    whyItMatters: 'Für B2C mit vielen kleinen Bestellungen ist eine Rechnung pro Kunde Rauschen. Das Buchungsjournal gibt dem Steuerberater weniger Zeilen zum Abstimmen, und die Auszahlungen von Vipps, Klarna und Karte treffen jeweils ihr eigenes Verrechnungskonto.',
    steps: stdSteps('PowerOffice Go'), faq: stdFaq('PowerOffice Go', 'dem Buchungsjournal'), cta: stdCta('PowerOffice Go'),
    prerequisites: ['PowerOffice Go mit API-Schlüssel und Abonnementschlüssel', 'Kontenplan und Umsatzsteuercodes mit dem Steuerberater abgestimmt', 'Shopify oder Shopify Plus', 'Make.com-Konto auf Ihren Namen'],
    notIncluded: ['Kundenstammdaten. Das Buchungsjournal ist per Design anonym', 'Lager. Shopify ist die führende Quelle'],
    dataFlow: ['Verkäufe → Buchungsjournal', 'Erstattung → Gegenbuchung'],
  },
}

const KEYS = Object.keys(T)

// Translate a single-span portable text block list, keeping keys/types/style/markDefs.
function translateBlocks(blocks: Doc[] | undefined, text: string, field: string, id: string): Doc[] {
  if (!blocks || blocks.length === 0) return []
  if (blocks.length !== 1 || (blocks[0].children?.length ?? 0) !== 1) throw new Error(`${id}: ${field} has ${blocks.length} blocks; update the script`)
  const b = blocks[0]
  return [{ ...b, children: [{ ...b.children[0], text }] }]
}

function buildDe(no: Doc, key: string, extMap: Record<string, string | null>): Doc {
  const t = T[key]
  const steps = no.implementationSteps ?? []
  const faq = no.faq ?? []
  const flows = no.dataFlowSteps ?? []
  if (steps.length !== t.steps.length) throw new Error(`${no._id}: ${steps.length} steps vs ${t.steps.length} translations`)
  if (faq.length !== t.faq.length) throw new Error(`${no._id}: ${faq.length} faq vs ${t.faq.length} translations`)
  if (flows.length !== t.dataFlow.length) throw new Error(`${no._id}: ${flows.length} dataFlowSteps vs ${t.dataFlow.length} translations`)
  if ((no.prerequisites ?? []).length !== t.prerequisites.length) throw new Error(`${no._id}: prerequisites count mismatch`)
  if ((no.notIncluded ?? []).length !== t.notIncluded.length) throw new Error(`${no._id}: notIncluded count mismatch`)
  if ((no.sections ?? []).length || (no.intro ?? []).length || no.seoExtended) throw new Error(`${no._id}: has sections/intro/seoExtended; add translations to the script`)
  const catKey = (no.category?._ref as string | undefined)?.match(/^integration-cat-(.+)-no$/)?.[1]
  if (!catKey) throw new Error(`${no._id}: unexpected category ref ${no.category?._ref}`)
  const words = t.definition.trim().split(/\s+/).length
  if (words < 40 || words > 60) throw new Error(`${no._id}: definition has ${words} words`)

  // Remap references; external pages without a German counterpart are dropped.
  const remap = (refs: Doc[] | undefined) => (refs ?? []).flatMap((r: Doc) => {
    const id = toDe(r._ref, extMap)
    if (!id) { console.log(dataset, no._id, 'skipping ref without de counterpart', r._ref); return [] }
    return [weak(id, r._key)]
  })

  const { _id, _rev, _createdAt, _updatedAt, ...rest } = no
  return {
    ...rest,
    _id: `integration-${key}-de`,
    language: 'de',
    slug: { _type: 'slug', current: `integrations/${key}` },
    pageTitle: t.pageTitle,
    definition: t.definition,
    shortDescription: t.shortDescription,
    intro: [],
    sections: [],
    whatItIs: translateBlocks(no.whatItIs, t.whatItIs, 'whatItIs', no._id),
    whyItMatters: translateBlocks(no.whyItMatters, t.whyItMatters, 'whyItMatters', no._id),
    implementationSteps: steps.map((s: Doc, i: number) => ({ ...s, name: t.steps[i][0], text: t.steps[i][1] })),
    prerequisites: t.prerequisites,
    notIncluded: t.notIncluded,
    faq: faq.map((f: Doc, i: number) => ({ ...f, question: t.faq[i][0], answer: t.faq[i][1] })),
    cta: { ...(no.cta ?? {}), ...t.cta },
    dataFlowSteps: flows.map((f: Doc, i: number) => {
      const frequency = FREQ[f.frequency]
      if (f.frequency && !frequency) throw new Error(`${no._id}: unknown frequency "${f.frequency}"`)
      return { ...f, payload: t.dataFlow[i], ...(f.frequency ? { frequency } : {}) }
    }),
    category: weak(`integration-cat-${catKey}-de`),
    pillar: weak('pillar-integrasjoner-de'),
    clusterLinks: remap(no.clusterLinks),
    relatedPages: remap(no.relatedPages),
    relatedCaseStudies: no.relatedCaseStudies ?? [],
  }
}

async function main() {
  const ids = KEYS.map((k) => `integration-${k}-no`)
  const docs = await client.fetch<Doc[]>('*[_id in $ids]', { ids })
  const byId = new Map(docs.map((d) => [d._id, d]))
  const missing = ids.filter((id) => !byId.has(id))
  if (missing.length) throw new Error(`missing Norwegian documents: ${missing.join(', ')}`)

  // External (non -no suffixed) references → the German document of the same type, if any.
  const extIds = new Set<string>()
  for (const d of docs) for (const r of [...(d.clusterLinks ?? []), ...(d.relatedPages ?? [])]) if (!r._ref.endsWith('-no')) extIds.add(r._ref)
  const extDocs = await client.fetch<{ _id: string; _type: string }[]>('*[_id in $ids]{_id,_type}', { ids: [...extIds] })
  const extMap: Record<string, string | null> = {}
  for (const e of extDocs) {
    extMap[e._id] = await client.fetch<string | null>('*[_type == $type && language == "de"][0]._id', { type: e._type })
    console.log(dataset, 'external', e._type, e._id, '→', extMap[e._id] ?? '(none, skipped)')
  }
  for (const id of extIds) if (!(id in extMap)) { extMap[id] = null; console.log(dataset, 'external ref not found', id, '(skipped)') }

  for (const key of KEYS) {
    const no = byId.get(`integration-${key}-no`)!
    const de = buildDe(no, key, extMap)
    await client.createOrReplace(de as { _id: string; _type: string } & Doc)
    console.log(dataset, 'wrote', de._id, `(${de.definition.split(/\s+/).length} words in definition)`)
    const metaId = `integration-${key}-meta`
    const meta = await client.fetch<Doc | null>('*[_id == $id][0]', { id: metaId })
    if (!meta) throw new Error(`${metaId} is missing; run the en script first`)
    if ((meta.translations ?? []).some((tr: Doc) => tr._key === 'de')) {
      console.log(dataset, metaId, 'already has de')
      continue
    }
    await client.patch(metaId).insert('after', 'translations[-1]', [
      { _key: 'de', value: { _type: 'reference', _ref: de._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
    ]).commit()
    console.log(dataset, 'patched', metaId, 'with de')
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
