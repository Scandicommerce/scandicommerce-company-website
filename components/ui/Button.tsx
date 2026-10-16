'use client'

import Link from 'next/link'
import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

interface BaseButtonProps {
  children: ReactNode
  type?: 'default' | 'primary'
  className?: string
}

interface ButtonAsButton
  extends
  BaseButtonProps,
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'type' | 'children'
  > {
  href?: never
  htmlType?: 'button' | 'submit' | 'reset'
}

interface ButtonAsLink
  extends
  BaseButtonProps,
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'className' | 'children' | 'type'
  > {
  href: string
  htmlType?: never
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export default function Button({
  children,
  type = 'default',
  className = '',
  href,
  htmlType = 'button',
  ...props
}: ButtonProps) {
  // Live-site button (measured on scandicommerce.no, 2026-10-16): radius 8,
  // 14px semibold, 12px 22px padding. Primary is ink, secondary a hairline.
  const baseStyles =
    'inline-flex justify-center items-center gap-2 min-h-[46px] rounded-lg px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-center transition-colors w-full sm:w-auto'

  const typeStyles =
    type === 'primary'
      ? 'bg-sc-ink-900 text-white hover:bg-sc-ink-700'
      : 'bg-white text-sc-ink-900 border border-sc-ink-200 hover:bg-sc-ink-50'

  const combinedClassName = `${baseStyles} ${typeStyles} ${className}`.trim()

  if (href) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={htmlType}
      className={combinedClassName}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
