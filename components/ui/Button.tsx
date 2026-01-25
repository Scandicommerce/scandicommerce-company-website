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
  const baseStyles =
    'inline-block min-w-[286px] lg:px-8 px-4 lg:py-4 py-2 transition-colors text-center w-full sm:w-auto'

  const typeStyles =
    type === 'primary'
      ? 'bg-[#1DEFFA] text-[#1F1D1D] hover:bg-[#1DEFFA]/90'
      : 'bg-white text-[#1F1D1D] hover:bg-gray-100 border border-[#E5E5E5]'

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
