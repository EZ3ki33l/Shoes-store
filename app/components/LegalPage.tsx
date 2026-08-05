/**
 * Mise en page partagée des pages légales (mentions, CGV, confidentialité, cookies).
 */

import type { ReactNode } from 'react'
import Typo from './Typography'

type LegalPageProps = {
  title: string
  children: ReactNode
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <article className="w-full space-y-8">
      <Typo variant="h2" as="h1">
        {title}
      </Typo>
      <div className="space-y-6 text-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:italic [&_h2]:tracking-wide [&_h2]:text-foreground [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:font-sans [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </article>
  )
}
