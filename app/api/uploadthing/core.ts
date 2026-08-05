/**
 * FileRouter UploadThing : endpoints d'upload protégés (admin requis).
 * - brandLogo : 1 image max 2 Mo
 * - productImages : jusqu'à 8 images, 4 Mo chacune
 */

import { requireAdminOrThrow } from '@/lib/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
  /** Upload du logo marque (1 fichier, 2 Mo max). */
  brandLogo: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => {
      try {
        const admin = await requireAdminOrThrow()
        return { adminId: admin.id }
      } catch {
        throw new UploadThingError('Accès non autorisé')
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl }
    }),

  /** Upload d'images produit (jusqu'à 8 fichiers, 4 Mo chacun). */
  productImages: f({ image: { maxFileSize: '4MB', maxFileCount: 8 } })
    .middleware(async () => {
      try {
        const admin = await requireAdminOrThrow()
        return { adminId: admin.id }
      } catch {
        throw new UploadThingError('Accès non autorisé')
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
