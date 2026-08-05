'use server'

/**
 * Server Actions pour les images produit.
 * Synchronise la BDD Prisma et les fichiers UploadThing (suppression du fichier distant
 * lors d'un remplacement ou d'une suppression).
 */

import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { UTApi } from 'uploadthing/server'
import z from 'zod'

const createProductImageSchema = z.object({
  productId: z.string().min(1, 'Product id requis'),
  url: z.url('Url invalide'),
  alt: z.string().optional().nullable(),
  position: z.coerce.number().int().min(0).default(0),
  color: z.string().min(1).optional().nullable(),
})

const updateProductImageSchema = createProductImageSchema.omit({ productId: true })
const utapi = new UTApi()

/** Extrait la clé fichier depuis l'URL UploadThing et tente la suppression (best-effort). */
async function deleteUploadThingFile(url: string) {
  const key = url.split('/').pop()
  if (!key) return
  try {
    await utapi.deleteFiles(key)
  } catch (error) {
    console.error(`Echec de suppression UploadThing (key : ${key})`, error)
  }
}

export async function createProductImage(input: {
  productId: string
  url: string
  alt?: string | null
  position?: number
  color?: string | null
}) {
  await requireAdminOrThrow()

  const data = createProductImageSchema.parse(input)

  await prisma.productImage.create({
    data: {
      productId: data.productId,
      url: data.url,
      alt: data.alt ?? null,
      position: data.position,
      color: data.color ?? null,
    },
  })
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${data.productId}/edit`)
}

export async function updateProductImage(
  id: string,
  input: {
    url: string
    alt?: string | null
    position?: number
    color?: string | null
  },
) {
  await requireAdminOrThrow()

  const data = updateProductImageSchema.parse(input)

  const existing = await prisma.productImage.findUniqueOrThrow({ where: { id } })

  await prisma.productImage.update({
    where: { id },
    data: {
      url: data.url,
      alt: data.alt ?? null,
      position: data.position,
      color: data.color ?? null,
    },
  })

  // Remplacement d'URL : nettoyer l'ancien fichier distant pour éviter les orphelins
  if (existing.url !== data.url) {
    await deleteUploadThingFile(existing.url)
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${existing.productId}/edit`)
}

export async function deleteProductImages(id: string) {
  await requireAdminOrThrow()

  const image = await prisma.productImage.delete({ where: { id } })
  await deleteUploadThingFile(image.url)

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${image.productId}/edit`)
}
