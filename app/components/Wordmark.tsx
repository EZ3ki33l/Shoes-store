/**
 * Wordmark « AT Chaussures » — version claire / sombre selon le thème.
 */

import Image from 'next/image'
import wordmark from '../../public/AT_Chaussures_wordmark.svg'
import wordmarkDark from '../../public/AT_Chaussures_wordmark-dark.svg'

type WordmarkProps = {
  className?: string
}

export default function Wordmark({ className }: WordmarkProps) {
  return (
    <>
      <Image
        src={wordmark}
        alt="AT Chaussures"
        className={`h-6 w-auto max-w-full object-contain object-left sm:h-8 dark:hidden ${className ?? ''}`}
        priority
      />
      <Image
        src={wordmarkDark}
        alt="AT Chaussures"
        className={`hidden h-6 w-auto max-w-full object-contain object-left sm:h-8 dark:block ${className ?? ''}`}
        priority
      />
    </>
  )
}
