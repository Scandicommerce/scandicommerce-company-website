import { ui } from '@/components/integrations/labels'
import { ImpactCards, resolveHref } from '@/components/sections/shopify/shopify_x_PIM/IntegratingPIM'

interface AICapability {
  title?: string
  description?: string
  features?: string[]
  /** Legacy colour hint from Sanity; the panel is always ink now. */
  bgColor?: string
  impactTitle?: string
  impactParagraph1?: string
  impactParagraph2?: string
  linkText?: string
  linkSlug?: string | null
  linkHref?: string | null
}

interface HowWeLeverageAiData {
  title?: string
  capabilities?: AICapability[]
}

interface HowWeLeverageAIProps {
  howWeLeverageAi?: HowWeLeverageAiData
  lang?: string
}

const DEFAULTS: Record<'no' | 'en', { title: string; capabilities: AICapability[] }> = {
  en: {
    title: 'How we leverage AI-powered tools in Shopify',
    capabilities: [
      {
        title: 'Enhanced development efficiency',
        description: 'We use AI-powered development tools to streamline the Shopify implementation process:',
        features: ['AI-assisted code generation for custom theme features', 'Automated testing and quality assurance', 'Rapid content creation for store pages', 'Streamlined problem-solving and debugging'],
        impactTitle: 'The impact',
        impactParagraph1: 'By incorporating AI-powered tools into our development workflow, we can complete projects more efficiently while maintaining high quality standards.',
        impactParagraph2: 'For you, this means getting your Shopify store up and running faster, implementing new features more quickly, and staying ahead of market trends.',
        linkText: 'Significantly reduced development timelines',
      },
      {
        title: 'Improved customer experiences',
        description: 'We integrate best-in-class AI tools to enhance how customers interact with your store:',
        features: ['Smart product recommendation apps', 'Intelligent search that understands customer intent', 'Targeted content based on user behaviour', 'Automated email marketing that adapts to customer actions'],
        impactTitle: 'The impact',
        impactParagraph1: 'These tools help create more relevant shopping experiences that respond to customer preferences and behaviours, increasing engagement and conversion.',
        impactParagraph2: 'By implementing proven solutions, we help you offer the personalised experience customers expect from leading e-commerce brands.',
        linkText: 'Enhanced customer engagement through personalisation',
      },
      {
        title: 'Efficient store management',
        description: 'We implement AI-powered tools that simplify running your Shopify store:',
        features: ['Content assistants for product descriptions', 'Inventory management with predictive features', 'Customer support automation through chatbots', 'Data analysis tools for business insights'],
        impactTitle: 'The impact',
        impactParagraph1: 'These tools reduce the time spent on routine tasks, so you can focus on strategy and growth.',
        impactParagraph2: 'By automating repetitive parts of store management, you operate more efficiently while still providing excellent customer service.',
        linkText: 'More efficient operations and resource allocation',
      },
    ],
  },
  no: {
    title: 'Slik bruker vi KI-verktøy i Shopify',
    capabilities: [
      {
        title: 'Raskere utvikling',
        description: 'Vi bruker KI-støttede utviklingsverktøy for å effektivisere Shopify-implementeringen:',
        features: ['KI-assistert kode for tilpassede temafunksjoner', 'Automatisert testing og kvalitetssikring', 'Rask innholdsproduksjon for butikksider', 'Raskere feilsøking'],
        impactTitle: 'Effekten',
        impactParagraph1: 'Med KI-verktøy i arbeidsflyten leverer vi prosjekter raskere uten å gå på akkord med kvaliteten.',
        impactParagraph2: 'For deg betyr det at nettbutikken er oppe raskere, nye funksjoner kommer fortere, og du ligger foran markedet.',
        linkText: 'Vesentlig kortere utviklingstid',
      },
      {
        title: 'Bedre kundeopplevelser',
        description: 'Vi integrerer de beste KI-verktøyene for å forbedre hvordan kundene møter butikken din:',
        features: ['Smarte produktanbefalinger', 'Søk som forstår hva kunden mener', 'Innhold tilpasset kundens atferd', 'Automatisert e-postmarkedsføring som tilpasser seg'],
        impactTitle: 'Effekten',
        impactParagraph1: 'Verktøyene gir mer relevante handleopplevelser som svarer på kundenes preferanser, og øker engasjement og konvertering.',
        impactParagraph2: 'Med utprøvde løsninger gir du kundene den personlige opplevelsen de forventer fra ledende nettbutikker.',
        linkText: 'Høyere engasjement gjennom personalisering',
      },
      {
        title: 'Effektiv drift',
        description: 'Vi setter opp KI-verktøy som forenkler driften av Shopify-butikken:',
        features: ['Innholdsassistenter for produktbeskrivelser', 'Lagerstyring med prediksjon', 'Kundeservice-automatisering med chatbot', 'Dataanalyse for bedre beslutninger'],
        impactTitle: 'Effekten',
        impactParagraph1: 'Verktøyene kutter tiden brukt på rutineoppgaver, så du kan bruke den på strategi og vekst.',
        impactParagraph2: 'Når det repetitive er automatisert, driver du mer effektivt og gir fortsatt god kundeservice.',
        linkText: 'Mer effektiv drift og bedre ressursbruk',
      },
    ],
  },
}

/** Each capability as the ink/white impact card pair, stacked. */
export default function HowWeLeverageAI({ howWeLeverageAi, lang = 'no' }: HowWeLeverageAIProps) {
  const isNo = lang === 'no'
  const defaults = DEFAULTS[isNo ? 'no' : 'en']
  const title = howWeLeverageAi?.title || defaults.title
  const capabilities = howWeLeverageAi?.capabilities && howWeLeverageAi.capabilities.length > 0 ? howWeLeverageAi.capabilities : defaults.capabilities

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{isNo ? 'Slik bruker vi KI' : 'How we use AI'}</div>
          <h2 className={ui.h2}>{title}</h2>
        </div>
        <div className="flex flex-col gap-5">
          {capabilities.map((c, i) => (
            <ImpactCards
              key={i}
              leftTitle={c.title}
              leftDescription={c.description}
              points={c.features}
              impactTitle={c.impactTitle}
              impactParagraph1={c.impactParagraph1}
              impactParagraph2={c.impactParagraph2}
              linkText={c.linkText}
              href={resolveHref(c.linkSlug, c.linkHref)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
