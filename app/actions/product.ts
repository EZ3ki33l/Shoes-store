'use server'

/**
 * Server Actions CRUD pour les produits.
 * Réservées aux admins ; validation Zod + invalidation du cache /admin/products.
 */

import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  basePrice: z.coerce.number().positive(),
  isPublished: z.boolean().default(true),
  brandId: z.string().min(1, 'Marque requise'),
  categoryId: z.string().min(1, 'Catégorie requise'),
  audience: z
    .array(z.enum(['HOMME', 'FEMME', 'ENFANT', 'UNISEXE']))
    .min(1, 'Choisir au moins une audience'),
})

export async function createProduct(input: {
  name: string
  description?: string
  basePrice: string
  isPublished: boolean
  brandId: string
  categoryId: string
  audience: string[]
}) {
  await requireAdminOrThrow()

  const data = productSchema.parse(input)

  await prisma.product.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description || null,
      basePrice: data.basePrice,
      categoryId: data.categoryId,
      brandId: data.brandId,
      audience: data.audience,
      isPublished: data.isPublished,
    },
  })
  revalidatePath('/admin/products')
}

export async function updateProduct(
  id: string,
  input: {
    name: string
    description?: string
    basePrice: string
    isPublished: boolean
    brandId: string
    categoryId: string
    audience: string[]
  },
) {
  await requireAdminOrThrow()

  const data = productSchema.parse(input)

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description || null,
      basePrice: data.basePrice,
      categoryId: data.categoryId,
      brandId: data.brandId,
      audience: data.audience,
      isPublished: data.isPublished,
    },
  })

  revalidatePath('/admin/products')
}

export async function deleteProduct(id: string) {
  await requireAdminOrThrow()

  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
}
