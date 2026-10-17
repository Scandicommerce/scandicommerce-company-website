import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'
import { partnerLang } from '@/lib/partnersCatalog'

const T = {
  no: {
    eyebrow: 'Slik velger vi partnere',
    fallback: 'Færre partnere. Bedre løsninger.',
    lead: 'Mange byråer viser en lang logovegg. Vi viser heller hvorfor hver partner er der – og hva du får ut av at vi jobber sammen.',
    cards: [
      { n: '01', title: 'Samme verdier', text: 'Åpne priser, tydelige leveranser og ingen byrådrama. Partnere som jobber på samme måte som oss, gjør fastpris mulig.' },
      { n: '02', title: 'Tydelig ansvar', text: 'Vi avtaler hvem som eier hva før prosjektet starter: data, ordre, lager, kundeklubb. Du vet alltid hvem som gjør hva.' },
      { n: '03', title: 'Testet i drift', text: 'Vi anbefaler løsninger vi har satt i drift hos ekte butikker – ikke det som ser best ut i en salgspresentasjon.' },
      { n: '04', title: 'Norsk der det teller', text: 'Kasselov, regnskap, Vipps og norske transportører. Vi velger partnere som kan det norske – så du slipper å forklare det.' },
    ],
    bandTitle: 'Vi anbefaler det som passer deg – også når det er enklest',
    bandText: 'Er Shopify Payments det beste valget, sier vi det. Er en app overkill for butikken din, sier vi det også. En partner kommer bare inn når den gjør løsningen din bedre.',
    bandCta: 'Få en ærlig anbefaling',
  },
  en: {
    eyebrow: 'How we choose partners',
    fallback: 'Fewer partners. Better solutions.',
    lead: 'Many agencies show a long logo wall. We would rather show why each partner is here, and what you get from us working together.',
    cards: [
      { n: '01', title: 'Shared values', text: 'Open pricing, clear deliverables and no agency drama. Partners who work the way we do make fixed prices possible.' },
      { n: '02', title: 'Clear ownership', text: 'We agree who owns what before the project starts: data, orders, inventory, loyalty. You always know who does what.' },
      { n: '03', title: 'Proven in production', text: 'We recommend solutions we have run for real stores, not what looks best in a sales deck.' },
      { n: '04', title: 'Nordic where it counts', text: 'Cash register law, accounting, Vipps and Nordic carriers. We pick partners who know the local rules, so you do not have to explain them.' },
    ],
    bandTitle: 'We recommend what fits you, even when it is the simplest option',
    bandText: 'If Shopify Payments is the best choice, we say so. If an app is overkill for your store, we say that too. A partner only comes in when it makes your solution better.',
    bandCta: 'Get an honest recommendation',
  },
  sv: {
    eyebrow: 'Så väljer vi partner',
    fallback: 'Färre partner. Bättre lösningar.',
    lead: 'Många byråer visar en lång logovägg. Vi visar hellre varför varje partner finns här – och vad du får ut av att vi jobbar tillsammans.',
    cards: [
      { n: '01', title: 'Samma värderingar', text: 'Öppna priser, tydliga leveranser och inget byrådrama. Partner som jobbar på samma sätt som vi gör fast pris möjligt.' },
      { n: '02', title: 'Tydligt ansvar', text: 'Vi avtalar vem som äger vad innan projektet startar: data, ordrar, lager, kundklubb. Du vet alltid vem som gör vad.' },
      { n: '03', title: 'Testat i drift', text: 'Vi rekommenderar lösningar vi har satt i drift hos riktiga butiker – inte det som ser bäst ut i en säljpresentation.' },
      { n: '04', title: 'Nordiskt där det räknas', text: 'Kassalag, bokföring, Vipps och nordiska transportörer. Vi väljer partner som kan det lokala – så att du slipper förklara det.' },
    ],
    bandTitle: 'Vi rekommenderar det som passar dig – även när det är enklast',
    bandText: 'Är Shopify Payments det bästa valet säger vi det. Är en app overkill för din butik säger vi det också. En partner kommer bara in när den gör din lösning bättre.',
    bandCta: 'Få en ärlig rekommendation',
  },
  da: {
    eyebrow: 'Sådan vælger vi partnere',
    fallback: 'Færre partnere. Bedre løsninger.',
    lead: 'Mange bureauer viser en lang logovæg. Vi viser hellere, hvorfor hver partner er her – og hvad du får ud af, at vi arbejder sammen.',
    cards: [
      { n: '01', title: 'Samme værdier', text: 'Åbne priser, tydelige leverancer og intet bureaudrama. Partnere, der arbejder på samme måde som os, gør fast pris muligt.' },
      { n: '02', title: 'Tydeligt ansvar', text: 'Vi aftaler, hvem der ejer hvad, før projektet starter: data, ordrer, lager, kundeklub. Du ved altid, hvem der gør hvad.' },
      { n: '03', title: 'Testet i drift', text: 'Vi anbefaler løsninger, vi har sat i drift hos rigtige butikker – ikke det, der ser bedst ud i en salgspræsentation.' },
      { n: '04', title: 'Nordisk hvor det tæller', text: 'Kasselov, regnskab, Vipps og nordiske transportører. Vi vælger partnere, der kan det lokale – så du slipper for at forklare det.' },
    ],
    bandTitle: 'Vi anbefaler det, der passer til dig – også når det er enklest',
    bandText: 'Er Shopify Payments det bedste valg, siger vi det. Er en app overkill for din butik, siger vi også det. En partner kommer kun ind, når den gør din løsning bedre.',
    bandCta: 'Få en ærlig anbefaling',
  },
  de: {
    eyebrow: 'So wählen wir Partner aus',
    fallback: 'Weniger Partner. Bessere Lösungen.',
    lead: 'Viele Agenturen zeigen eine lange Logowand. Wir zeigen lieber, warum jeder Partner hier ist – und was Sie davon haben, dass wir zusammenarbeiten.',
    cards: [
      { n: '01', title: 'Gleiche Werte', text: 'Offene Preise, klare Leistungen und kein Agenturdrama. Partner, die so arbeiten wie wir, machen Festpreise möglich.' },
      { n: '02', title: 'Klare Verantwortung', text: 'Wir klären vor Projektstart, wer was verantwortet: Daten, Bestellungen, Lager, Kundenprogramm. Sie wissen immer, wer was macht.' },
      { n: '03', title: 'Im Betrieb bewährt', text: 'Wir empfehlen Lösungen, die wir bei echten Geschäften in Betrieb genommen haben – nicht das, was in einer Verkaufspräsentation am besten aussieht.' },
      { n: '04', title: 'Nordisch, wo es zählt', text: 'Kassengesetz, Buchhaltung, Vipps und nordische Carrier. Wir wählen Partner, die die lokalen Regeln kennen – damit Sie sie nicht erklären müssen.' },
    ],
    bandTitle: 'Wir empfehlen, was zu Ihnen passt – auch wenn es die einfachste Option ist',
    bandText: 'Ist Shopify Payments die beste Wahl, sagen wir das. Ist eine App für Ihren Shop überdimensioniert, sagen wir auch das. Ein Partner kommt nur ins Spiel, wenn er Ihre Lösung besser macht.',
    bandCta: 'Ehrliche Empfehlung erhalten',
  },
}

/** Why the list is short, from the Sanity "why our partnership" section title. */
export default function HowWeChoose({ title, contactHref, lang = 'no' }: { title?: string; contactHref: string; lang?: string }) {
  const t = T[partnerLang(lang)]
  const CARDS = t.cards
  return (
    <section id="slik-velger-vi" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-10 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>{t.eyebrow}</div>
            <h2 className={ui.h2}>{title || t.fallback}</h2>
          </div>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{t.lead}</p>
        </div>
        <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {CARDS.map((c) => (
            <li key={c.n} className={`${ui.card} hover:-translate-y-1`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sc-cyan-500 font-mono text-sm font-bold text-sc-ink-900">{c.n}</span>
              <h3 className="m-0 text-[20px] font-bold leading-tight tracking-[-0.01em] text-sc-ink-900">{c.title}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{c.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-col gap-5 rounded-lg bg-sc-ink-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="max-w-[760px]">
            <h3 className="m-0 text-[20px] font-bold leading-tight">{t.bandTitle}</h3>
            <p className="mb-0 mt-2 text-[15px] leading-relaxed text-sc-ink-200">{t.bandText}</p>
          </div>
          <LocalizedLink href={contactHref} className="inline-flex min-h-[46px] flex-none items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 hover:bg-sc-ink-50">
            {t.bandCta}
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
