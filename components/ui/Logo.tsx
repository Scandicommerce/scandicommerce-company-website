import React from 'react'

interface LogoProps {
    className?: string
    logoPath?: string
}

export default function Logo({
    className = '',
    logoPath = '/images/mainLogo.svg',
}: LogoProps) {
    return (
        <div className={`flex items-center gap-2 w-[180px] max-w-full min-w-0 shrink ${className}`}>
            <div className="relative w-full flex justify-center items-center aspect-[180/40] min-h-[40px]">
                <img
                    src={logoPath}
                    alt="Scandi Commerce Logo"
                    width={180}
                    height={40}
                    className="w-full h-auto object-contain"
                />
            </div>
        </div>
    )
}

