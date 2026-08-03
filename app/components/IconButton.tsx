'use client'

import Link from 'next/link'
import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'default' | 'danger'

type BaseProps = {
  icon: ReactNode
  label: string
  variant?: Variant
}

type IconButtonProps =
  | (BaseProps & { href: string })
  | (BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })

function variantClasses(variant: Variant) {
  return variant === 'danger'
    ? 'hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950'
    : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 '
}

export default function IconButton({
  icon,
  label,
  variant = 'default',
  ...props
}: IconButtonProps) {
  const ClassName = `inline-flex items-center justify-center rounded p-2 text-foreground/60 transition-color cursor-pointer ${variantClasses(variant)}`

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} aria-label={label} title={label} className={ClassName}>
        {icon}
      </Link>
    )
  }
  return (
    <button type="button" aria-label={label} title={label} {...props} className={ClassName}>
      {icon}
    </button>
  )
}
