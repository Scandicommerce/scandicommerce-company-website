interface NewsletterCtaData {
  title?: string
  description?: string
  emailPlaceholder?: string
  buttonText?: string
}

interface GetShopifyInsitesDeliveredProps {
  newsletterCta?: NewsletterCtaData
}

export default function GetShopifyInsitesDelivered({ newsletterCta }: GetShopifyInsitesDeliveredProps) {
  const title = newsletterCta?.title || 'One email a month. No tracking, no fluff — just what we shipped and what we learned.'
  const emailPlaceholder = newsletterCta?.emailPlaceholder || 'din@epost.no'
  const buttonText = newsletterCta?.buttonText || 'SUBSCRIBE'

  return (
    <section className="relative py-14 overflow-hidden bg-[#0A0A0B]">
      {/* Cyan radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(30,239,250,0.25), rgba(30,239,250,0) 60%)' }}
      />

      <div className="relative section_container mx-auto page-padding-x">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Left: copy */}
          <div className="max-w-xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1EEFFA] mb-3">
              Notes from the studio
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#F1F3F5] leading-snug" style={{ letterSpacing: '-0.01em' }}>
              {title}
            </h3>
          </div>

          {/* Right: form */}
          <div className="flex gap-0 mt-2 flex-shrink-0 w-full md:w-auto">
            <input
              type="email"
              placeholder={emailPlaceholder}
              className="bg-[#15171A] text-white text-sm px-4 py-3 outline-none flex-1 md:w-64 focus:ring-1 focus:ring-teal"
              style={{ border: '1px solid #26292E' }}
            />
            <button
              type="submit"
              className="px-6 py-3 text-[11px] font-bold tracking-[0.10em] uppercase text-[#1F1D1D] bg-[#1EEFFA] hover:bg-teal-light transition-colors duration-200 whitespace-nowrap shadow-button"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
