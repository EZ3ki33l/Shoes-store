import { requireAdminOrThrow } from '@/lib/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
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
