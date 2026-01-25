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
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex-shrink-0 relative">
                <Image
                    src={logoPath}
                    alt="Scandi Commerce Logo"
                    width={185}
                    height={45}
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    )
}

