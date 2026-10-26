// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-de-1.ts --with-user-token
// Creates the German (de) versions of the integrations pillar, the 8 integration
// categories and 12 integration pages (batch 1 of 3) from their Norwegian
// sources, and adds the de entry to each translation.metadata. Idempotent:
// createOrReplace on fixed ids, and the metadata patch only runs when no 'de'
// key exists. References are weak so the three batches can run in any order.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const CATEGORY_KEYS = ['betaling', 'booking', 'erp', 'logistikk', 'markedsforing', 'oms', 'pim', 'pos']
const INTEGRATIONS = ['24sevenoffice', 'bring', 'business-central', 'datafeedwatch', 'dintero', 'emfas', 'feed', 'fiken', 'front-systems', 'google-sheets', 'holio', 'izy']
const SOURCE_IDS = ['pillar-integrasjoner-no', ...CATEGORY_KEYS.map((k) => `integration-cat-${k}-no`), ...INTEGRATIONS.map((x) => `integration-${x}-no`)]

// Norwegian page ids (non-template documents) → their document type. The
// German counterpart is looked up at runtime by type + language == "de".
const PAGE_TYPE: Record<string, string> = {
  '1368ee2e-b89e-44e4-ac40-36fd19f2c879': 'allPackagesPage',
  '46bf58c8-302e-4fb2-bebe-5c6f505a97b3': 'partnersPage',
  'b6bda7fa-b329-48d0-8aed-e73335edf5ec': 'migratePage',
  '893a0019-404e-4c88-ae34-ae35fc49cce8': 'vippsHurtigkassePage',
  'f7ff26d7-2ad7-4761-a4bd-eab870dfbda9': 'shopifyXPimPage',
  '63c2d5f4-7e53-4d86-9fea-e1069542a939': 'shopifyPosPage',
}
const PAGE_ID_MAP: Record<string, string> = {}

// ---------------------------------------------------------------------------
// Translations. Exact Norwegian string → German (Sie-form). Anything not found
// here (or in the patterns below) makes the script fail, so nothing Norwegian
// leaks. Norwegian products keep their names and are described as Norwegian
// where it matters; no availability claims for Germany, no prices.
// ---------------------------------------------------------------------------
const D: Record<string, string> = {
  // Shared
  'Book en samtale': 'Gespräch vereinbaren',
  'Vi svarer med metode, dataflyt og tidsplan innen to virkedager.': 'Wir antworten innerhalb von zwei Werktagen mit Methode, Datenfluss und Zeitplan.',
  'Fortell oss hvilke systemer du har, så får du metode, dataflyt og tidsplan innen to virkedager.': 'Sagen Sie uns, welche Systeme Sie haben, und Sie erhalten innerhalb von zwei Werktagen Methode, Datenfluss und Zeitplan.',
  'Hvem eier integrasjonen etterpå?': 'Wem gehört die Integration danach?',
  'Du. Make.com-scenarioer ligger i din konto, kode leveres med kildekode.': 'Ihnen. Make.com-Szenarien liegen in Ihrem Konto, Code wird mit Quellcode geliefert.',
  'Hva skjer når en kjøring feiler?': 'Was passiert, wenn ein Lauf fehlschlägt?',
  'Hver kjøring ligger i historikken. Feil varsles med referanse, og vi rydder opp sammen.': 'Jeder Lauf liegt in der Historie. Fehler werden mit Referenz gemeldet, und wir räumen gemeinsam auf.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen.': 'Jeder Lauf liegt in der Historie mit Ein- und Ausgabedaten. Fehler werden mit Referenz gemeldet, und wir räumen gemeinsam auf.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen. Det finnes ingen automatisk tilbakerulling, og det sier vi rett ut.': 'Jeder Lauf liegt in der Historie mit Ein- und Ausgabedaten. Fehler werden mit Referenz gemeldet, und wir räumen gemeinsam auf. Ein automatisches Rollback gibt es nicht, und das sagen wir offen.',
  'Make.com eller egen kode?': 'Make.com oder eigener Code?',
  'Make.com når flyten er greiner og oppslag og du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum eller behov for testmiljø.': 'Make.com, wenn der Ablauf aus Verzweigungen und Abfragen besteht und Sie einen Lauf selbst öffnen können möchten. Eigener Code, wenn viel Transformation, hohes Volumen oder Bedarf an einer Testumgebung besteht.',
  'De som står på denne siden kjører vi i dag. Står ikke ditt system her, kan vi som regel koble det likevel, enten via API i Make.com eller som egen kode.': 'Die auf dieser Seite genannten betreiben wir heute. Steht Ihr System nicht hier, können wir es in der Regel trotzdem anbinden, entweder per API in Make.com oder als eigenen Code.',
  'Ja. Make.com-scenarioer ligger i din konto, og kode leveres med kildekode. Vi drifter om du vil, men du er ikke låst til oss.': 'Ja. Make.com-Szenarien liegen in Ihrem Konto, und Code wird mit Quellcode geliefert. Wir betreiben die Integration, wenn Sie möchten, aber Sie sind nicht an uns gebunden.',
  'Ja. De fleste starter med én flyt, for eksempel ordre, og legger til lager eller kunder etterpå.': 'Ja. Die meisten starten mit einem Ablauf, zum Beispiel Bestellungen, und ergänzen Lager oder Kunden später.',
  'Hvor lang tid tar oppsettet?': 'Wie lange dauert die Einrichtung?',
  'Make.com-flyter leveres på dager når kartleggingen er gjort. Egen kode tar lenger, og vi gir tidsplan etter første samtale.': 'Make.com-Abläufe liefern wir innerhalb von Tagen, sobald die Bestandsaufnahme abgeschlossen ist. Eigener Code dauert länger, und wir nennen den Zeitplan nach dem ersten Gespräch.',
  'Kartlegging': 'Bestandsaufnahme',
  'Oppsett': 'Einrichtung',
  'Tilkobling i din egen konto, mapping av felt, og testdata gjennom hele flyten.': 'Verbindung in Ihrem eigenen Konto, Mapping der Felder und Testdaten durch den gesamten Ablauf.',
  'Test på reelle data': 'Test mit echten Daten',
  'De første ordrene eller produktene følges manuelt før vi slår på alt.': 'Die ersten Bestellungen oder Produkte werden manuell begleitet, bevor wir alles einschalten.',
  'Go-live og overvåking': 'Go-live und Überwachung',
  'Vi følger de første ukene. Feil varsles med referanse til ordren.': 'Wir begleiten die ersten Wochen. Fehler werden mit Referenz auf die Bestellung gemeldet.',
  'Shopify': 'Shopify',
  'Shopify eller Shopify Plus': 'Shopify oder Shopify Plus',
  'Shopify Plus': 'Shopify Plus',
  'Make.com-konto': 'Make.com-Konto',
  'Make.com-konto i ditt navn': 'Make.com-Konto auf Ihren Namen',
  'Lager': 'Lagerbestand',
  'Attributtmodell avklart': 'Attributmodell geklärt',
  // data-flow frequencies and payloads
  'sanntid': 'Echtzeit',
  'løpende': 'laufend',
  'daglig': 'täglich',
  'ved pakking': 'beim Verpacken',
  'ved publisering': 'bei Veröffentlichung',
  'ordre + kunde → faktura': 'Bestellung + Kunde → Rechnung',
  'betaling registrert': 'Zahlung registriert',
  'refusjon → kreditnota': 'Erstattung → Gutschrift',
  'fraktvalg i kassen': 'Versandoptionen im Checkout',
  'etikett': 'Etikett',
  'sporing': 'Sendungsverfolgung',
  'varer + priser + lager': 'Artikel + Preise + Lagerbestand',
  'ordre + kunder': 'Bestellungen + Kunden',
  'fakturastatus': 'Rechnungsstatus',
  'produkter': 'Produkte',
  'feed per kanal': 'Feed pro Kanal',
  'betalt ordre': 'bezahlte Bestellung',
  'produkter + attributter + bilder': 'Produkte + Attribute + Bilder',
  'produkter + varianter + bilder': 'Produkte + Varianten + Bilder',
  'ordre + kunde → salg': 'Bestellung + Kunde → Verkauf',
  'varer + lager': 'Artikel + Lagerbestand',
  'ordre → ordreark': 'Bestellung → Bestellliste',
  'ordre': 'Bestellungen',
  'lager + sporing': 'Lagerbestand + Sendungsverfolgung',
  'booking → ordre': 'Buchung → Bestellung',
  'kansellering': 'Stornierung',
  // system names that are phrases, not product names
  'Google og Meta': 'Google und Meta',
  'De fleste butikkene vi har migrert': 'Die meisten Shops, die wir migriert haben',

  // Pillar
  'Shopify koblet til systemene du allerede bruker': 'Shopify verbunden mit den Systemen, die Sie bereits nutzen',
  'En Shopify-integrasjon kobler nettbutikken til systemene som driver resten av selskapet: regnskap, ordrehåndtering, lager, frakt, betaling og markedsføring. Vi bygger dem i Make.com når flyten skal være synlig og enkel å endre, og som egen kode når volum eller logikk krever det. Dokumentert dataflyt, og du eier scenarioet i din egen konto.':
    'Eine Shopify-Integration verbindet den Onlineshop mit den Systemen, die den Rest des Unternehmens steuern: Buchhaltung, Auftragsabwicklung, Lager, Versand, Zahlung und Marketing. Wir bauen sie in Make.com, wenn der Ablauf sichtbar und leicht änderbar sein soll, und als eigenen Code, wenn Volumen oder Logik es erfordern. Dokumentierter Datenfluss, und Sie besitzen das Szenario in Ihrem eigenen Konto.',
  'Hvem eier integrasjonen': 'Wem die Integration gehört',
  'Make.com-scenarioer settes opp i din egen Make-konto med dine tilkoblinger. Kode leveres med kildekode i ditt repo. Vi drifter om du vil, men du er aldri låst til oss.': 'Make.com-Szenarien werden in Ihrem eigenen Make-Konto mit Ihren Verbindungen eingerichtet. Code wird mit Quellcode in Ihrem Repository geliefert. Wir betreiben die Integration, wenn Sie möchten, aber Sie sind nie an uns gebunden.',
  'Hva skjer når noe feiler': 'Was passiert, wenn etwas fehlschlägt',
  'Hver kjøring ligger i historikken med inn- og utdata per modul. Feil varsles med referanse til ordren. Det finnes ingen automatisk tilbakerulling, og vi rydder opp sammen når det trengs.': 'Jeder Lauf liegt in der Historie mit Ein- und Ausgabedaten pro Modul. Fehler werden mit Referenz auf die Bestellung gemeldet. Ein automatisches Rollback gibt es nicht, und wir räumen gemeinsam auf, wenn es nötig ist.',
  'Shopify eller systemet som fasit': 'Shopify oder das System als führende Quelle',
  'For regnskap er Shopify fasit og regnskapet mottaker. For OMS og enkelte ERP, som Omnium, UniMicro og TRIMIT, er systemet fasit for lager og Shopify viser det. Vi avklarer dette først, fordi det styrer alt annet.': 'Für die Buchhaltung ist Shopify führend und die Buchhaltung Empfänger. Bei OMS und einigen ERP-Systemen, wie Omnium, UniMicro und TRIMIT, ist das System für den Lagerbestand führend und Shopify zeigt ihn an. Das klären wir zuerst, weil es alles Weitere bestimmt.',
  'Systemet ditt står ikke på listen': 'Ihr System steht nicht auf der Liste',
  'Har systemet et API, kan vi som regel koble det. Send oss hva du har, så svarer vi med metode og tidsplan.': 'Hat das System eine API, können wir es in der Regel anbinden. Schicken Sie uns, was Sie haben, und wir antworten mit Methode und Zeitplan.',
  'Make.com eller egen kode, hvordan velger dere?': 'Make.com oder eigener Code, wie entscheiden Sie?',
  'Make.com når flyten er greiner og oppslag, og når du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum, eller behov for versjonskontroll og testmiljø. De fleste regnskaps- og OMS-integrasjoner er Make.com.': 'Make.com, wenn der Ablauf aus Verzweigungen und Abfragen besteht und Sie einen Lauf selbst öffnen können möchten. Eigener Code, wenn viel Transformation, hohes Volumen oder Bedarf an Versionskontrolle und Testumgebung besteht. Die meisten Buchhaltungs- und OMS-Integrationen sind Make.com.',
  'Systemet mitt står ikke på listen. Kan dere likevel?': 'Mein System steht nicht auf der Liste. Geht es trotzdem?',
  'Som regel ja, hvis systemet har et API. Send oss hva du har.': 'In der Regel ja, wenn das System eine API hat. Schicken Sie uns, was Sie haben.',
  'Fortell oss hvilke systemer du har': 'Sagen Sie uns, welche Systeme Sie haben',

  // Categories
  'Betaling': 'Zahlung',
  'Betalingsintegrasjoner dekker kassen og oppgjøret. Vipps Hurtigkasse, Klarna, Dintero og Shopify Payments settes opp og testes, og utbetalingene føres mot riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.':
    'Zahlungsintegrationen decken Checkout und Abrechnung ab. Klarna, Dintero und Shopify Payments sowie Vipps Hurtigkasse für Shops, die in Norwegen verkaufen, werden eingerichtet und auf dem Smartphone und im Checkout getestet, und die Auszahlungen werden in der Buchhaltung auf die richtige Zahlungsart gebucht, sodass Bank und Buchführung ohne manuelle Abstimmung übereinstimmen.',
  'Booking og annet': 'Buchung und anderes',
  'Når salget starter et annet sted enn i kassen. Bookinger fra Podio og IZY blir Shopify-ordre, brukere opprettes i Moodle når et kurs er kjøpt, og skjemaer havner i Google Sheets. Make.com-flyter som er lette å lese og endre.':
    'Wenn der Verkauf woanders beginnt als im Checkout. Buchungen aus Podio und IZY werden zu Shopify-Bestellungen, Nutzer werden in Moodle angelegt, sobald ein Kurs gekauft ist, und Formulare landen in Google Sheets. Make.com-Abläufe, die leicht zu lesen und zu ändern sind, in Ihrem eigenen Konto.',
  'ERP og økonomi': 'ERP und Buchhaltung',
  'En regnskapsintegrasjon flytter betalte ordre fra Shopify til regnskapssystemet som faktura, salgsbilag eller bilagsjournal, med kunde, mva og frakt på riktig konto. Refusjoner blir kreditnota. Vi kjører dette i dag mot Tripletex, 24SevenOffice, PowerOffice Go og Fiken, som Make.com-scenarioer i din egen konto. Fakturaer sendes ikke før regnskapsfører har sett dem.':
    'Eine Buchhaltungsintegration überträgt bezahlte Bestellungen aus Shopify als Rechnung, Verkaufsbeleg oder Buchungsjournal in das Buchhaltungssystem, mit Kunde, MwSt. und Versand auf dem richtigen Konto. Erstattungen werden zu Gutschriften. Wir betreiben das heute mit Tripletex, 24SevenOffice, PowerOffice Go und Fiken, als Make.com-Szenarien in Ihrem eigenen Konto. Rechnungen werden erst versendet, wenn die Buchhaltung sie gesehen hat.',
  'Logistikk og frakt': 'Logistik und Versand',
  'Fraktintegrasjoner gir riktige fraktvalg i kassen, etiketter fra ordren og sporing tilbake til kunden. Vi jobber med Bring, Profrakt, nShift, Logistra og Quickship, som offisielle apper eller Make.com-flyter når etiketten skal utløses fra et annet system enn Shopify.':
    'Versandintegrationen liefern die richtigen Versandoptionen im Checkout, Etiketten aus der Bestellung und Sendungsverfolgung zurück zum Kunden. Wir arbeiten mit Bring, Profrakt, nShift, Logistra und Quickship, als offizielle Apps oder als Make.com-Abläufe, wenn das Etikett aus einem anderen System als Shopify ausgelöst werden soll, zum Beispiel einem OMS.',
  'Markedsføring og sporing': 'Marketing und Tracking',
  'Kundedata og hendelser fra Shopify til verktøyene som driver salget: Klaviyo og MarketingPlatform for e-post og SMS, Tracklution for server-side sporing til Meta, Google og affiliate, og Judge.me eller Lipscore for anmeldelser.':
    'Kundendaten und Ereignisse aus Shopify in die Tools, die den Verkauf antreiben: Klaviyo und MarketingPlatform für E-Mail und SMS, Tracklution für serverseitiges Tracking zu Meta, Google und Affiliate, und Judge.me oder Lipscore für Bewertungen. So eingerichtet, dass jeder Kanal dieselben Bestellungen und Kunden sieht.',
  'OMS, lager og EDI': 'OMS, Lager und EDI',
  'Et ordrehåndteringssystem samler ordre fra nettbutikk, butikk og EDI på ett sted, og styrer lager og plukk. Vi kobler Shopify til Omnium, Holio og Ongoing, slik at ordre går inn og lager kommer tilbake, og EDI-ordre fra kjedene flyter videre til regnskap uten manuell punching.':
    'Ein Order-Management-System sammelt Bestellungen aus Onlineshop, Ladengeschäft und EDI an einem Ort und steuert Lager und Kommissionierung. Wir verbinden Shopify mit Omnium, Holio und Ongoing, sodass Bestellungen hineingehen und Lagerbestände zurückkommen, und EDI-Bestellungen der Handelsketten ohne manuelle Eingabe weiter in die Buchhaltung fließen.',
  'PIM og produktdata': 'PIM und Produktdaten',
  'Produktdata som eies i PIM eller leverandørfeed og publiseres til Shopify med varianter, bilder og attributter. Vi setter opp Vuuh, DatafeedWatch og Google Merchant Center slik at produktdata har én fasit og nettbutikk, markedsplasser og annonser får samme innhold.':
    'Produktdaten, die im PIM oder Lieferantenfeed gepflegt und mit Varianten, Bildern und Attributen nach Shopify veröffentlicht werden. Wir richten Vuuh, DataFeedWatch und Google Merchant Center so ein, dass Produktdaten eine führende Quelle haben und Onlineshop, Marktplätze und Anzeigen denselben Inhalt erhalten, ohne manuelles Kopieren zwischen den Kanälen.',
  'POS og butikk': 'POS und Ladengeschäft',
  'Butikk og nettbutikk på samme varelager og kundebase. Vi setter opp Shopify POS, kobler Front Systems til Shopify Plus, og flytter kunder fra PCKasse med gavekort og kundedata intakt.':
    'Ladengeschäft und Onlineshop auf demselben Lagerbestand und derselben Kundenbasis. Wir richten Shopify POS ein, verbinden Front Systems mit Shopify Plus und übernehmen Kunden aus dem norwegischen Kassensystem PCKasse mit Geschenkkarten und Kundendaten intakt, sodass Kasse und Website aus ein und demselben Lager verkaufen.',

  // 24SevenOffice
  '24SevenOffice og Finago-integrasjon for Shopify': '24SevenOffice- und Finago-Integration für Shopify',
  'Finago og 24SevenOffice er samme system. Faktura per ordre med betaling registrert, refusjoner som kreditnota.': 'Finago und 24SevenOffice sind dasselbe System. Rechnung pro Bestellung mit registrierter Zahlung, Erstattungen als Gutschrift.',
  '24SevenOffice-integrasjonen oppretter en faktura i 24SevenOffice for hver betalte Shopify-ordre, med kunde, linjer, frakt og riktig salgstype, og registrerer betalingen mot betalingsmåten ordren ble betalt med. Refusjoner i Shopify blir kreditnota. Flyten går én vei fra Shopify og kjører som Make.com-scenario i din egen konto, med REST for faktura og SOAP for betalingsregistrering.':
    'Die 24SevenOffice-Integration erstellt für jede bezahlte Shopify-Bestellung eine Rechnung in 24SevenOffice, mit Kunde, Positionen, Versand und Verkaufsart, und registriert die Zahlung auf die Zahlungsart, mit der die Bestellung bezahlt wurde. Erstattungen in Shopify werden zu Gutschriften. Der Ablauf läuft nur in eine Richtung, als Make.com-Szenario in Ihrem eigenen Konto, mit REST für Rechnungen und SOAP für die Zahlungsregistrierung.',
  '24SevenOffice, tidligere Finago, er et norsk regnskapssystem med både moderne REST-API og eldre SOAP-tjenester. Integrasjonen bruker begge: faktura og kunde opprettes via REST, betalingen registreres via SOAP fordi det bare finnes der. Salgstype og dimensjoner settes per ordre, slik at B2C og utland havner på riktig konto.':
    '24SevenOffice, früher Finago, ist ein norwegisches Buchhaltungssystem mit sowohl einer modernen REST-API als auch älteren SOAP-Diensten. Die Integration nutzt beide: Rechnung und Kunde werden per REST angelegt, die Zahlung per SOAP registriert, weil sie nur dort verfügbar ist. Verkaufsart und Dimensionen werden pro Bestellung gesetzt, sodass B2C und Ausland auf dem richtigen Konto landen.',
  'Uten betalingsregistrering må regnskapsfører avstemme hver Shopify-faktura manuelt mot utbetalingene. Med integrasjonen er fakturaen både opprettet og betalt i regnskapet når ordren er betalt i Shopify, og kreditnotaen kommer av seg selv ved refusjon.':
    'Ohne Zahlungsregistrierung muss die Buchhaltung jede Shopify-Rechnung manuell mit den Auszahlungen abstimmen. Mit der Integration ist die Rechnung in der Buchhaltung bereits erstellt und bezahlt, sobald die Bestellung in Shopify bezahlt ist, und die Gutschrift kommt bei einer Erstattung von selbst.',
  'Salgstyper, betalingsmåter per gateway, dimensjoner for avdeling og land, og mva på frakt.': 'Verkaufsarten, Zahlungsarten pro Gateway, Dimensionen für Abteilung und Land sowie MwSt. auf Versand.',
  'Oppsett i Make.com': 'Einrichtung in Make.com',
  'REST- og SOAP-tilganger fra 24SevenOffice, scenario for ordre og for refusjoner i din konto.': 'REST- und SOAP-Zugänge von 24SevenOffice, ein Szenario für Bestellungen und eines für Erstattungen in Ihrem Konto.',
  'Test på reelle ordre': 'Test mit echten Bestellungen',
  'Første ordre, første refusjon og en ordre med flere betalingsmåter følges manuelt.': 'Die erste Bestellung, die erste Erstattung und eine Bestellung mit mehreren Zahlungsarten werden manuell begleitet.',
  'Nattlig sveip fanger refusjoner som webhook-kallet ikke rakk.': 'Ein nächtlicher Durchlauf fängt Erstattungen ab, die der Webhook-Aufruf verpasst hat.',
  '24SevenOffice med REST- og SOAP-tilgang': '24SevenOffice mit REST- und SOAP-Zugang',
  'Betalingsmåter satt opp i 24SevenOffice per gateway': 'Zahlungsarten in 24SevenOffice pro Gateway eingerichtet',
  'Lager. Shopify er fasit': 'Lagerbestand. Shopify ist führend',
  'Produktsynk fra 24SevenOffice. Produkter opprettes ved første salg': 'Produktsynchronisation aus 24SevenOffice. Produkte werden beim ersten Verkauf angelegt',
  'Hvorfor både REST og SOAP?': 'Warum sowohl REST als auch SOAP?',
  'Betalingsregistrering finnes bare i SOAP-tjenesten til 24SevenOffice. Faktura og kunde går via REST. Vi håndterer sesjonen mellom dem.': 'Die Zahlungsregistrierung gibt es nur im SOAP-Dienst von 24SevenOffice. Rechnung und Kunde laufen über REST. Wir verwalten die Sitzung zwischen beiden.',
  'Er det Finago eller 24SevenOffice?': 'Ist es Finago oder 24SevenOffice?',
  'Samme produkt. Finago var navnet i enkelte markeder. Integrasjonen er den samme.': 'Dasselbe Produkt. Finago war der Name in einigen Märkten. Die Integration ist dieselbe.',
  'Hva med gavekort og delbetaling?': 'Was ist mit Geschenkkarten und Teilzahlung?',
  'Betalingen registreres per betalingsmåte. Gavekortdelen føres ikke mot bank. Vi avklarer oppsettet med regnskapsfører.': 'Die Zahlung wird pro Zahlungsart registriert. Der Geschenkkartenanteil wird nicht gegen die Bank gebucht. Die Einrichtung klären wir mit Ihrer Buchhaltung.',
  'Eier vi scenarioet?': 'Gehört uns das Szenario?',
  'Ja, det ligger i din Make-konto med dine tilganger.': 'Ja, es liegt in Ihrem Make-Konto mit Ihren Zugängen.',

  // Bring
  'Bring-integrasjon for Shopify': 'Bring-Integration für Shopify',
  'Fraktvalg i kassen, etiketter og sporing tilbake på ordren. Standard i hver migrering.': 'Versandoptionen im Checkout, Etiketten und Sendungsverfolgung zurück auf der Bestellung. Standard bei jeder Migration.',
  'Bring-integrasjonen gir riktige fraktvalg og hentesteder i Shopify-kassen, etiketter fra ordren og sporing tilbake til kunden. Vi setter opp Bring sin offisielle app med avtalenummer og fraktregler, og tester kassen på mobil før go-live. Det er en fast del av hver Shopify-migrering vi gjør.':
    'Die Bring-Integration liefert die richtigen Versandoptionen und Abholstationen im Shopify-Checkout, Etiketten aus der Bestellung und Sendungsverfolgung zurück zum Kunden. Wir richten die offizielle Bring-App mit Vertragsnummer und Versandregeln ein und testen den Checkout auf dem Smartphone vor dem Go-live. Für Shops, die in Norwegen verkaufen, ist das ein fester Bestandteil jeder Shopify-Migration, die wir durchführen.',
  'Bring er Posten sin bedriftsdel. Appen kobler avtalen din til Shopify og håndterer pakke i postkassen, hentested og hjemlevering.': 'Bring ist der Geschäftskundenbereich der norwegischen Post (Posten). Die App verbindet Ihren Vertrag mit Shopify und übernimmt Briefkastenpaket, Abholstation und Hauszustellung.',
  'Fraktvalg er det første kunden ser i kassen. Feil priser eller manglende hentested koster konvertering.': 'Die Versandoptionen sind das Erste, was der Kunde im Checkout sieht. Falsche Preise oder eine fehlende Abholstation kosten Conversion.',
  'Bring-avtale med API-nøkkel': 'Bring-Vertrag mit API-Schlüssel',
  'Shopify med Carrier Service, Plus eller tillegg': 'Shopify mit Carrier Service, Plus oder Zusatzoption',
  'Fraktregler per sone': 'Versandregeln pro Zone',

  // Business Central
  'Business Central-integrasjon for Shopify': 'Business Central-Integration für Shopify',
  'Microsoft sin Shopify-konnektor satt opp riktig: varer og lager fra ERP, ordre og kunder tilbake.': 'Microsofts Shopify-Konnektor richtig eingerichtet: Artikel und Lagerbestand aus dem ERP, Bestellungen und Kunden zurück.',
  'Business Central-integrasjonen kobler Microsoft Dynamics 365 Business Central til Shopify med Microsoft sin egen Shopify-konnektor. Varer, priser og lager kommer fra ERP, ordre og kunder går tilbake, og faktura opprettes i Business Central. Vi gjør kartlegging av varegrupper, lokasjoner og betalingsmåter, setter opp konnektoren og tester hele flyten før go-live.':
    'Die Business Central-Integration verbindet Microsoft Dynamics 365 Business Central über Microsofts eigenen Shopify-Konnektor mit Shopify. Artikel, Preise und Lagerbestand kommen aus dem ERP, Bestellungen und Kunden gehen zurück, und die Rechnung wird in Business Central erstellt. Wir nehmen Artikelgruppen, Lagerorte und Zahlungsarten auf, richten den Konnektor ein und testen den gesamten Ablauf vor dem Go-live.',
  'Business Central er Microsoft sitt ERP for mellomstore selskaper. Shopify-konnektoren er innebygd i Business Central, men krever at varer, lokasjoner, kunder og betalingsmåter er satt opp slik Shopify forventer dem.': 'Business Central ist Microsofts ERP für mittelständische Unternehmen. Der Shopify-Konnektor ist in Business Central integriert, setzt aber voraus, dass Artikel, Lagerorte, Kunden und Zahlungsarten so eingerichtet sind, wie Shopify sie erwartet.',
  'Selskaper på Business Central har ERP som fasit. Nettbutikken må følge ERP, ellers selger den varer som ikke finnes.': 'Unternehmen auf Business Central haben das ERP als führendes System. Der Onlineshop muss dem ERP folgen, sonst verkauft er Artikel, die es nicht gibt.',
  'Business Central med Shopify-konnektor aktivert': 'Business Central mit aktiviertem Shopify-Konnektor',
  'Varegrupper, lokasjoner og betalingsmåter avklart med regnskap': 'Artikelgruppen, Lagerorte und Zahlungsarten mit der Buchhaltung geklärt',

  // DataFeedWatch
  'DataFeedWatch for Shopify': 'DataFeedWatch für Shopify',
  'Produktfeed fra Shopify til Google Shopping, Meta og prissammenligning, med regler per kanal.': 'Produktfeed aus Shopify zu Google Shopping, Meta und Preisvergleich, mit Regeln pro Kanal.',
  'DataFeedWatch-integrasjonen tar produktene fra Shopify og lager optimaliserte feeder til Google Merchant Center, Meta og prissammenligningstjenester, med regler for titler, kategorier og ekskluderinger per kanal. Vi setter opp feedene og regelsettet, og følger feilmeldingene fra Merchant Center.':
    'Die DataFeedWatch-Integration nimmt die Produkte aus Shopify und erstellt optimierte Feeds für Google Merchant Center, Meta und Preisvergleichsdienste, mit Regeln für Titel, Kategorien und Ausschlüsse pro Kanal. Wir richten die Feeds und das Regelwerk ein und verfolgen die Fehlermeldungen aus dem Merchant Center, damit die Produkte freigegeben bleiben.',
  'DataFeedWatch er et feed-verktøy. Shopify er kilden, kanalene får hver sin tilpassede feed.': 'DataFeedWatch ist ein Feed-Tool. Shopify ist die Quelle, und jeder Kanal erhält seinen eigenen angepassten Feed.',
  'Google avviser produkter med dårlige titler og manglende attributter. Et feed-verktøy fikser det uten å endre butikken.': 'Google lehnt Produkte mit schlechten Titeln und fehlenden Attributen ab. Ein Feed-Tool behebt das, ohne den Shop zu verändern.',
  'DataFeedWatch-konto': 'DataFeedWatch-Konto',
  'Merchant Center og Meta Commerce': 'Merchant Center und Meta Commerce',

  // Dintero. Vipps is a Norwegian payment method; the German copy says so
  // instead of implying it is available for German customers.
  'Dintero for Shopify': 'Dintero für Shopify',
  'Norsk betalingsløsning med Vipps, kort og faktura i én avtale.': 'Norwegische Zahlungslösung mit Karte, Rechnung und Vipps in einem Vertrag.',
  'Dintero-integrasjonen gir Vipps, kort og faktura i Shopify-kassen gjennom én avtale og én utbetaling, i stedet for tre leverandører og tre oppgjør. Vi setter opp Dintero sin Shopify-app, tester hver betalingsmetode på mobil og i kassen, og kobler oppgjøret til riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.':
    'Die Dintero-Integration bringt Karte, Rechnung und Vipps für norwegische Kunden in den Shopify-Checkout, über einen Vertrag und eine Auszahlung statt drei Anbieter und drei Abrechnungen. Wir richten die Shopify-App von Dintero ein, testen jede Zahlungsart mobil und im Checkout und verbinden die Abrechnung mit der richtigen Zahlungsart in der Buchhaltung, damit Bank und Buchführung ohne manuelle Abstimmung übereinstimmen.',
  'Dintero er en norsk betalingsleverandør som samler flere betalingsmetoder bak én avtale.': 'Dintero ist ein norwegischer Zahlungsanbieter, der mehrere Zahlungsarten hinter einem Vertrag bündelt.',
  'Én avtale og ett oppgjør er enklere å avstemme enn tre.': 'Ein Vertrag und eine Abrechnung sind leichter abzustimmen als drei.',
  'Dintero-avtale': 'Dintero-Vertrag',

  // Emfas
  'Emfas PIM for Shopify': 'Emfas PIM für Shopify',
  'Produktdata fra Emfas til Shopify, med attributter som metafelt og bilder fra DAM.': 'Produktdaten aus Emfas nach Shopify, mit Attributen als Metafelder und Bildern aus dem DAM.',
  'Emfas-integrasjonen publiserer produkter, varianter, attributter og bilder fra Emfas til Shopify, med attributter som metafelt og bilder fra Emfas sin DAM. Vi kartlegger datamodellen, setter opp mapping og kanaler, og tester publisering før produktdata flyttes over.':
    'Die Emfas-Integration veröffentlicht Produkte, Varianten, Attribute und Bilder aus Emfas nach Shopify, mit Attributen als Metafelder und Bildern aus dem Emfas-DAM. Wir nehmen das Datenmodell auf, richten Mapping und Kanäle ein und testen die Veröffentlichung an einer kleineren Produktauswahl, bevor der gesamte Katalog übertragen wird.',
  'Emfas er et norsk PIM- og DAM-system. Shopify-koblingen setter Emfas som fasit for produktinformasjon.': 'Emfas ist ein norwegisches PIM- und DAM-System. Die Shopify-Anbindung macht Emfas zur führenden Quelle für Produktinformationen.',
  'Når produktdata lever i Emfas, må nettbutikken følge med uten manuell kopiering.': 'Wenn Produktdaten in Emfas leben, muss der Onlineshop ohne manuelles Kopieren mitziehen.',
  'Emfas med Shopify-kanal': 'Emfas mit Shopify-Kanal',

  // Feed
  'Feed PIM for Shopify': 'Feed PIM für Shopify',
  'Produktdata eid i Feed og publisert til Shopify med varianter, bilder og attributter.': 'Produktdaten, die in Feed gepflegt und mit Varianten, Bildern und Attributen nach Shopify veröffentlicht werden.',
  'Feed-integrasjonen gjør Feed til fasit for produktdata og publiserer produkter, varianter, bilder og attributter til Shopify. Vi setter opp mapping av attributter til Shopify-metafelt, kanaler per marked og regler for hva som skal publiseres, slik at produktdata vedlikeholdes ett sted.':
    'Die Feed-Integration macht Feed zur führenden Quelle für Produktdaten und veröffentlicht Produkte, Varianten, Bilder und Attribute nach Shopify. Wir richten das Mapping von Attributen auf Shopify-Metafelder, Kanäle pro Markt und Regeln dafür ein, was veröffentlicht wird, sodass Produktdaten an einem Ort gepflegt werden und jeder Shop denselben Inhalt zeigt.',
  'Feed er et norsk PIM-system. Shopify-koblingen er Feed sin egen, og jobben ligger i datamodell og mapping.': 'Feed ist ein norwegisches PIM-System. Die Shopify-Anbindung ist Feeds eigene, und die Arbeit liegt im Datenmodell und im Mapping.',
  'Med mange varianter og flere kanaler blir produktdata i Shopify alene uhåndterlig. PIM gir én fasit.': 'Mit vielen Varianten und mehreren Kanälen werden Produktdaten allein in Shopify unhandlich. Ein PIM liefert eine führende Quelle.',
  'Feed med Shopify-kanal': 'Feed mit Shopify-Kanal',

  // Fiken
  'Fiken-integrasjon for Shopify': 'Fiken-Integration für Shopify',
  'Shopify-salg til Fiken for små selskaper. Under utprøving med første kunde.': 'Shopify-Verkäufe nach Fiken für kleine Unternehmen. In der Pilotphase mit dem ersten Kunden.',
  'Fiken-integrasjonen sender betalte Shopify-ordre til Fiken som salg med kunde og linjer, for små selskaper som fører regnskapet selv. Den er under utprøving med første kunde og bygges som Make.com-scenario etter samme mønster som Tripletex, med kundeoppslag og produktoppslag før hver ordre.':
    'Die Fiken-Integration sendet bezahlte Shopify-Bestellungen als Verkauf mit Kunde und Positionen an Fiken, für kleine Unternehmen, die ihre Buchhaltung selbst führen. Sie befindet sich in der Pilotphase mit dem ersten Kunden und wird als Make.com-Szenario nach demselben Muster wie Tripletex gebaut, mit Kunden- und Produktabgleich, bevor jede Bestellung gebucht wird.',
  'Fiken er et norsk regnskapsprogram for små bedrifter. Integrasjonen oppretter salg i Fiken fra Shopify-ordre, og vi prøver den ut med en butikk som flyttet fra PrestaShop.': 'Fiken ist ein norwegisches Buchhaltungsprogramm für kleine Unternehmen. Die Integration legt Verkäufe aus Shopify-Bestellungen in Fiken an, und wir erproben sie mit einem Shop, der von PrestaShop umgezogen ist.',
  'Små butikker punsher ofte ordre selv. Med integrasjonen går salget rett inn, og mva-meldingen bygger på det som faktisk ble solgt.': 'Kleine Shops tippen Bestellungen oft von Hand ein. Mit der Integration geht der Verkauf direkt hinein, und die Umsatzsteuermeldung basiert auf dem, was tatsächlich verkauft wurde.',
  'Fiken med API-tilgang': 'Fiken mit API-Zugang',
  'Kreditnota, kommer etter piloten': 'Gutschrift, folgt nach dem Pilot',

  // Front Systems
  'Front Systems-integrasjon for Shopify': 'Front Systems-Integration für Shopify',
  'Butikk-POS og nettbutikk på samme varelager. Ordre og kunder mellom Shopify Plus og Front.': 'Laden-POS und Onlineshop auf demselben Lagerbestand. Bestellungen und Kunden zwischen Shopify Plus und Front.',
  'Front Systems-integrasjonen kobler butikk-POS i Front til nettbutikken i Shopify Plus, slik at varer, lager og kunder er de samme i butikk og på nett, og nettordre kan hentes eller returneres i butikk. Vi bygger flyten mot Front sitt API i Make.com og tester den i én butikk før resten.':
    'Die Front Systems-Integration verbindet das Laden-POS in Front mit dem Onlineshop in Shopify Plus, sodass Artikel, Lagerbestand und Kunden im Laden und online dieselben sind und Online-Bestellungen im Laden abgeholt oder zurückgegeben werden können. Wir bauen den Ablauf gegen die API von Front in Make.com und testen ihn in einer Filiale, bevor die übrigen folgen.',
  'Front Systems er et norsk kassesystem for kjeder og mote. API-et gir tilgang til varer, lager, kunder og salg, og integrasjonen bruker det i begge retninger.': 'Front Systems ist ein norwegisches Kassensystem für Filialketten und Mode. Die API gibt Zugriff auf Artikel, Lagerbestand, Kunden und Verkäufe, und die Integration nutzt sie in beide Richtungen.',
  'Kjeder med både butikk og nett vil ikke ha to varelagre og to kundebaser. Da må POS og nettbutikk snakke sammen.': 'Ketten mit Laden und Onlineshop wollen keine zwei Lagerbestände und zwei Kundenbasen. Dann müssen POS und Onlineshop miteinander sprechen.',
  'Front Systems med API-nøkkel': 'Front Systems mit API-Schlüssel',

  // Google Sheets
  'Google Sheets-integrasjon for Shopify': 'Google Sheets-Integration für Shopify',
  'Skjemaer og ordre inn i regneark når det er der jobben gjøres. Ordreark for plukk og samlefaktura.': 'Formulare und Bestellungen in Tabellen, wenn dort die Arbeit passiert. Bestelllisten für Kommissionierung und Sammelrechnung.',
  'Google Sheets-integrasjonen sender ordre, skjemasvar eller oppsigelser fra Shopify og nettsiden inn i regneark som teamet allerede jobber i, for plukklister, samlefakturering eller oppfølging. Den kjører som Make.com-flyt og er den enkleste måten å få data ut av Shopify på.':
    'Die Google Sheets-Integration schickt Bestellungen, Formularantworten oder Kündigungen aus Shopify und der Website in Tabellen, in denen das Team bereits arbeitet, für Picklisten, Sammelrechnungen oder Nachverfolgung. Sie läuft als Make.com-Ablauf in Ihrem eigenen Konto und ist der einfachste Weg, Daten aus Shopify zu den Menschen zu bringen, die sie brauchen.',
  'Google Sheets er regnearket alle har. Som integrasjon er det et arbeidsbord, ikke et system, og det er ofte nok.': 'Google Sheets ist die Tabelle, die alle haben. Als Integration ist es eine Werkbank, kein System, und das reicht oft.',
  'Noen ganger er svaret et ark. Et ordreark for plukk eller en liste over oppsigelser slår et nytt system.': 'Manchmal ist die Antwort eine Tabelle. Eine Bestellliste für die Kommissionierung oder eine Liste der Kündigungen schlägt ein neues System.',
  'Google Workspace': 'Google Workspace',
  'Shopify eller skjema': 'Shopify oder Formular',

  // Holio
  'Holio-integrasjon for Shopify': 'Holio-Integration für Shopify',
  'Ordre- og lagersystem for mindre grossister. Ordre inn, lager og forsendelser tilbake.': 'Bestell- und Lagersystem für kleinere Großhändler. Bestellungen hinein, Lagerbestand und Sendungen zurück.',
  'Holio-integrasjonen kobler Shopify til Holio sitt ordre- og lagersystem, slik at ordre går inn i Holio for plukk og pakk, og lager og sporing kommer tilbake til Shopify. Vi setter opp Holio sin Shopify-kobling og tester plukk, pakk, retur og lagerjustering før go-live.':
    'Die Holio-Integration verbindet Shopify mit dem Bestell- und Lagersystem von Holio, sodass Bestellungen zum Kommissionieren und Verpacken in Holio eingehen und Lagerbestand und Sendungsverfolgung zurück nach Shopify kommen. Wir richten die Shopify-Anbindung von Holio ein, mappen Lagerorte und Versandarten und testen Kommissionierung, Verpackung, Retoure und Bestandskorrektur vor dem Go-live.',
  'Holio er et norsk OMS og WMS for mindre grossister og nettbutikker med eget lager. Et lettere alternativ til Omnium.': 'Holio ist ein norwegisches OMS und WMS für kleinere Großhändler und Onlineshops mit eigenem Lager. Eine leichtere Alternative zu Omnium.',
  'Med eget lager og flere kanaler trenger du ett sted for plukk og lager, uten å betale for mer enn du bruker.': 'Mit eigenem Lager und mehreren Kanälen brauchen Sie einen Ort für Kommissionierung und Bestand, ohne für mehr zu zahlen, als Sie nutzen.',
  'Holio-konto med Shopify-kobling': 'Holio-Konto mit Shopify-Anbindung',
  'Lagerlokasjoner avklart': 'Lagerorte geklärt',

  // IZY
  'IZY Rental for Shopify': 'IZY Rental für Shopify',
  'Utleie med datoperiode, tilgjengelighet og tilbehør, rett i Shopify-kassen.': 'Vermietung mit Zeitraum, Verfügbarkeit und Zubehör, direkt im Shopify-Checkout.',
  'IZY-integrasjonen gir utleiebooking i Shopify: kunden velger periode, ser tilgjengelighet, legger til tilbehør og betaler i kassen som en vanlig ordre. Vi setter opp IZY sin app, leveringsvalg etter postnummer med post, budbil eller henting, og kobler bookingen videre til fakturering i regnskapet og fraktetikett når leien skal sendes.':
    'Die IZY-Integration bringt Mietbuchungen nach Shopify: Der Kunde wählt einen Zeitraum, sieht die Verfügbarkeit, fügt Zubehör hinzu und bezahlt im Checkout wie eine normale Bestellung. Wir richten die App von IZY ein, Lieferoptionen nach Postleitzahl mit Post, Kurier oder Abholung, und verbinden die Buchung mit der Rechnungsstellung in der Buchhaltung und dem Versandetikett, wenn die Mietsache verschickt wird.',
  'IZY Rental er en bookingapp for utleie på Shopify. Bookingen blir en ordre, resten av flyten er som for andre ordre.': 'IZY Rental ist eine Buchungs-App für Vermietung auf Shopify. Die Buchung wird zur Bestellung, und der Rest des Ablaufs ist wie bei anderen Bestellungen.',
  'Utleie krever periode og tilgjengelighet. Standard Shopify har ingen av delene.': 'Vermietung erfordert Zeitraum und Verfügbarkeit. Standard-Shopify bietet beides nicht.',
  'IZY-konto': 'IZY-Konto',
  'Regler for levering og henting': 'Regeln für Lieferung und Abholung',
}

// Subjects used in "Kan vi starte med X og utvide senere?" (dative after "mit").
const SUBJECT: Record<string, string> = {
  frakt: 'dem Versand', ERP: 'dem ERP', feed: 'dem Feed', betaling: 'der Zahlung', produktdata: 'den Produktdaten', salg: 'dem Verkauf', POS: 'dem POS', ordreark: 'der Bestellliste', lager: 'dem Lager', booking: 'der Buchung',
}
// "Hvilke <cat>-systemer støtter dere?" → "Welche <CAT_SYS> unterstützen Sie?"
const CAT_SYS: Record<string, string> = {
  betaling: 'Zahlungssysteme', 'booking og annet': 'Systeme für Buchung und anderes', 'erp og økonomi': 'ERP- und Buchhaltungssysteme', 'logistikk og frakt': 'Logistik- und Versandsysteme',
  'markedsføring og sporing': 'Systeme für Marketing und Tracking', 'oms, lager og edi': 'OMS-, Lager- und EDI-Systeme', 'pim og produktdata': 'PIM- und Produktdatensysteme', 'pos og butikk': 'POS- und Ladensysteme',
}
// "Hvilket system bruker dere til <cat>?" → "Welches System nutzen Sie für <CAT_FOR>?"
const CAT_FOR: Record<string, string> = {
  betaling: 'Zahlungen', 'booking og annet': 'Buchung und anderes', 'erp og økonomi': 'ERP und Buchhaltung', 'logistikk og frakt': 'Logistik und Versand',
  'markedsføring og sporing': 'Marketing und Tracking', 'oms, lager og edi': 'OMS, Lager und EDI', 'pim og produktdata': 'PIM und Produktdaten', 'pos og butikk': 'POS und Ladengeschäft',
}
const ANCHOR: Record<string, string> = { eierskap: 'eigentum', feil: 'fehler', fasit: 'fuehrendes-system', andre: 'andere-systeme' }

const PATTERNS: [RegExp, (m: RegExpMatchArray) => string | undefined][] = [
  [/^Kjører dere (.+) i dag\?$/, (m) => `Setzen Sie ${m[1]} heute schon ein?`],
  [/^Eier vi integrasjonen mot (.+) selv\?$/, (m) => `Gehört die Integration mit ${m[1]} uns selbst?`],
  [/^Kan vi starte med (.+) og utvide senere\?$/, (m) => SUBJECT[m[1]] && `Können wir mit ${SUBJECT[m[1]]} starten und später erweitern?`],
  [/^Hva som skal flyte mellom Shopify og (.+), hvem som er fasit for hva, og hva som skjer ved feil\. Én arbeidsøkt\.$/, (m) => `Was zwischen Shopify und ${m[1]} fließen soll, welches System wofür führend ist und was bei Fehlern passiert. Ein Arbeitstermin.`],
  [/^Hvilke (.+)-systemer støtter dere\?$/, (m) => CAT_SYS[m[1]] && `Welche ${CAT_SYS[m[1]]} unterstützen Sie?`],
  [/^Hvilket system bruker dere til (.+)\?$/, (m) => CAT_FOR[m[1]] && `Welches System nutzen Sie für ${CAT_FOR[m[1]]}?`],
]

const missing: string[] = []
function tr(s: string | undefined | null): string | undefined {
  if (s == null || s === '') return s ?? undefined
  if (D[s] !== undefined) return D[s]
  for (const [re, fn] of PATTERNS) {
    const m = s.match(re)
    if (m) { const out = fn(m); if (out) return out }
  }
  missing.push(s)
  return s
}
/** Known product/system names stay as they are; phrases are translated. */
function sysName(s: string): string { return D[s] ?? s }
function pt(blocks: any[] | undefined): any[] | undefined {
  if (!Array.isArray(blocks)) return blocks
  return blocks.map((b) => b?._type === 'block' && Array.isArray(b.children)
    ? { ...b, children: b.children.map((c: any) => (c?._type === 'span' && typeof c.text === 'string' ? { ...c, text: tr(c.text) } : c)) }
    : b)
}
const unmappedRefs: string[] = []
const deId = (id: string) => {
  if (id.endsWith('-no')) return id.replace(/-no$/, '-de')
  if (PAGE_ID_MAP[id]) return PAGE_ID_MAP[id]
  unmappedRefs.push(id)
  return undefined
}
const weak = (r: Doc) => { const ref = deId(r._ref); return ref ? { ...r, _type: 'reference', _ref: ref, _weak: true } : undefined }
const weakAll = (rs: Doc[]) => rs.map(weak).filter((r): r is NonNullable<typeof r> => Boolean(r))
const words = (s: string) => s.trim().split(/\s+/).length

function buildDe(no: Doc): Doc {
  const { _rev, _createdAt, _updatedAt, ...rest } = no
  const de: Doc = { ...rest, _id: deId(no._id), language: 'de' }
  de.slug = { _type: 'slug', current: String(no.slug.current).replace(/^integrasjoner/, 'integrations') }
  for (const f of ['pageTitle', 'title', 'definition', 'shortDescription']) if (typeof no[f] === 'string') de[f] = tr(no[f])
  for (const f of ['intro', 'whatItIs', 'whyItMatters']) if (Array.isArray(no[f])) de[f] = pt(no[f])
  if (Array.isArray(no.sections)) de.sections = no.sections.map((s: Doc) => ({ ...s, heading: tr(s.heading), anchor: s.anchor ? ANCHOR[s.anchor] ?? tr(s.anchor) : s.anchor, body: pt(s.body) }))
  if (Array.isArray(no.implementationSteps)) de.implementationSteps = no.implementationSteps.map((s: Doc) => ({ ...s, name: tr(s.name), text: tr(s.text) }))
  for (const f of ['prerequisites', 'notIncluded', 'namedClients']) if (Array.isArray(no[f])) de[f] = no[f].map((x: string) => (f === 'namedClients' ? sysName(x) : tr(x)))
  if (Array.isArray(no.faq)) de.faq = no.faq.map((q: Doc) => ({ ...q, question: tr(q.question), answer: tr(q.answer) }))
  if (no.cta) de.cta = { ...no.cta, heading: tr(no.cta.heading), text: tr(no.cta.text), buttonLabel: tr(no.cta.buttonLabel), buttonHref: '/contact' }
  if (Array.isArray(no.dataFlowSteps)) de.dataFlowSteps = no.dataFlowSteps.map((s: Doc) => ({ ...s, payload: tr(s.payload), frequency: tr(s.frequency), from: sysName(s.from), to: sysName(s.to) }))
  if (Array.isArray(no.systems)) de.systems = no.systems.map((s: Doc) => ({ ...s, name: sysName(s.name) }))
  if (no.seoExtended) de.seoExtended = { ...no.seoExtended, metaTitle: tr(no.seoExtended.metaTitle), metaDescription: tr(no.seoExtended.metaDescription) }
  if (no.category?._ref) de.category = weak(no.category)
  if (no.pillar?._ref) de.pillar = weak(no.pillar)
  if (Array.isArray(no.clusterLinks)) de.clusterLinks = weakAll(no.clusterLinks)
  if (Array.isArray(no.relatedPages)) de.relatedPages = weakAll(no.relatedPages)
  return de
}

async function main() {
  // Resolve the German counterparts of the non-template pages the Norwegian docs link to.
  for (const [noId, type] of Object.entries(PAGE_TYPE)) {
    const id = await client.fetch<string | null>('*[_type == $type && language == "de"][0]._id', { type })
    if (id) PAGE_ID_MAP[noId] = id
    else console.warn(dataset, 'no German', type, '- link skipped')
  }

  const sources = await client.fetch<Doc[]>('*[_id in $ids]', { ids: SOURCE_IDS })
  const found = new Set(sources.map((d) => d._id))
  const absent = SOURCE_IDS.filter((id) => !found.has(id))
  if (absent.length) throw new Error(`missing Norwegian sources in ${dataset}: ${absent.join(', ')}`)

  const docs = sources.map(buildDe)
  if (missing.length) throw new Error(`untranslated strings:\n${[...new Set(missing)].map((s) => `  - ${s}`).join('\n')}`)
  if (unmappedRefs.length) console.warn(dataset, 'skipped references without a German target:', [...new Set(unmappedRefs)].join(', '))
  const offLength = docs.filter((d) => d.definition && (words(d.definition) < 40 || words(d.definition) > 60))
  if (offLength.length) throw new Error(`definition outside 40–60 words: ${offLength.map((d) => `${d._id} (${words(d.definition)})`).join(', ')}`)
  if (process.env.DRY_RUN) {
    for (const d of docs) console.log('DRY', d._id, d.slug.current, d.definition ? `${words(d.definition)} words` : '')
    return
  }

  for (const d of docs) {
    await client.createOrReplace(d as { _id: string; _type: string } & Doc)
    console.log(dataset, 'wrote', d._id, d.definition ? `(${words(d.definition)} words in definition)` : '')
  }
  for (const no of sources) {
    const type = no._type
    const metaId = no._id.replace(/-no$/, '-meta')
    const entry = { _key: 'de', value: { _type: 'reference', _ref: deId(no._id), _weak: true, _strengthenOnPublish: { type } } }
    const meta = await client.fetch<{ keys: string[] | null } | null>('*[_id == $id][0]{ "keys": translations[]._key }', { id: metaId })
    if (!meta) {
      await client.createOrReplace({
        _id: metaId, _type: 'translation.metadata', schemaTypes: [type], translations: [
          { _key: 'no', value: { _type: 'reference', _ref: no._id, _weak: true, _strengthenOnPublish: { type } } },
          entry,
        ],
      })
      console.log(dataset, 'created', metaId, '(no + de)')
    } else if (meta.keys?.includes('de')) {
      console.log(dataset, 'kept', metaId, '(de already present)')
    } else if (!meta.keys?.length) {
      await client.patch(metaId).set({ translations: [entry] }).commit()
      console.log(dataset, 'set de on', metaId)
    } else {
      await client.patch(metaId).insert('after', 'translations[-1]', [entry]).commit()
      console.log(dataset, 'added de to', metaId)
    }
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
