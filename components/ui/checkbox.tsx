'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'border-input peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border bg-background transition-colors outline-none focus-visible:border-secondary-500 focus-visible:ring-3 focus-visible:ring-secondary-500/30 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary-500 data-checked:bg-primary-500 data-checked:text-primary-950',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
