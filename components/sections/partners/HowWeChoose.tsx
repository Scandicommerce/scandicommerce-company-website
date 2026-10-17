import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'

const CARDS = [
  { n: '01', title: 'Samme verdier', text: 'Åpne priser, tydelige leveranser og ingen byrådrama. Partnere som jobber på samme måte som oss, gjør fastpris mulig.' },
  { n: '02', title: 'Tydelig ansvar', text: 'Vi avtaler hvem som eier hva før prosjektet starter: data, ordre, lager, kundeklubb. Du vet alltid hvem som gjør hva.' },
  { n: '03', title: 'Testet i drift', text: 'Vi anbefaler løsninger vi har satt i drift hos ekte butikker – ikke det som ser best ut i en salgspresentasjon.' },
  { n: '04', title: 'Norsk der det teller', text: 'Kasselov, regnskap, Vipps og norske transportører. Vi velger partnere som kan det norske – så du slipper å forklare det.' },
]

/** Why the list is short, from the Sanity "why our partnership" section title. */
export default function HowWeChoose({ title, contactHref }: { title?: string; contactHref: string }) {
  return (
    <section id="slik-velger-vi" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-10 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>Slik velger vi partnere</div>
            <h2 className={ui.h2}>{title || 'Færre partnere. Bedre løsninger.'}</h2>
          </div>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">Mange byråer viser en lang logovegg. Vi viser heller hvorfor hver partner er der – og hva du får ut av at vi jobber sammen.</p>
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
            <h3 className="m-0 text-[20px] font-bold leading-tight">Vi anbefaler det som passer deg – også når det er enklest</h3>
            <p className="mb-0 mt-2 text-[15px] leading-relaxed text-sc-ink-200">Er Shopify Payments det beste valget, sier vi det. Er en app overkill for butikken din, sier vi det også. En partner kommer bare inn når den gjør løsningen din bedre.</p>
          </div>
          <LocalizedLink href={contactHref} className="inline-flex min-h-[46px] flex-none items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 hover:bg-sc-ink-50">
            Få en ærlig anbefaling
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
