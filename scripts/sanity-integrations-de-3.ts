// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-de-3.ts --with-user-token
// Creates German versions (-de, de-DE, Sie-form) of 11 Norwegian integrationPage documents (batch 3:
// profrakt, quickship, shopify-pos, sparklayer, tracklution, trimit, tripletex, unimicro,
// vipps-hurtigkasse, visma-net, vuuh) and adds the de entry to each translation.metadata.
// Idempotent: fetches each -no document, translates every text field through the T table
// below (the script fails loudly on any string it has no translation for), rewrites
// references to the -de counterparts (weak), and createOrReplace-s on fixed ids.
// The translation.metadata (integration-<x>-meta) already holds no + en (+ sv/da); the de entry
// is inserted with a PATCH after translations[-1] only when no 'de' key exists yet.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const DRY = process.env.DRY_RUN === '1' // DRY_RUN=1 builds and validates everything but writes nothing
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const SLUGS = ['profrakt', 'quickship', 'shopify-pos', 'sparklayer', 'tracklution', 'trimit', 'tripletex', 'unimicro', 'vipps-hurtigkasse', 'visma-net', 'vuuh']

// ---------------------------------------------------------------------------
// Translation table: every Norwegian string that appears in a text field of the
// 11 documents, mapped to idiomatic German (Sie-form). Facts are kept as they are in
// Norwegian: Tripletex is one-way Shopify → Tripletex and invoices are created but not
// sent automatically; Omnium is in; no prices; Vipps stays Norwegian (no German
// availability claims).
// ---------------------------------------------------------------------------
const T: Record<string, string> = {
  // --- shared: CTA ---
  'Book en samtale': 'Gespräch vereinbaren',
  'Fortell oss hvilke systemer du har, så får du metode, dataflyt og tidsplan innen to virkedager.':
    'Nennen Sie uns Ihre Systeme, und Sie erhalten innerhalb von zwei Werktagen Methode, Datenfluss und Zeitplan.',
  'Kjører dere Profrakt i dag?': 'Nutzen Sie heute Profrakt?',
  'Kjører dere Quickship i dag?': 'Nutzen Sie heute Quickship?',
  'Kjører dere Shopify POS i dag?': 'Nutzen Sie heute Shopify POS?',
  'Kjører dere SparkLayer i dag?': 'Nutzen Sie heute SparkLayer?',
  'Kjører dere Tracklution i dag?': 'Nutzen Sie heute Tracklution?',
  'Kjører dere TRIMIT i dag?': 'Nutzen Sie heute TRIMIT?',
  'Kjører dere Tripletex i dag?': 'Nutzen Sie heute Tripletex?',
  'Kjører dere UniMicro i dag?': 'Nutzen Sie heute UniMicro?',
  'Kjører dere Vipps i dag?': 'Nutzen Sie heute Vipps?',
  'Kjører dere Visma.net i dag?': 'Nutzen Sie heute Visma.net?',
  'Kjører dere Vuuh i dag?': 'Nutzen Sie heute Vuuh?',

  // --- shared: FAQ ---
  'Ja. Make.com-scenarioer ligger i din konto, og kode leveres med kildekode. Vi drifter om du vil, men du er ikke låst til oss.':
    'Ja. Die Make.com-Szenarien liegen in Ihrem Konto, und Code wird mit Quellcode geliefert. Wir betreiben die Integration auf Wunsch, aber Sie sind nicht an uns gebunden.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen. Det finnes ingen automatisk tilbakerulling, og det sier vi rett ut.':
    'Jeder Lauf liegt mit Ein- und Ausgabedaten im Verlauf. Fehler werden mit Referenz gemeldet, und wir räumen gemeinsam auf. Ein automatisches Rollback gibt es nicht, und das sagen wir offen.',
  'Ja. De fleste starter med én flyt, for eksempel ordre, og legger til lager eller kunder etterpå.':
    'Ja. Die meisten starten mit einem Fluss, zum Beispiel Bestellungen, und ergänzen Lager oder Kunden später.',
  'Make.com-flyter leveres på dager når kartleggingen er gjort. Egen kode tar lenger, og vi gir tidsplan etter første samtale.':
    'Make.com-Flüsse werden innerhalb von Tagen geliefert, sobald die Analyse abgeschlossen ist. Eigener Code dauert länger, und wir geben nach dem ersten Gespräch einen Zeitplan.',
  'Hva skjer når en kjøring feiler?': 'Was passiert, wenn ein Lauf fehlschlägt?',
  'Hvor lang tid tar oppsettet?': 'Wie lange dauert die Einrichtung?',
  'Eier vi integrasjonen mot Profrakt selv?': 'Gehört uns die Integration mit Profrakt selbst?',
  'Eier vi integrasjonen mot Quickship selv?': 'Gehört uns die Integration mit Quickship selbst?',
  'Eier vi integrasjonen mot Shopify POS selv?': 'Gehört uns die Integration mit Shopify POS selbst?',
  'Eier vi integrasjonen mot SparkLayer selv?': 'Gehört uns die Integration mit SparkLayer selbst?',
  'Eier vi integrasjonen mot Tracklution selv?': 'Gehört uns die Integration mit Tracklution selbst?',
  'Eier vi integrasjonen mot TRIMIT selv?': 'Gehört uns die Integration mit TRIMIT selbst?',
  'Eier vi integrasjonen mot UniMicro selv?': 'Gehört uns die Integration mit UniMicro selbst?',
  'Eier vi integrasjonen mot Vipps selv?': 'Gehört uns die Integration mit Vipps selbst?',
  'Eier vi integrasjonen mot Visma.net selv?': 'Gehört uns die Integration mit Visma.net selbst?',
  'Eier vi integrasjonen mot Vuuh selv?': 'Gehört uns die Integration mit Vuuh selbst?',
  'Kan vi starte med frakt og utvide senere?': 'Können wir mit dem Versand starten und später erweitern?',
  'Kan vi starte med kasse og utvide senere?': 'Können wir mit der Kasse starten und später erweitern?',
  'Kan vi starte med B2B og utvide senere?': 'Können wir mit B2B starten und später erweitern?',
  'Kan vi starte med sporing og utvide senere?': 'Können wir mit dem Tracking starten und später erweitern?',
  'Kan vi starte med lagersynk og utvide senere?': 'Können wir mit dem Lagerabgleich starten und später erweitern?',
  'Kan vi starte med vareflyt og utvide senere?': 'Können wir mit dem Artikelfluss starten und später erweitern?',
  'Kan vi starte med betaling og utvide senere?': 'Können wir mit der Zahlung starten und später erweitern?',
  'Kan vi starte med ERP og utvide senere?': 'Können wir mit dem ERP starten und später erweitern?',
  'Kan vi starte med produktdata og utvide senere?': 'Können wir mit den Produktdaten starten und später erweitern?',

  // --- shared: implementation steps ---
  'Kartlegging': 'Analyse',
  'Oppsett': 'Einrichtung',
  'Test på reelle data': 'Test mit echten Daten',
  'Go-live og overvåking': 'Go-live und Überwachung',
  'Tilkobling i din egen konto, mapping av felt, og testdata gjennom hele flyten.':
    'Anbindung in Ihrem eigenen Konto, Feld-Mapping und Testdaten durch den gesamten Fluss.',
  'De første ordrene eller produktene følges manuelt før vi slår på alt.':
    'Die ersten Bestellungen oder Produkte werden manuell verfolgt, bevor wir alles einschalten.',
  'Vi følger de første ukene. Feil varsles med referanse til ordren.':
    'Wir begleiten die ersten Wochen. Fehler werden mit Referenz zur Bestellung gemeldet.',
  'Hva som skal flyte mellom Shopify og Profrakt, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Was zwischen Shopify und Profrakt fließen soll, welches System wofür führend ist, und was bei Fehlern passiert. Ein Arbeitstermin.',
  'Hva som skal flyte mellom Shopify og Quickship, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Was zwischen Shopify und Quickship fließen soll, welches System wofür führend ist, und was bei Fehlern passiert. Ein Arbeitstermin.',
  'Hva som skal flyte mellom Shopify og SparkLayer, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Was zwischen Shopify und SparkLayer fließen soll, welches System wofür führend ist, und was bei Fehlern passiert. Ein Arbeitstermin.',
  'Hva som skal flyte mellom Shopify og Tracklution, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Was zwischen Shopify und Tracklution fließen soll, welches System wofür führend ist, und was bei Fehlern passiert. Ein Arbeitstermin.',
  'Hva som skal flyte mellom Shopify og TRIMIT, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Was zwischen Shopify und TRIMIT fließen soll, welches System wofür führend ist, und was bei Fehlern passiert. Ein Arbeitstermin.',
  'Hva som skal flyte mellom Shopify og UniMicro, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Was zwischen Shopify und UniMicro fließen soll, welches System wofür führend ist, und was bei Fehlern passiert. Ein Arbeitstermin.',
  'Hva som skal flyte mellom Shopify og Vipps, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Was zwischen Shopify und Vipps fließen soll, welches System wofür führend ist, und was bei Fehlern passiert. Ein Arbeitstermin.',
  'Hva som skal flyte mellom Shopify og Visma.net, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Was zwischen Shopify und Visma.net fließen soll, welches System wofür führend ist, und was bei Fehlern passiert. Ein Arbeitstermin.',
  'Hva som skal flyte mellom Shopify og Vuuh, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Was zwischen Shopify und Vuuh fließen soll, welches System wofür führend ist, und was bei Fehlern passiert. Ein Arbeitstermin.',

  // --- shared: data flow frequencies and payloads ---
  'sanntid': 'Echtzeit',
  'daglig': 'täglich',
  'løpende': 'laufend',
  'hvert 15. min': 'alle 15 Min.',
  'ved knapp': 'per Klick',
  'ved pakking': 'beim Packen',
  'månedlig, valgfritt': 'monatlich, optional',
  'mottaker + kolli → etikett': 'Empfänger + Packstück → Etikett',
  'sporingsnummer': 'Sendungsnummer',
  'fraktvalg': 'Versandoptionen',
  'etikett': 'Etikett',
  'sporing': 'Tracking',
  'salg + kunder + lager': 'Verkäufe + Kunden + Lager',
  'dagsoppgjør': 'Tagesabschluss',
  'B2B-ordre': 'B2B-Bestellungen',
  'ordre': 'Bestellungen',
  'kjøp + hendelser': 'Käufe + Ereignisse',
  'konverteringer': 'Conversions',
  'lagerbeholdning per variant': 'Lagerbestand pro Variante',
  'ordre + kunde': 'Bestellung + Kunde',
  'faktura opprettes, sendes ikke': 'Rechnung wird erstellt, nicht versendet',
  'refusjon → kreditnota': 'Erstattung → Gutschrift',
  'samlebilag': 'Sammelbeleg',
  'varer + lager': 'Artikel + Lager',
  'ordre + kunder': 'Bestellungen + Kunden',
  'betalt ordre + kunde': 'bezahlte Bestellung + Kunde',
  'oppgjør': 'Abrechnung',
  'produkter + bilder + lager': 'Produkte + Bilder + Lager',

  // --- Profrakt ---
  'Profrakt-integrasjon for Shopify': 'Profrakt-Integration für Shopify',
  'Profrakt-integrasjonen bestiller fraktetikett fra Profrakt når en ordre eller booking er klar, og legger sporingsnummeret tilbake på forsendelsen. Den kjører som Make.com-flyt og kan utløses fra Shopify, eller fra et annet system som Podio når leien skal sendes, ikke når den bestilles.':
    'Die Profrakt-Integration bestellt ein Versandetikett bei Profrakt, sobald eine Bestellung oder Buchung bereit ist, und schreibt die Sendungsnummer zurück auf die Sendung. Sie läuft als Make.com-Fluss und kann aus Shopify ausgelöst werden, oder aus einem anderen System wie Podio, wenn die Mietware versendet werden soll, nicht wenn sie bestellt wird.',
  'Fraktetiketter bestilt fra ordren eller fra bookingsystemet, sporing tilbake på forsendelsen.':
    'Versandetiketten aus der Bestellung oder dem Buchungssystem bestellt, Tracking zurück auf die Sendung.',
  'Profrakt er en norsk fraktportal med avtaler hos flere transportører. Integrasjonen kaller Profrakt sitt API med mottaker og kolli, og får etikett og sporing tilbake.':
    'Profrakt ist ein norwegisches Versandportal mit Verträgen bei mehreren Transportunternehmen. Die Integration ruft die Profrakt-API mit Empfänger und Packstück auf und erhält Etikett und Tracking zurück.',
  'Utleie og bestillinger med leveringsdato passer ikke i standard fraktapper, som sender med en gang ordren er betalt.':
    'Vermietung und Bestellungen mit Liefertermin passen nicht in Standard-Versand-Apps, die sofort versenden, sobald die Bestellung bezahlt ist.',
  'Profrakt-konto med API': 'Profrakt-Konto mit API',
  'Shopify eller bookingsystem': 'Shopify oder Buchungssystem',
  'Make.com-konto': 'Make.com-Konto',

  // --- Quickship ---
  'Quickship for Shopify': 'Quickship für Shopify',
  'Quickship-integrasjonen gir fraktvalg og etiketter for B2B-sendinger fra Shopify, inkludert pall og stykkgods som vanlige fraktapper ikke dekker. Vi setter opp appen, fraktregler per kundegruppe og vekt, etikettflyten fra ordren til pakking, og kobler sporing tilbake til ordren så forhandleren ser når pallen er på vei.':
    'Die Quickship-Integration liefert Versandoptionen und Etiketten für B2B-Sendungen aus Shopify, einschließlich Paletten und Stückgut, die gewöhnliche Versand-Apps nicht abdecken. Wir richten die App ein, Versandregeln pro Kundengruppe und Gewicht, den Etikettenfluss von der Bestellung bis zum Packen, und verknüpfen das Tracking zurück mit der Bestellung, damit der Händler sieht, wann die Palette unterwegs ist.',
  'Fraktvalg og etiketter for B2B-sendinger med pall og stykkgods.':
    'Versandoptionen und Etiketten für B2B-Sendungen mit Paletten und Stückgut.',
  'Quickship er en norsk fraktløsning rettet mot bedrifter. Shopify-appen gir priser i kassen og etiketter fra ordren.':
    'Quickship ist eine norwegische Versandlösung für Unternehmen. Die Shopify-App liefert Preise im Checkout und Etiketten aus der Bestellung.',
  'B2B-ordre er tyngre og går på pall. Fraktvalg må reflektere det.':
    'B2B-Bestellungen sind schwerer und gehen auf Palette. Die Versandoptionen müssen das abbilden.',
  'Quickship-konto': 'Quickship-Konto',
  'Shopify': 'Shopify',
  'Fraktregler per kundegruppe': 'Versandregeln pro Kundengruppe',

  // --- Shopify POS ---
  'Shopify POS, fra PCKasse til én kasse': 'Shopify POS, von PCKasse zu einer einzigen Kasse',
  'Shopify POS gir butikken samme varelager, kunder og gavekort som nettbutikken. Vi setter opp kassen, maskinvare og betalingsterminal, flytter kunder og gavekortsaldo fra PCKasse eller Front, og lærer opp butikkteamet før lansering. Regnskapet får ett salg per dag per butikk.':
    'Shopify POS gibt dem Ladengeschäft dasselbe Lager, dieselben Kunden und Geschenkkarten wie dem Onlineshop. Wir richten Kasse, Hardware und Zahlungsterminal ein, übernehmen Kunden und Geschenkkartenguthaben aus PCKasse oder Front und schulen das Ladenteam vor dem Start. Die Buchhaltung erhält einen Verkauf pro Tag und Filiale.',
  'Butikk og nett i samme system. Vi flytter kunder, gavekort og varer fra PCKasse og setter opp kassen.':
    'Laden und Online im selben System. Wir übernehmen Kunden, Geschenkkarten und Artikel aus PCKasse und richten die Kasse ein.',
  'Shopify POS er Shopify sitt eget kassesystem. Det erstatter PCKasse for butikker som vil ha én plattform, og oppfyller kassasystemlova når det er satt opp riktig.':
    'Shopify POS ist das eigene Kassensystem von Shopify. Es ersetzt PCKasse für Händler, die eine einzige Plattform wollen, und erfüllt das norwegische Kassensystemgesetz, wenn es richtig eingerichtet ist.',
  'To systemer for butikk og nett betyr dobbelt lager, dobbelt kunderegister og gavekort som ikke virker på tvers.':
    'Zwei Systeme für Laden und Online bedeuten doppeltes Lager, doppelte Kundendatei und Geschenkkarten, die nicht kanalübergreifend funktionieren.',
  'Gammelt kassesystem, Z-rapport-vaner, gavekortsaldo og kundedata som skal med.':
    'Altes Kassensystem, Z-Bericht-Gewohnheiten, Geschenkkartenguthaben und Kundendaten, die mitkommen sollen.',
  'Lokasjoner, maskinvare, betalingsterminal og kvitteringsoppsett.': 'Standorte, Hardware, Zahlungsterminal und Bon-Einrichtung.',
  'Flytting': 'Migration',
  'Kunder og gavekort fra PCKasse, varer med strekkoder.': 'Kunden und Geschenkkarten aus PCKasse, Artikel mit Barcodes.',
  'Opplæring og go-live': 'Schulung und Go-live',
  'Butikkteamet lærer kassen, vi er til stede første dag.': 'Das Ladenteam lernt die Kasse kennen, wir sind am ersten Tag vor Ort.',
  'Shopify-plan med POS Pro der det trengs': 'Shopify-Plan mit POS Pro, wo nötig',
  'Betalingsterminal som støttes i Norge': 'In Norwegen unterstütztes Zahlungsterminal',
  'Eksport fra gammelt kassesystem': 'Export aus dem alten Kassensystem',

  // --- SparkLayer ---
  'SparkLayer B2B for Shopify': 'SparkLayer B2B für Shopify',
  'SparkLayer legger en B2B-bestillingsflate oppå Shopify med kundespesifikke priser, minimumsantall, hurtigbestilling og bestillingslister for forhandlere. Vi setter opp prislister og kundegrupper, tilpasser visningen i temaet, og kobler B2B-ordrene videre til Omnium eller regnskapssystemet slik at de behandles likt med alle andre ordre.':
    'SparkLayer legt eine B2B-Bestelloberfläche über Shopify, mit kundenspezifischen Preisen, Mindestmengen, Schnellbestellung und Bestelllisten für Händler. Wir richten Preislisten und Kundengruppen ein, passen die Darstellung im Theme an und leiten die B2B-Bestellungen weiter an Omnium oder das Buchhaltungssystem, damit sie wie alle anderen Bestellungen verarbeitet werden.',
  'B2B-portal på Shopify med kundepriser, bestillingslister og ordre som flyter videre til OMS.':
    'B2B-Portal auf Shopify mit Kundenpreisen, Bestelllisten und Bestellungen, die weiter ins OMS fließen.',
  'SparkLayer er en Shopify-app for B2B. Den erstatter ikke OMS, men gir forhandlerne en bestillingsportal på samme butikk som B2C.':
    'SparkLayer ist eine Shopify-App für B2B. Sie ersetzt kein OMS, gibt den Händlern aber ein Bestellportal im selben Shop wie B2C.',
  'Forhandlere som bestiller på e-post koster tid. En portal med riktige priser gir ordre rett inn i flyten.':
    'Händler, die per E-Mail bestellen, kosten Zeit. Ein Portal mit korrekten Preisen bringt Bestellungen direkt in den Fluss.',
  'Shopify Plus anbefalt': 'Shopify Plus empfohlen',
  'Prislister per kundegruppe': 'Preislisten pro Kundengruppe',
  'OMS eller regnskap for ordrene videre': 'OMS oder Buchhaltung für die Weiterverarbeitung der Bestellungen',

  // --- Tracklution ---
  'Tracklution server-side sporing for Shopify': 'Tracklution Server-side-Tracking für Shopify',
  'Tracklution-integrasjonen sender kjøp og hendelser fra Shopify server-side til Meta, Google Ads og affiliate-nettverk, uavhengig av nettleserblokkering og samtykkevalg som stopper vanlige piksler. Vi skriver custom pixel i Shopify-kassen, kobler hendelsene til Tracklution med riktig samtykkehåndtering, og verifiserer at konverteringene i annonseplattformene stemmer mot ordrene i Shopify.':
    'Die Tracklution-Integration sendet Käufe und Ereignisse aus Shopify server-seitig an Meta, Google Ads und Affiliate-Netzwerke, unabhängig von Browser-Blockern und Consent-Entscheidungen, die gewöhnliche Pixel stoppen. Wir schreiben einen Custom Pixel im Shopify-Checkout, verbinden die Ereignisse mit korrekter Consent-Behandlung mit Tracklution und prüfen, dass die Conversions in den Werbeplattformen mit den Bestellungen in Shopify übereinstimmen.',
  'Server-side sporing til Meta, Google og affiliate, med custom pixel i Shopify-kassen.':
    'Server-side-Tracking zu Meta, Google und Affiliate, mit Custom Pixel im Shopify-Checkout.',
  'Tracklution er en server-side sporingstjeneste. Shopify-kassen tillater bare custom pixels, så koblingen er kode vi skriver og vedlikeholder.':
    'Tracklution ist ein Server-side-Tracking-Dienst. Der Shopify-Checkout erlaubt nur Custom Pixels, deshalb ist die Anbindung Code, den wir schreiben und pflegen.',
  'Annonseplattformene ser ikke lenger alle kjøp fra nettleseren. Uten server-side sporing optimaliserer de på feil tall.':
    'Die Werbeplattformen sehen nicht mehr alle Käufe aus dem Browser. Ohne Server-side-Tracking optimieren sie auf falsche Zahlen.',
  'Tracklution-konto': 'Tracklution-Konto',
  'Shopify med custom pixel-tilgang': 'Shopify mit Zugriff auf Custom Pixel',
  'Samtykkebanner': 'Consent-Banner',

  // --- TRIMIT ---
  'TRIMIT-lagersynk for Shopify': 'TRIMIT-Lagerabgleich für Shopify',
  'TRIMIT-integrasjonen synker lagerbeholdning fra TRIMIT, ERP for mote og tekstil, til Shopify per variant og lokasjon. Den kjører som Make.com-scenario på fast intervall, slik at nettbutikken aldri selger varer som er utsolgt i ERP. Ordre går ikke tilbake i denne flyten.':
    'Die TRIMIT-Integration gleicht den Lagerbestand aus TRIMIT, dem ERP für Mode und Textil, pro Variante und Standort mit Shopify ab. Sie läuft als Make.com-Szenario in festem Intervall, damit der Onlineshop nie Ware verkauft, die im ERP ausverkauft ist. Bestellungen gehen in diesem Fluss nicht zurück.',
  'Lagersynk fra TRIMIT til Shopify for mote og tekstil med mange varianter.':
    'Lagerabgleich von TRIMIT zu Shopify für Mode und Textil mit vielen Varianten.',
  'TRIMIT er et ERP bygget på Microsoft Dynamics for mote, møbler og tekstil, med størrelse og farge som dimensjoner. Integrasjonen leser beholdning per variant og oppdaterer Shopify.':
    'TRIMIT ist ein auf Microsoft Dynamics aufgebautes ERP für Mode, Möbel und Textil, mit Größe und Farbe als Dimensionen. Die Integration liest den Bestand pro Variante und aktualisiert Shopify.',
  'Mote har mange varianter og raske utsalg. Feil lager i nettbutikken gir kanselleringer og dårlige anmeldelser.':
    'Mode hat viele Varianten und schnelle Abverkäufe. Falsche Bestände im Onlineshop führen zu Stornierungen und schlechten Bewertungen.',
  'Ordre til TRIMIT. Kan legges til som egen flyt': 'Bestellungen zu TRIMIT. Kann als eigener Fluss ergänzt werden',
  'TRIMIT med API-tilgang': 'TRIMIT mit API-Zugang',
  'Shopify med SKU per variant': 'Shopify mit SKU pro Variante',

  // --- Tripletex ---
  'Tripletex-integrasjon for Shopify': 'Tripletex-Integration für Shopify',
  'Tripletex-integrasjonen sender betalte Shopify-ordre til Tripletex som ordre og faktura med kunde, frakt og mva, enten per ordre eller som samlebilag per måned. Refusjoner i Shopify blir kreditnota. Flyten går én vei: Shopify er salgskanal, Tripletex er regnskap, og lager styres i Shopify. Den kjører som Make.com-scenario i din egen konto, og fakturaer sendes ikke før regnskapsfører har sett dem.':
    'Die Tripletex-Integration sendet bezahlte Shopify-Bestellungen als Auftrag und Rechnung mit Kunde, Versand und MwSt. an Tripletex, pro Bestellung oder als monatlichen Sammelbeleg. Erstattungen werden zur Gutschrift. Der Fluss ist einseitig: Shopify ist Verkaufskanal, Tripletex ist Buchhaltung, das Lager bleibt in Shopify. Sie läuft als Make.com-Szenario in Ihrem Konto, und Rechnungen werden erst versendet, wenn die Buchhaltung sie geprüft hat.',
  'Ordre og kunder til Tripletex som faktura per ordre eller samlebilag per måned. Refusjoner blir kreditnota.':
    'Bestellungen und Kunden zu Tripletex als Rechnung pro Bestellung oder monatlicher Sammelbeleg. Erstattungen werden zur Gutschrift.',
  'Tripletex er et norsk skybasert regnskapssystem for små og mellomstore selskaper. Integrasjonen gjør Shopify til salgskanal og Tripletex til regnskap, slik at ingen punsher ordre. Kunder og produkter opprettes i Tripletex første gang de dukker opp, og brukes igjen etterpå. Kundeoppslag skjer på e-post for B2C og organisasjonsnummer for B2B.':
    'Tripletex ist ein norwegisches cloudbasiertes Buchhaltungssystem für kleine und mittlere Unternehmen. Die Integration macht Shopify zum Verkaufskanal und Tripletex zur Buchhaltung, sodass niemand Bestellungen manuell erfasst. Kunden und Produkte werden in Tripletex beim ersten Auftreten angelegt und danach wiederverwendet. Die Kundensuche läuft über die E-Mail-Adresse für B2C und die Organisationsnummer für B2B.',
  'Manuell bokføring av nettbutikkordre er den vanligste kilden til avvik i mva-meldingen. Med integrasjonen får regnskapsfører riktig grunnlag hver dag, med Shopify-ordrenummer som referanse på hver faktura og kreditnota. Fakturaen opprettes, men sendes ikke automatisk, så regnskapsfører beholder kontrollen.':
    'Die manuelle Verbuchung von Onlineshop-Bestellungen ist die häufigste Quelle für Abweichungen in der Umsatzsteuermeldung. Mit der Integration erhält die Buchhaltung jeden Tag die richtige Grundlage, mit der Shopify-Bestellnummer als Referenz auf jeder Rechnung und Gutschrift. Die Rechnung wird erstellt, aber nicht automatisch versendet, sodass die Buchhaltung die Kontrolle behält.',
  'Kontoplan, mva-koder, kundegrupper, og om dere vil ha faktura per ordre eller samlebilag per måned. Én arbeidsøkt med regnskapsfører.':
    'Kontenplan, MwSt.-Codes, Kundengruppen, und ob Sie eine Rechnung pro Bestellung oder einen monatlichen Sammelbeleg wollen. Ein Arbeitstermin mit der Buchhaltung.',
  'Oppsett i Make.com': 'Einrichtung in Make.com',
  'API-token fra Tripletex, tilkobling i din Make-konto, scenario fra vår mal med kunde- og produktoppslag.':
    'API-Token aus Tripletex, Anbindung in Ihrem Make-Konto, Szenario aus unserer Vorlage mit Kunden- und Produktsuche.',
  'Test på reelle ordre': 'Test mit echten Bestellungen',
  'De første ordrene gjennom hele flyten. Regnskapsfører godkjenner fakturaene før de sendes.':
    'Die ersten Bestellungen durch den gesamten Fluss. Die Buchhaltung gibt die Rechnungen frei, bevor sie versendet werden.',
  'Vi følger de første ukene. Feilede kjøringer ligger synlig i Make-historikken og varsles med ordrenummer.':
    'Wir begleiten die ersten Wochen. Fehlgeschlagene Läufe sind im Make-Verlauf sichtbar und werden mit Bestellnummer gemeldet.',
  'Tripletex med API-tilgang (ansatt-token)': 'Tripletex mit API-Zugang (Mitarbeiter-Token)',
  'Shopify eller Shopify Plus': 'Shopify oder Shopify Plus',
  'Make.com-konto i ditt navn, vi setter opp om du ikke har': 'Make.com-Konto auf Ihren Namen, wir richten eines ein, falls Sie keines haben',
  'Kontoplan, mva-koder og forfall avklart med regnskapsfører': 'Kontenplan, MwSt.-Codes und Fälligkeit mit der Buchhaltung abgestimmt',
  'SKU eller EAN på alle varianter, så produktoppslag treffer': 'SKU oder EAN auf allen Varianten, damit die Produktsuche trifft',
  'Lager. Shopify er fasit, eller Omnium om du trenger OMS': 'Lager. Shopify ist führend, oder Omnium, wenn Sie ein OMS brauchen',
  'Betalingsstatus tilbake. Shopify-ordre er allerede betalt når de sendes': 'Zahlungsstatus zurück. Shopify-Bestellungen sind bereits bezahlt, wenn sie übertragen werden',
  'Kan vi bruke Tripletex sin egen Shopify-app i stedet?': 'Können wir stattdessen die eigene Shopify-App von Tripletex nutzen?',
  'Ja, for enkle B2C-butikker. Vår integrasjon er for deg som trenger samlebilag, B2B-faktura med org.nr, EDI via Omnium, egen mapping av mva og konto, eller fakturering som utløses av noe annet enn kassen.':
    'Ja, für einfache B2C-Shops. Unsere Integration ist für Sie, wenn Sie Sammelbelege, B2B-Rechnungen mit Organisationsnummer, EDI über Omnium, eigenes Mapping von MwSt. und Konten oder eine Fakturierung brauchen, die von etwas anderem als dem Checkout ausgelöst wird.',
  'Synker dere lager fra Tripletex til Shopify?': 'Gleichen Sie das Lager von Tripletex nach Shopify ab?',
  'Nei. Shopify er fasit for lager i denne integrasjonen. Trenger du lagerstyring på tvers av kanaler, er Omnium eller Holio riktig verktøy, og de kobler vi til.':
    'Nein. Shopify ist in dieser Integration führend für das Lager. Brauchen Sie Lagerverwaltung über mehrere Kanäle, sind Omnium oder Holio das richtige Werkzeug, und die binden wir an.',
  'Sendes fakturaene automatisk til kunden?': 'Werden die Rechnungen automatisch an den Kunden versendet?',
  'Nei. Fakturaen opprettes i Tripletex, og regnskapsfører sender den, eller setter opp Tripletex sin egen utsending. Det er et bevisst valg.':
    'Nein. Die Rechnung wird in Tripletex erstellt, und die Buchhaltung versendet sie oder richtet den eigenen Versand von Tripletex ein. Das ist eine bewusste Entscheidung.',
  'Eier vi Make.com-scenarioet?': 'Gehört uns das Make.com-Szenario?',
  'Ja. Scenarioet og tilkoblingene ligger i din Make-konto. Vi drifter om du vil, men du er ikke låst.':
    'Ja. Das Szenario und die Verbindungen liegen in Ihrem Make-Konto. Wir betreiben es auf Wunsch, aber Sie sind nicht gebunden.',

  // --- UniMicro ---
  'UniMicro-integrasjon for Shopify': 'UniMicro-Integration für Shopify',
  'UniMicro-integrasjonen kobler Shopify til UniMicro slik at varer og lager kommer fra ERP til nettbutikken, og ordre og kunder går tilbake. Den settes opp med UniMicro sin Shopify-kobling, og vi gjør kartlegging, mapping, test og go-live som del av en migrering eller nybygg.':
    'Die UniMicro-Integration verbindet Shopify mit UniMicro, sodass Artikel und Lager aus dem ERP in den Onlineshop kommen und Bestellungen und Kunden zurückgehen. Sie wird mit der eigenen Shopify-Anbindung von UniMicro eingerichtet, und wir übernehmen Analyse, Mapping, Test und Go-live als Teil einer Migration oder eines Neuaufbaus.',
  'Varer, lager, ordre og kunder mellom Shopify og UniMicro, med ERP som fasit for lager.':
    'Artikel, Lager, Bestellungen und Kunden zwischen Shopify und UniMicro, mit dem ERP als führendem System für das Lager.',
  'UniMicro er et norsk økonomisystem med egen Shopify-kobling. Her er ERP fasit for varer og lager, i motsetning til Tripletex-oppsettet der Shopify er fasit.':
    'UniMicro ist ein norwegisches Wirtschaftssystem mit eigener Shopify-Anbindung. Hier ist das ERP führend für Artikel und Lager, im Gegensatz zum Tripletex-Setup, bei dem Shopify führend ist.',
  'Butikker med fysisk lager og eget varesystem vil ikke vedlikeholde produkter to steder. Da må nettbutikken følge ERP.':
    'Händler mit physischem Lager und eigener Warenwirtschaft wollen Produkte nicht an zwei Stellen pflegen. Dann muss der Onlineshop dem ERP folgen.',
  'UniMicro med Shopify-kobling': 'UniMicro mit Shopify-Anbindung',
  'Varenummer som stemmer begge steder': 'Artikelnummern, die an beiden Stellen übereinstimmen',

  // --- Vipps ---
  'Vipps Hurtigkasse for Shopify': 'Vipps Hurtigkasse für Shopify',
  'Vipps Hurtigkasse lar kunden betale med ett trykk fra produktsiden, uten å fylle inn adresse. Vi setter opp Vipps sin Shopify-app, plasserer knappen riktig i tema og kasse, tester på mobil, og fører Vipps-oppgjøret mot egen betalingsmåte i regnskapet slik at bank og bokføring stemmer.':
    'Vipps Hurtigkasse lässt den Kunden mit einem Tipp von der Produktseite aus bezahlen, ohne eine Adresse einzugeben. Wir richten die Shopify-App von Vipps ein, platzieren den Button richtig in Theme und Checkout, testen auf dem Smartphone und buchen die Vipps-Abrechnung gegen eine eigene Zahlungsart in der Buchhaltung, damit Bank und Buchführung übereinstimmen.',
  'Ett trykk fra produktside til betalt ordre. Oppsett, test og go-live, og Vipps-oppgjør mot regnskapet.':
    'Ein Tipp von der Produktseite zur bezahlten Bestellung. Einrichtung, Test und Go-live, sowie Vipps-Abrechnung gegen die Buchhaltung.',
  'Vipps Hurtigkasse er en betalings- og kassemetode fra Vipps MobilePay. Kunden identifiseres med telefonnummer, og adresse og betaling hentes fra Vipps.':
    'Vipps Hurtigkasse ist eine Zahlungs- und Checkout-Methode von Vipps MobilePay. Der Kunde wird per Telefonnummer identifiziert, Adresse und Zahlung kommen aus Vipps.',
  'Norske kunder forventer Vipps. Hurtigkasse fjerner skjemaet, og det er skjemaet som dreper konvertering på mobil.':
    'Norwegische Kunden erwarten Vipps. Hurtigkasse entfernt das Formular, und es ist das Formular, das die Conversion auf dem Smartphone zunichtemacht.',
  'Vipps-avtale for nettbutikk': 'Vipps-Vertrag für den Onlineshop',
  'Regnskap med egen betalingsmåte for Vipps': 'Buchhaltung mit eigener Zahlungsart für Vipps',

  // --- Visma.net ---
  'Visma.net-integrasjon for Shopify': 'Visma.net-Integration für Shopify',
  'Visma.net-integrasjonen kobler Visma.net ERP til Shopify slik at varer, priser og lager kommer fra ERP, og ordre og kunder går tilbake som salgsordre. Vi bygger flyten mot Visma.net sitt API, med kø og retry, fordi volumet og feilhåndteringen i ERP-prosjekter krever det. Faktura og levering styres i Visma.net.':
    'Die Visma.net-Integration verbindet Visma.net ERP mit Shopify, sodass Artikel, Preise und Lager aus dem ERP kommen und Bestellungen und Kunden als Verkaufsaufträge zurückgehen. Wir bauen den Fluss gegen die Visma.net-API, mit Queue und Retry, weil Volumen und Fehlerbehandlung in ERP-Projekten das erfordern. Rechnung und Lieferung werden in Visma.net gesteuert.',
  'Visma.net som ERP og fasit for varer og lager, Shopify som salgskanal. Ordre og kunder tilbake via API.':
    'Visma.net als ERP und führendes System für Artikel und Lager, Shopify als Verkaufskanal. Bestellungen und Kunden zurück per API.',
  'Visma.net er Visma sitt skybaserte ERP for mellomstore selskaper, med eget API for varer, lager, kunder og salgsordre.':
    'Visma.net ist das cloudbasierte ERP von Visma für mittelgroße Unternehmen, mit eigener API für Artikel, Lager, Kunden und Verkaufsaufträge.',
  'Med ERP som fasit må nettbutikken oppdateres når lageret endres, og ordrene må inn i ERP uten at noen punsher dem.':
    'Mit dem ERP als führendem System muss der Onlineshop aktualisiert werden, sobald sich das Lager ändert, und die Bestellungen müssen ins ERP, ohne dass jemand sie manuell erfasst.',
  'Visma.net med API-tilgang': 'Visma.net mit API-Zugang',
  'Varenummer og lokasjoner avklart': 'Artikelnummern und Standorte abgestimmt',

  // --- Vuuh ---
  'Vuuh for Shopify': 'Vuuh für Shopify',
  'Vuuh-integrasjonen henter produktdata, bilder og lager fra merkevarene dine via Vuuh sin offisielle Shopify-app, så butikken slipper å legge inn leverandørenes produkter manuelt. Vi setter opp appen, mapping av merkenes kategorier til dine kolleksjoner, regler for hva som publiseres, og sjekker at varianter og strekkoder stemmer før første import.':
    'Die Vuuh-Integration holt Produktdaten, Bilder und Lagerbestände Ihrer Marken über die offizielle Shopify-App von Vuuh, damit der Shop die Produkte der Lieferanten nicht manuell anlegen muss. Wir richten die App ein, mappen die Kategorien der Marken auf Ihre Kollektionen, definieren Regeln für die Veröffentlichung und prüfen vor dem ersten Import, dass Varianten und Barcodes stimmen.',
  'Produktdata og lager fra leverandørene via Vuuh, rett inn i Shopify.':
    'Produktdaten und Lager von den Lieferanten über Vuuh, direkt in Shopify.',
  'Vuuh er en nordisk plattform der merkevarer deler produktdata med forhandlere. Shopify-appen er offisiell og plug-and-play.':
    'Vuuh ist eine nordische Plattform, auf der Marken Produktdaten mit Händlern teilen. Die Shopify-App ist offiziell und Plug-and-play.',
  'Forhandlere med mange merker bruker dager på produktdata. Vuuh leverer dem ferdig.':
    'Händler mit vielen Marken verbringen Tage mit Produktdaten. Vuuh liefert sie fertig.',
  'Vuuh-konto': 'Vuuh-Konto',
  'Merker som er på Vuuh': 'Marken, die auf Vuuh sind',
}

const missing = new Set<string>()
const tr = (s: string | undefined | null): string | undefined | null => {
  if (s == null || s === '') return s
  if (T[s] !== undefined) return T[s]
  missing.add(s)
  return s
}
const trBlocks = (blocks: Doc[] | undefined | null) =>
  Array.isArray(blocks)
    ? blocks.map((b) => (b._type === 'block' && Array.isArray(b.children)
      ? { ...b, children: b.children.map((c: Doc) => (c._type === 'span' ? { ...c, text: tr(c.text) } : c)) }
      : b))
    : blocks

const weak = (id: string, key?: string) => ({ _type: 'reference', _ref: id, _weak: true, ...(key ? { _key: key } : {}) })
const deId = (noId: string) => noId.replace(/-no$/, '-de')

// -no/-de pairs are mapped by id. Anything else (allPackagesPage, partnersPage, migratePage,
// shopifyPosPage, vippsHurtigkassePage, shopifyXPimPage, ...) is resolved by looking up the
// German document of the same type; dropped with a warning when none exists.
async function resolveRelated(noRef: string): Promise<string | null> {
  if (/-no$/.test(noRef)) return deId(noRef)
  const type = await client.fetch<string | null>('*[_id == $id][0]._type', { id: noRef })
  if (!type) return null
  const de = await client.fetch<string | null>('*[_type == $type && language == "de"][0]._id', { type })
  return de || null
}

function buildDe(no: Doc, related: Doc[]): Doc {
  const { _rev, _createdAt, _updatedAt, ...rest } = no
  const catKey = (no.category?._ref as string | undefined)?.match(/^integration-cat-(.+)-no$/)?.[1]
  if (!catKey) throw new Error(`${no._id}: cannot derive category key from ${no.category?._ref}`)
  return {
    ...rest,
    _id: deId(no._id),
    language: 'de',
    slug: { _type: 'slug', current: (no.slug?.current as string).replace(/^integrasjoner\//, 'integrations/') },
    pageTitle: tr(no.pageTitle),
    definition: tr(no.definition),
    shortDescription: tr(no.shortDescription),
    intro: trBlocks(no.intro) ?? [],
    whatItIs: trBlocks(no.whatItIs),
    whyItMatters: trBlocks(no.whyItMatters),
    sections: (no.sections ?? []).map((s: Doc) => ({ ...s, heading: tr(s.heading), anchor: tr(s.anchor), body: trBlocks(s.body) })),
    implementationSteps: (no.implementationSteps ?? []).map((s: Doc) => ({ ...s, name: tr(s.name), text: tr(s.text) })),
    prerequisites: (no.prerequisites ?? []).map((p: string) => tr(p)),
    notIncluded: (no.notIncluded ?? []).map((p: string) => tr(p)),
    faq: (no.faq ?? []).map((f: Doc) => ({ ...f, question: tr(f.question), answer: tr(f.answer) })),
    cta: no.cta ? { ...no.cta, heading: tr(no.cta.heading), text: tr(no.cta.text), buttonLabel: tr(no.cta.buttonLabel), buttonHref: '/contact' } : undefined,
    dataFlowSteps: (no.dataFlowSteps ?? []).map((d: Doc) => ({ ...d, payload: tr(d.payload), frequency: tr(d.frequency) })),
    ...(no.seoExtended ? { seoExtended: { ...no.seoExtended, metaTitle: tr(no.seoExtended.metaTitle), metaDescription: tr(no.seoExtended.metaDescription) } } : {}),
    category: weak(`integration-cat-${catKey}-de`),
    pillar: weak('pillar-integrasjoner-de'),
    clusterLinks: (no.clusterLinks ?? []).map((r: Doc) => weak(deId(r._ref), r._key)),
    relatedPages: related,
    relatedCaseStudies: no.relatedCaseStudies ?? [],
  }
}

async function main() {
  const noIds = SLUGS.map((s) => `integration-${s}-no`)
  const noDocs = await client.fetch<Doc[]>('*[_id in $ids]', { ids: noIds })
  const found = new Set(noDocs.map((d) => d._id))
  for (const id of noIds) if (!found.has(id)) throw new Error(`missing Norwegian source ${id} in ${dataset}`)

  for (const slug of SLUGS) {
    const no = noDocs.find((d) => d._id === `integration-${slug}-no`)!
    const related: Doc[] = []
    for (const r of no.relatedPages ?? []) {
      const de = await resolveRelated(r._ref)
      if (de) related.push(weak(de, r._key))
      else console.warn(dataset, no._id, 'dropping unresolved related ref', r._ref)
    }
    const de = buildDe(no, related)
    if (missing.size) {
      console.error('Untranslated strings:\n' + [...missing].map((s) => `  ${JSON.stringify(s)}`).join('\n'))
      throw new Error(`${missing.size} untranslated string(s) in ${no._id}`)
    }
    if (!DRY) await client.createOrReplace(de as any)
    console.log(dataset, DRY ? 'would write' : 'wrote', de._id, `(${String(de.definition).trim().split(/\s+/).length} words in definition)`, de.slug.current)

    const metaId = `integration-${slug}-meta`
    const deEntry = { _key: 'de', value: { _type: 'reference', _ref: de._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } }
    const meta = await client.fetch<{ keys: string[] } | null>('*[_id == $id][0]{ "keys": translations[]._key }', { id: metaId })
    if (!meta) {
      // Should not happen (meta exists with no + en); create it with no + de rather than fail.
      if (!DRY) await client.createOrReplace({
        _id: metaId, _type: 'translation.metadata', schemaTypes: ['integrationPage'], translations: [
          { _key: 'no', value: { _type: 'reference', _ref: no._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
          deEntry,
        ],
      })
      console.log(dataset, DRY ? 'would create' : 'created', metaId, '(no + de)')
    } else if ((meta.keys ?? []).includes('de')) {
      console.log(dataset, 'skip', metaId, 'already has de')
    } else {
      if (!DRY) await client.patch(metaId).insert('after', 'translations[-1]', [deEntry]).commit()
      console.log(dataset, DRY ? 'would patch' : 'patched', metaId, '+de')
    }
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
