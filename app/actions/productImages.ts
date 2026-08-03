'use server'

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
  variantId?: string | null
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

  await prisma.productImage.delete({ where: { id } })
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${image.productId}/edit`)
}
