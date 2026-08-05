'use client'

/**
 * Composants UploadThing préconfigurés (libellés FR + style primary admin).
 */

import { OurFileRouter } from '@/app/api/uploadthing/core'
import { generateUploadButton, generateUploadDropzone } from '@uploadthing/react'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

const BaseUploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()

/**
 * Override des defaults UT (`data-[state=*]:bg-blue-*`) avec la même spécificité
 * (+ `!` pour gagner sur l’ordre CSS). Aligné sur les CTA admin primary-500.
 */
const buttonAppearance = cn(
  'h-auto! w-auto! cursor-pointer rounded px-4 py-3 text-center font-medium text-primary-950',
  'bg-primary-500!',
  'data-[state=ready]:bg-primary-500!',
  'data-[state=readying]:bg-primary-400!',
  'data-[state=uploading]:bg-primary-400!',
  'data-[state=disabled]:bg-primary-400!',
  'ut-ready:bg-primary-500!',
  'ut-readying:bg-primary-400!',
  'ut-uploading:bg-primary-400!',
  'after:bg-primary-600!',
)

export function UploadButton(props: ComponentProps<typeof BaseUploadButton>) {
  return (
    <BaseUploadButton
      {...props}
      config={{
        ...props.config,
        cn,
      }}
      appearance={{
        button: buttonAppearance,
        ...props.appearance,
      }}
      content={{
        button({ ready, isUploading }) {
          if (isUploading) return 'Envoi…'
          if (ready) return 'Choisir des fichiers'
          return 'Préparation…'
        },
        allowedContent({ isUploading }) {
          if (isUploading) return 'Envoi en cours…'
          return null
        },
        ...props.content,
      }}
    />
  )
}
