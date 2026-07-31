import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'price'

const variantClasses: Record<Variant, string> = {
  h1: 'font-display text-3xl font-bold tracking-tight text-foreground',
  h2: 'font-display text-2xl font-semibold tracking-tight text-foreground',
  h3: 'font-display text-xl font-semibold text-foreground',
  body: 'font-sans text-base leading-relaxed text-foreground',
  caption: 'font-sans text-sm text-foreground/70',
  label: 'font-sans text-sm font-medium text-foreground',
  price: 'font-sans text-lg font-semibold tabular-nums text-foreground',
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
  const Tag = as ?? defaultTags[variant]
  return (
    <Tag className={[variantClasses[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Tag>
  )
}
