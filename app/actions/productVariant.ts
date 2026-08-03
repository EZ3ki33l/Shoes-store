'use server'

import { Prisma } from '@/generated/prisma/client'
import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildSku } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const createProductVariantSchema = z.object({
  productId: z.string().min(1, 'Produit requis'),
  size: z.string().min(1, 'Taille requise'),
  color: z.string().min(1, 'Couleur requise'),
  price: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0),
})

const updateProductVariantSchema = createProductVariantSchema.omit({ productId: true })

type ActionResult = { ok: true } | { ok: false; error: string }

function uniqueConstraintError(error: unknown): string | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    const target = error.meta?.target
    const fields = Array.isArray(target) ? target.join(', ') : String(target ?? '')

    if (fields.includes('sku')) {
      return 'Ce SKU existe déjà'
    }

    if (fields.includes('productId') || fields.includes('size') || fields.includes('color')) {
      return 'Cette combinaison taille / couleur existe déjà pour ce produit'
    }
    return `Une contrainte d'unicité à été violée`
  }
  return null
}

export async function createProductVariant(input: {
  productId: string
  size: string
  color: string
  price?: string | null
  stock: string
}): Promise<ActionResult> {
  await requireAdminOrThrow()

  const data = createProductVariantSchema.parse(input)

  const product = await prisma.product.findUniqueOrThrow({
    where: { id: data.productId },
    select: { slug: true },
  })

  const sku = buildSku(product.slug, data.size, data.color)
  try {
    await prisma.productVariant.create({
      data: {
        productId: data.productId,
        sku,
        size: data.size,
        color: data.color,
        price: data.price,
        stock: data.stock,
      },
    })
  } catch (error) {
    const message = uniqueConstraintError(error)
    if (message) return { ok: false, error: message }
    throw error
  }
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${data.productId}/edit`)
  return { ok: true }
}

export async function updateProductVariant(
  id: string,
  input: {
    size: string
    color: string
    price?: string | null
    stock: string
  },
): Promise<ActionResult> {
  await requireAdminOrThrow()

  const data = updateProductVariantSchema.parse(input)

  const existing = await prisma.productVariant.findUniqueOrThrow({
    where: { id },
    select: { product: { select: { slug: true } }, productId: true },
  })
  const sku = buildSku(existing.product.slug, data.size, data.color)

  try {
    await prisma.productVariant.update({
      where: { id },
      data: {
        sku,
        size: data.size,
        color: data.color,
        price: data.price,
        stock: data.stock,
      },
    })
  } catch (error) {
    const message = uniqueConstraintError(error)
    if (message) return { ok: false, error: message }
    throw error
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${existing.productId}/edit`)
  return { ok: true }
}

export async function deleteProductVariant(id: string): Promise<ActionResult> {
  await requireAdminOrThrow()

  const variant = await prisma.productVariant.delete({ where: { id } })

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${variant.productId}/edit`)
  return { ok: true }
}
