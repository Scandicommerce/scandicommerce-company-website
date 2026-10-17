import { ui } from '@/components/integrations/labels'

interface MapSectionData {
  title?: string
  description?: string
  latitude?: number
  longitude?: number
}

function buildMapUrl(lat: number, lng: number): string {
  const delta = 0.01
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`
}

/** Office map in a hairline frame. */
export default function MapSection({ mapSection, lang = 'no' }: { mapSection?: MapSectionData; lang?: string }) {
  const lat = mapSection?.latitude ?? 59.9242
  const lng = mapSection?.longitude ?? 10.6994
  return (
    <section id="besok" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-8`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>{lang === 'no' ? 'Besøk oss' : 'Visit us'}</div>
            {mapSection?.title && <h2 className={ui.h2}>{mapSection.title}</h2>}
          </div>
          {mapSection?.description && <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{mapSection.description}</p>}
        </div>
        <div className="overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
          <iframe title="Scandicommerce kontor" src={buildMapUrl(lat, lng)} width="100%" height="380" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block w-full" />
        </div>
      </div>
    </section>
  )
}
