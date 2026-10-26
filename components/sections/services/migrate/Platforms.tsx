import { ui } from '@/components/integrations/labels'

interface PlatformsData {
  platformsEyebrow?: string
  platformsTitle?: string
  platformsItems?: Array<{
    name: string
    duration: string
  }>
}

interface PlatformsProps {
  platforms?: PlatformsData
  lang?: string
}

/** Source platforms as hairline cards with the typical duration in mono. */
export default function Platforms({ platforms, lang }: PlatformsProps) {
  const isNo = (lang ?? 'no') === 'no'
  const title = platforms?.platformsTitle
  const items = platforms?.platformsItems

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        {title && (
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <div className={ui.eyebrow}>{platforms?.platformsEyebrow || (isNo ? 'Plattformer' : 'Platforms')}</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {items.map((platform, index) => (
              <div key={index} className="flex flex-col gap-2 rounded-lg border border-sc-ink-100 bg-white p-6">
                {platform.name && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{platform.name}</h3>}
                {platform.duration && <p className="m-0 font-mono text-[13px] text-sc-ink-500">{platform.duration}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
