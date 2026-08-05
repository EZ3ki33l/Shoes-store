/**
 * Composant typographique polymorphe.
 * Mappe une variante visuelle (h1, body, price…) vers des classes CSS
 * et une balise HTML par défaut, surchargeable via `as`.
 * Tailles fluides : plus compactes sur mobile, plein format dès `sm`/`lg`.
 */

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'price'

const variantClasses: Record<Variant, string> = {
  h1: 'font-display text-2xl font-bold uppercase italic tracking-wide text-foreground sm:text-3xl lg:text-4xl',
  h2: 'font-display text-xl font-semibold uppercase italic tracking-wide text-foreground sm:text-2xl',
  h3: 'font-display text-lg font-semibold uppercase italic tracking-wide text-foreground sm:text-xl',
  body: 'font-sans text-sm leading-relaxed text-foreground sm:text-base',
  caption: 'font-sans text-xs text-muted-foreground sm:text-sm',
  label: 'font-sans text-xs font-medium text-foreground sm:text-sm',
  price:
    'font-sans text-base font-semibold tabular-nums text-primary-800 sm:text-lg dark:text-primary-400',
}

const defaultTags: Record<Variant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  caption: 'span',
  label: 'label',
  price: 'span',
}

type TypographyProps<T extends ElementType = 'p'> = {
  variant?: Variant
  as?: T
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export default function Typo<T extends ElementType = 'p'>({
  variant = 'body',
  as,
  children,
  className,
  ...props
}: TypographyProps<T>) {
  // `as` permet de découpler le style (variant) de la sémantique HTML
  const Tag = as ?? defaultTags[variant]
  return (
    <Tag className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Tag>
  )
}
