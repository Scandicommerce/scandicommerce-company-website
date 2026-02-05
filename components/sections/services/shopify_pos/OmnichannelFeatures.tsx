'use client'

interface FeaturesData {
  featuresTitle?: string
  featuresItems?: Array<{
    title: string
    description: string
    icon?: string
  }>
}

interface OmnichannelFeaturesProps {
  features?: FeaturesData
}

const iconClassName = 'w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 shrink-0'

const IconInventory = ({ className = iconClassName }: { className?: string }) => (
  <svg className={className} viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.44068 7.69735H10.417V9.23682C10.417 10.9303 11.7564 12.3158 13.3933 12.3158H22.3223C23.9593 12.3158 25.2986 10.9303 25.2986 9.23682V7.69735H28.275V15.3947H31.2513V7.69735C31.2513 6.00392 29.9119 4.61839 28.275 4.61839H22.0544C21.4294 2.83259 19.7924 1.53943 17.8578 1.53943C15.9232 1.53943 14.2862 2.83259 13.6612 4.61839H7.44068C5.8037 4.61839 4.46436 6.00392 4.46436 7.69735V29.2501C4.46436 30.9435 5.8037 32.329 7.44068 32.329H16.3697V29.2501H7.44068V7.69735ZM17.8578 4.61839C18.6763 4.61839 19.346 5.31115 19.346 6.15787C19.346 7.00458 18.6763 7.69735 17.8578 7.69735C17.0393 7.69735 16.3697 7.00458 16.3697 6.15787C16.3697 5.31115 17.0393 4.61839 17.8578 4.61839Z" fill="white" />
    <path d="M32.3671 18.8586C31.7569 18.2275 30.745 18.2275 30.1348 18.8586L23.0809 26.1712L19.7177 22.7073C19.1075 22.0762 18.1105 22.0762 17.4854 22.7073C16.8753 23.3385 16.8753 24.3854 17.4854 25.0166L22.0243 29.6966C22.6047 30.297 23.5423 30.297 24.1226 29.6966L32.3522 21.1679C32.9772 20.5367 32.9772 19.4898 32.3671 18.8586Z" fill="white" />
  </svg>
)

const IconCollect = ({ className = iconClassName }: { className?: string }) => (
  <svg className={className} viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M33.5918 10.3632V5.48438C33.5918 4.81025 33.0472 4.26562 32.3731 4.26562H6.62698C5.95286 4.26562 5.40823 4.81025 5.40823 5.48438V10.3632C4.77219 10.4013 4.26565 10.9307 4.26565 11.5781V16.594C4.26321 17.5159 4.44987 18.4284 4.81409 19.2753C4.97786 19.6638 5.17971 20.0294 5.40823 20.376V33.5156C5.40823 34.1859 5.95286 34.7344 6.62698 34.7344H32.3731C33.0472 34.7344 33.5918 34.1897 33.5918 33.5156V20.376C33.8239 20.0285 34.0229 19.66 34.186 19.2753C34.5478 18.426 34.7344 17.5233 34.7344 16.594V11.5781C34.7344 10.9307 34.2279 10.4013 33.5918 10.3632ZM8.15041 7.00781H30.8496V10.3594H8.15041V7.00781ZM21.9375 31.996H17.0625V28.0312H21.9375V31.996ZM30.8496 31.996H24.375V26.8125C24.375 26.1384 23.8304 25.5938 23.1563 25.5938H15.8438C15.1697 25.5938 14.625 26.1384 14.625 26.8125V31.996H8.15041V22.7716C8.26086 22.8249 8.37512 22.8782 8.49319 22.9239C9.3425 23.2819 10.2451 23.4609 11.1744 23.4609C12.1037 23.4609 13.0026 23.2819 13.8557 22.9239C14.3813 22.703 14.8764 22.4212 15.3296 22.0822C15.3372 22.0784 15.3448 22.0784 15.3525 22.0822C15.8071 22.4226 16.3022 22.7054 16.8264 22.9239C17.6757 23.2819 18.5783 23.4609 19.5076 23.4609C20.4369 23.4609 21.3358 23.2819 22.1889 22.9239C22.7145 22.703 23.2096 22.4212 23.6628 22.0822C23.6704 22.0784 23.6781 22.0784 23.6857 22.0822C24.1403 22.4226 24.6354 22.7054 25.1596 22.9239C26.0089 23.2819 26.9115 23.4609 27.8408 23.4609C28.7701 23.4609 29.669 23.2819 30.5221 22.9239C30.6364 22.8744 30.7506 22.8249 30.8649 22.7716V31.996H30.8496ZM31.9922 16.594C31.9922 18.8716 30.126 20.7188 27.8294 20.7188C26.2755 20.7188 24.9197 19.8771 24.2036 18.6278C24.0932 18.4374 23.8951 18.3193 23.6742 18.3193H23.6514C23.4343 18.3193 23.2324 18.4374 23.122 18.6278C22.7566 19.2651 22.229 19.7942 21.5928 20.1615C20.9567 20.5287 20.2346 20.721 19.5 20.7188C17.9499 20.7188 16.5979 19.8809 15.8819 18.6354C15.7676 18.4412 15.5619 18.3193 15.3372 18.3193C15.1125 18.3193 14.9031 18.4412 14.7926 18.6354C14.4251 19.2703 13.8968 19.797 13.261 20.1628C12.6251 20.5285 11.9041 20.7202 11.1706 20.7188C8.87405 20.7188 7.00784 18.8716 7.00784 16.594V13.1206C7.00784 13.1092 7.01545 13.1016 7.02688 13.1016H31.9732C31.9846 13.1016 31.9922 13.1092 31.9922 13.1206V16.594Z" fill="white" />
  </svg>
)

const IconCalendar = ({ className = iconClassName }: { className?: string }) => (
  <svg className={className} viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28.875 23.375V8.25H9.625V23.375H28.875ZM28.875 4.125C29.6043 4.125 30.3038 4.41473 30.8195 4.93046C31.3353 5.44618 31.625 6.14565 31.625 6.875V23.375C31.625 24.1043 31.3353 24.8038 30.8195 25.3195C30.3038 25.8353 29.6043 26.125 28.875 26.125H9.625C8.89565 26.125 8.19618 25.8353 7.68046 25.3195C7.16473 24.8038 6.875 24.1043 6.875 23.375V6.875C6.875 6.14565 7.16473 5.44618 7.68046 4.93046C8.19618 4.41473 8.89565 4.125 9.625 4.125H11V1.375H13.75V4.125H24.75V1.375H27.5V4.125H28.875ZM4.125 28.875H23.375V31.625H4.125C3.39565 31.625 2.69618 31.3353 2.18046 30.8195C1.66473 30.3038 1.375 29.6043 1.375 28.875V12.375H4.125V28.875ZM26.125 20.625H20.625V15.125H26.125V20.625Z" fill="white" />
  </svg>
)

const IconStaff = ({ className = iconClassName }: { className?: string }) => (
  <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_169_382)">
      <path d="M25.7812 18.1473H4.78125C3.1244 18.1473 1.78125 19.5278 1.78125 21.2307V25.8557C1.78125 27.5586 3.1244 28.939 4.78125 28.939H25.7812C27.4381 28.939 28.7812 27.5586 28.7812 25.8557V21.2307C28.7812 19.5278 27.4381 18.1473 25.7812 18.1473Z" stroke="white" strokeWidth="2" />
      <path d="M12.2812 1.95984H4.78125C3.9856 1.95984 3.22254 2.28469 2.65993 2.86293C2.09732 3.44116 1.78125 4.22542 1.78125 5.04317V9.66817C1.78125 10.4859 2.09732 11.2702 2.65993 11.8484C3.22254 12.4267 3.9856 12.7515 4.78125 12.7515H12.2812" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M22.7812 13.5223C26.095 13.5223 28.7812 10.7614 28.7812 7.35563C28.7812 3.94988 26.095 1.18896 22.7812 1.18896C19.4675 1.18896 16.7812 3.94988 16.7812 7.35563C16.7812 10.7614 19.4675 13.5223 22.7812 13.5223Z" stroke="white" strokeWidth="2" />
      <path d="M22.7812 9.66809C24.0239 9.66809 25.0312 8.63275 25.0312 7.35559C25.0312 6.07843 24.0239 5.04309 22.7812 5.04309C21.5386 5.04309 20.5312 6.07843 20.5312 7.35559C20.5312 8.63275 21.5386 9.66809 22.7812 9.66809Z" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_169_382">
        <rect width="30" height="30" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  inventory: IconInventory,
  collect: IconCollect,
  calendar: IconCalendar,
  staff: IconStaff,
}

export default function OmnichannelFeatures({ features }: OmnichannelFeaturesProps) {
  const title = features?.featuresTitle
  const items = features?.featuresItems

  return (
    <section className="bg-white py-16 lg:py-[170px]">
      <div className="section_container mx-auto page-padding-x">
        {/* Heading */}
        {title && (
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] text-center mb-12 lg:mb-16">
            {title}
          </h2>
        )}

        {/* Feature Cards */}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {items.map((feature: { icon?: string; title?: string; description?: string }, index: number) => (
              <div
                key={index}
                className="bg-[#F5F5F5] rounded-sm p-6 lg:p-8 shadow-md flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-[#03C1CA] flex items-center justify-center mb-4 lg:mb-6 text-white">
                  {(() => {
                    const Icon = iconMap[feature.icon || 'inventory'] ?? iconMap.inventory
                    return <Icon className={iconClassName} />
                  })()}
                </div>

                {/* Title */}
                {feature.title && (
                  <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#565454] mb-3 lg:mb-4">
                    {feature.title}
                  </h3>
                )}

                {/* Description */}
                {feature.description && (
                  <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] leading-relaxed">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
