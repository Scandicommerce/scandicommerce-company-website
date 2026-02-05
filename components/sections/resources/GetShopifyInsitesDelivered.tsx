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
  const title = newsletterCta?.title || 'Ready for results like these?'
  const description = newsletterCta?.description || "Let's discuss your project and how we can help you grow"
  const emailPlaceholder = newsletterCta?.emailPlaceholder || 'your@email.com'
  const buttonText = newsletterCta?.buttonText || 'Subscribe'

  return (
    <section className="bg-[#03C1CA] py-16 lg:py-[170px]">
      <div className="section_container mx-auto page-padding-x">
        <div className="text-center flex flex-col items-center justify-start lg:gap-[91px] gap-16">
          <div className="flex flex-col items-center justify-start lg:gap-7 gap-4">
            <h2 className="lg:text-[48px] sm:text-4xl text-3xl font-bold text-white mb-4 lg:mb-6">
              {title}
            </h2>

            <p className="lg:text-[24px] sm:text-lg text-base text-white">
              {description}
            </p>
          </div>

          <div className="flex justify-center items-center gap-0 w-full max-w-2xl">
            <input
              type="email"
              className="text-[#000] placeholder:text-[#1F1D1D80] sm:p-[18px] p-[12px] text-base focus:outline-none bg-white flex-1 min-w-0"
              placeholder={emailPlaceholder}
            />
            <button
              type="submit"
              className="bg-[#1F1D1D] text-white px-3 sm:px-8 sm:py-[18px] py-[14px] text-sm sm:text-base font-semibold hover:bg-[#2a2727] transition-colors whitespace-nowrap"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
