'use client'

/**
 * Bouton icône accessible (aria-label + title).
 * Peut rendre un <Link> (si `href`) ou un <button> natif.
 * Cible tactile confortable sur mobile ; `className` surchargeable.
 */

import Link from 'next/link'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'danger'

type BaseProps = {
  icon: ReactNode
  label: string
  variant?: Variant
  className?: string
}

/** Union discriminée : avec `href` → lien, sinon → bouton cliquable. */
type IconButtonProps =
  | (BaseProps & { href: string })
  | (BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })

function variantClasses(variant: Variant) {
  return variant === 'danger'
    ? 'hover:bg-danger-100 hover:text-danger-700 dark:hover:bg-danger-950'
    : 'hover:bg-muted'
}

export default function IconButton({
  icon,
  label,
  variant = 'default',
  className,
  ...props
}: IconButtonProps) {
  const classes = cn(
    'inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded text-foreground/60 transition-colors sm:size-9 sm:p-2',
    variantClasses(variant),
    className,
  )

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} aria-label={label} title={label} className={classes}>
        {icon}
      </Link>
    )
  }

  return (
    <button type="button" aria-label={label} title={label} {...props} className={classes}>
      {icon}
    </button>
  )
}
