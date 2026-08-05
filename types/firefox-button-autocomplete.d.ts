import 'react'

/**
 * Firefox-only: `autocomplete` on <button> disables persistence of the
 * dynamic `disabled` state across reloads (MDN / bug 654072).
 * Without it, React hydration warns: disabled Server null vs Client true.
 */
declare module 'react' {
  interface ButtonHTMLAttributes<T> {
    autoComplete?: string
  }
}
