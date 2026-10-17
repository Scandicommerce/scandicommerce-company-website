/**
 * Enterprise is not a way to spread the cost of a project. Migrations of several stores are
 * their own fixed-ceiling project paid by milestone; the Enterprise day covers optimisation
 * and operations of the stores already moved. Patches the published Enterprise package page
 * in all five languages (FAQ, ideal-for line, migration item list). Leaves drafts alone.
 *
 *   TARGET_DATASET=production npx sanity exec scripts/sanity-enterprise-no-financing.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'development'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })

type Copy = {
  idealFor: string
  migrationItems: string[]
  migration: { question: string; answer: string }
  prioritise: { question: string; answer: string }
  scale: { question: string; answer: string }
}

const COPY: Record<string, Copy> = {
  no: {
    idealFor: 'Planlegger du en migrering av flere butikker og vil ha én partner gjennom hele løpet',
    migrationItems: [
      'Migrering av flere butikker gjennomføres som et eget prosjekt med fast maksramme',
      'Prosjektet faktureres etter milepæler, ikke fordelt på månedsavgiften',
      'Én butikk om gangen, eller parallelle migreringer med koordinerte lanseringer',
      'Enterprise-dagen brukes til optimalisering og drift av butikkene som allerede er flyttet',
      'Prioritert planlegging for Enterprise-kunder',
      'Typisk tidslinje: 3–18 måneder, avhengig av antall butikker og kompleksitet',
    ],
    migration: {
      question: 'Kan Enterprise brukes til migrering av flere butikker?',
      answer: 'Ikke som en måte å fordele kostnaden på. Enterprise er en løpende avtale for videreutvikling og drift. En migrering av flere butikker gjennomføres som et eget prosjekt med fast maksramme og betaling etter milepæler. Som Enterprise-kunde får du prioritert planlegging, og Enterprise-dagen brukes til optimalisering og drift av butikkene som allerede er flyttet.',
    },
    prioritise: {
      question: 'Hvordan prioriterer dere arbeidet hver uke?',
      answer: 'Vi planlegger sammen hver uke ut fra veikartet. Faste oppgaver som drift og support tar en liten del av dagen, resten går til det som gir størst effekt: testing, utvikling, SEO og systemene dine.',
    },
    scale: {
      question: 'Hva om vi trenger mer enn én dag per uke i travle perioder?',
      answer: 'Enterprise kan skaleres. I travle perioder kan vi midlertidig øke til 2–3 dager per uke (60 000–90 000 NOK/måned), og deretter skalere ned igjen. Dere betaler for kapasiteten i periodene dere bruker den.',
    },
  },
  en: {
    idealFor: 'Are planning a multi-store migration and want one partner throughout',
    migrationItems: [
      'Multi-store migrations run as their own project with a fixed price ceiling',
      'The project is invoiced by milestone, not spread across the monthly fee',
      'One store at a time, or parallel migrations with coordinated launches',
      'The Enterprise day goes to optimising and running the stores already migrated',
      'Priority scheduling for Enterprise clients',
      'Typical timeline: 3–18 months depending on number of stores and complexity',
    ],
    migration: {
      question: 'Can Enterprise be used for a multi-store migration?',
      answer: 'Not as a way to spread the cost. Enterprise is an ongoing agreement for development and operations. A multi-store migration runs as its own project with a fixed price ceiling and payment by milestone. As an Enterprise client you get priority scheduling, and the Enterprise day goes to optimising and running the stores already migrated.',
    },
    prioritise: {
      question: 'How do you prioritise the work each week?',
      answer: 'We plan together every week from the roadmap. Recurring tasks such as operations and support take a small part of the day; the rest goes to what has the most impact: testing, development, SEO and your systems.',
    },
    scale: {
      question: 'What if we need more than one day per week during busy periods?',
      answer: 'Enterprise scales. During busy periods we can temporarily increase to 2–3 days per week (60,000–90,000 NOK/month), then scale back down. You pay for the capacity in the periods you use it.',
    },
  },
  sv: {
    idealFor: 'Planerar du en migrering av flera butiker och vill ha en partner genom hela resan',
    migrationItems: [
      'Migrering av flera butiker genomförs som ett eget projekt med fast maxbelopp',
      'Projektet faktureras efter milstolpar, inte fördelat på månadsavgiften',
      'En butik i taget, eller parallella migreringar med samordnade lanseringar',
      'Enterprise-dagen används till optimering och drift av butikerna som redan är flyttade',
      'Prioriterad planering för Enterprise-kunder',
      'Typisk tidslinje: 3–18 månader beroende på antal butiker och komplexitet',
    ],
    migration: {
      question: 'Kan Enterprise användas för en migrering av flera butiker?',
      answer: 'Inte som ett sätt att fördela kostnaden. Enterprise är ett löpande avtal för vidareutveckling och drift. En migrering av flera butiker genomförs som ett eget projekt med fast maxbelopp och betalning efter milstolpar. Som Enterprise-kund får du prioriterad planering, och Enterprise-dagen används till optimering och drift av butikerna som redan är flyttade.',
    },
    prioritise: {
      question: 'Hur prioriterar ni arbetet varje vecka?',
      answer: 'Vi planerar tillsammans varje vecka utifrån färdplanen. Återkommande uppgifter som drift och support tar en liten del av dagen, resten går till det som ger störst effekt: testning, utveckling, SEO och era system.',
    },
    scale: {
      question: 'Vad händer om vi behöver mer än en dag per vecka under intensiva perioder?',
      answer: 'Enterprise kan skalas. Under intensiva perioder kan vi tillfälligt öka till 2–3 dagar per vecka (60 000–90 000 NOK/månad) och sedan skala ner igen. Ni betalar för kapaciteten under de perioder ni använder den.',
    },
  },
  da: {
    idealFor: 'Planlægger du en migrering af flere butikker og vil have én partner hele vejen',
    migrationItems: [
      'Migrering af flere butikker gennemføres som et selvstændigt projekt med fast prisloft',
      'Projektet faktureres efter milepæle, ikke fordelt på den månedlige betaling',
      'Én butik ad gangen eller parallelle migreringer med koordinerede lanceringer',
      'Enterprise-dagen bruges til optimering og drift af de butikker, der allerede er flyttet',
      'Prioriteret planlægning for Enterprise-kunder',
      'Typisk tidslinje: 3–18 måneder afhængigt af antal butikker og kompleksitet',
    ],
    migration: {
      question: 'Kan Enterprise bruges til migrering af flere butikker?',
      answer: 'Ikke som en måde at fordele omkostningen på. Enterprise er en løbende aftale om videreudvikling og drift. En migrering af flere butikker gennemføres som et selvstændigt projekt med fast prisloft og betaling efter milepæle. Som Enterprise-kunde får du prioriteret planlægning, og Enterprise-dagen bruges til optimering og drift af de butikker, der allerede er flyttet.',
    },
    prioritise: {
      question: 'Hvordan prioriterer I arbejdet hver uge?',
      answer: 'Vi planlægger sammen hver uge ud fra køreplanen. Faste opgaver som drift og support fylder en lille del af dagen, resten går til det, der giver størst effekt: test, udvikling, SEO og jeres systemer.',
    },
    scale: {
      question: 'Hvad nu, hvis vi har brug for mere end én dag om ugen i travle perioder?',
      answer: 'Enterprise kan skaleres. I travle perioder kan vi midlertidigt øge til 2–3 dage om ugen (60.000–90.000 NOK/md.) og derefter skalere ned igen. I betaler for kapaciteten i de perioder, I bruger den.',
    },
  },
  de: {
    idealFor: 'Planen Sie eine Migration mehrerer Shops und wollen einen Partner für den gesamten Weg',
    migrationItems: [
      'Migrationen mehrerer Shops laufen als eigenes Projekt mit festem Kostenrahmen',
      'Das Projekt wird nach Meilensteinen abgerechnet, nicht über die Monatsgebühr verteilt',
      'Ein Shop nach dem anderen oder parallele Migrationen mit koordinierten Launches',
      'Der Enterprise-Tag dient der Optimierung und dem Betrieb bereits migrierter Shops',
      'Bevorzugte Terminplanung für Enterprise-Kunden',
      'Typischer Zeitrahmen: 3–18 Monate, abhängig von Anzahl der Shops und Komplexität',
    ],
    migration: {
      question: 'Kann Enterprise für eine Migration mehrerer Shops genutzt werden?',
      answer: 'Nicht, um die Kosten zu verteilen. Enterprise ist eine laufende Vereinbarung für Weiterentwicklung und Betrieb. Eine Migration mehrerer Shops läuft als eigenes Projekt mit festem Kostenrahmen und Zahlung nach Meilensteinen. Als Enterprise-Kunde erhalten Sie bevorzugte Terminplanung, und der Enterprise-Tag dient der Optimierung und dem Betrieb der bereits migrierten Shops.',
    },
    prioritise: {
      question: 'Wie priorisieren Sie die Arbeit jede Woche?',
      answer: 'Wir planen jede Woche gemeinsam anhand der Roadmap. Wiederkehrende Aufgaben wie Betrieb und Support nehmen einen kleinen Teil des Tages ein, der Rest geht in das, was am meisten bewirkt: Tests, Entwicklung, SEO und Ihre Systeme.',
    },
    scale: {
      question: 'Was ist, wenn wir in intensiven Phasen mehr als einen Tag pro Woche benötigen?',
      answer: 'Enterprise ist skalierbar. In intensiven Phasen können wir vorübergehend auf 2–3 Tage pro Woche erhöhen (60.000–90.000 NOK/Monat) und danach wieder zurückskalieren. Sie zahlen für die Kapazität in den Phasen, in denen Sie sie nutzen.',
    },
  },
}

const FAQ_KEYS = { migration: 'a451d06253ae', prioritise: 'ad8d95a1d2d3', scale: 'ae26bd3fbd01' } as const
const MIGRATION_CATEGORY = '5c2d582dab19'

type Section = { _key: string; _type: string; idealFor?: string[]; includedCategories?: { _key: string }[]; faq?: { _key: string }[] }

async function main() {
  const docs = await client.fetch<{ _id: string; language: string; sections: Section[] }[]>(
    `*[_type == "packageDetailPage" && slug.current match "*enterprise" && !(_id in path("drafts.**"))]{ _id, language, sections }`,
  )
  for (const doc of docs) {
    const c = COPY[doc.language]
    if (!c) continue
    const ideal = doc.sections.find((s) => s._type === 'packageDetailPageIdealForSection')
    const cats = doc.sections.find((s) => s.includedCategories?.some((x) => x._key === MIGRATION_CATEGORY))
    const faq = doc.sections.find((s) => s.faq?.some((x) => x._key === FAQ_KEYS.migration))
    const set: Record<string, unknown> = {}
    if (ideal?.idealFor && ideal.idealFor.length > 3) set[`sections[_key=="${ideal._key}"].idealFor[3]`] = c.idealFor
    if (cats) set[`sections[_key=="${cats._key}"].includedCategories[_key=="${MIGRATION_CATEGORY}"].items`] = c.migrationItems
    if (faq) {
      for (const [name, key] of Object.entries(FAQ_KEYS)) {
        const v = c[name as keyof typeof FAQ_KEYS]
        set[`sections[_key=="${faq._key}"].faq[_key=="${key}"].question`] = v.question
        set[`sections[_key=="${faq._key}"].faq[_key=="${key}"].answer`] = v.answer
      }
    }
    await client.patch(doc._id).set(set).commit()
    console.log(`${dataset}: ${doc._id} (${doc.language}) ${Object.keys(set).length} fields`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
