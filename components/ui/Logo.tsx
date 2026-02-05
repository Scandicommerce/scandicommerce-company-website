import React from 'react'
import Image from 'next/image'

interface LogoProps {
    className?: string
    logoPath?: string
}

export default function Logo({
    className = '',
    logoPath = '/images/main-logo.png',
}: LogoProps) {
    return (
        <div className={`flex items-center gap-2 w-[180px] max-w-full min-w-0 shrink ${className}`}>
            <div className="relative w-full flex justify-center items-center aspect-[180/40] min-h-[40px]">
                <Image
                    src={logoPath}
                    alt="Scandi Commerce Logo"
                    width={180}
                    height={40}
                    priority
                    className="w-full h-auto object-contain"
                />
            </div>
        </div>
    )
}

