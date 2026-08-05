'use server'

/**
 * Server Actions pour les variantes produit (taille × couleur).
 * Gère création unitaire, création en masse (matrice), mise à jour et suppression.
 * Les SKU sont dérivés du slug produit + taille + couleur.
 */

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

const bulkCreateProductVariantsSchema = z.object({
  productId: z.string().min(1, 'Produit requis'),
  colors: z.array(z.string().min(1)).min(1, 'Au moins une couleur requise'),
  sizes: z.array(z.string().min(1)).min(1, 'Au moins une pointure requise'),
  /** Clé `${color}|${size}` → stock */
  stocks: z.record(z.string(), z.coerce.number().int().min(0)).optional(),
  defaultStock: z.coerce.number().int().min(0).default(0),
})

/** Résultat uniforme des actions (succès avec compteurs ou erreur métier). */
type ActionResult = { ok: true; created?: number; skipped?: number } | { ok: false; error: string }

/** Nettoie les espaces autour et internes d'un libellé (taille / couleur). */
function normalizeLabel(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

/** Déduplique une liste en ignorant la casse, tout en conservant le libellé d'origine. */
function uniqueNormalized(values: string[]) {
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of values) {
    const value = normalizeLabel(raw)
    if (!value) continue
    const key = value.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(value)
  }
  return result
}

/** Clé composite utilisée dans la map des stocks de la matrice. */
function stockKey(color: string, size: string) {
  return `${color}|${size}`
}

/**
 * Traduit une erreur d'unicité Prisma (P2002) en message lisible.
 * Retourne null si l'erreur n'est pas une contrainte d'unicité.
 */
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

  const size = normalizeLabel(data.size)
  const color = normalizeLabel(data.color)
  const sku = buildSku(product.slug, size, color)
  try {
    await prisma.productVariant.create({
      data: {
        productId: data.productId,
        sku,
        size,
        color,
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

export async function bulkCreateProductVariants(input: {
  productId: string
  colors: string[]
  sizes: string[]
  stocks?: Record<string, number>
  defaultStock?: number
}): Promise<ActionResult> {
  await requireAdminOrThrow()

  const data = bulkCreateProductVariantsSchema.parse(input)
  const colors = uniqueNormalized(data.colors)
  const sizes = uniqueNormalized(data.sizes)

  if (colors.length === 0 || sizes.length === 0) {
    return { ok: false, error: 'Au moins une couleur et une pointure sont requises' }
  }

  const product = await prisma.product.findUniqueOrThrow({
    where: { id: data.productId },
    select: { slug: true },
  })

  // Variantes déjà en BDD — on ignore les doublons plutôt que d'échouer
  const existing = await prisma.productVariant.findMany({
    where: { productId: data.productId },
    select: { size: true, color: true },
  })
  const existingKeys = new Set(
    existing.map((v) => `${v.color.toLowerCase()}|${v.size.toLowerCase()}`),
  )

  const toCreate: {
    productId: string
    sku: string
    size: string
    color: string
    stock: number
  }[] = []
  let skipped = 0

  // Produit cartésien couleurs × pointures
  for (const color of colors) {
    for (const size of sizes) {
      const key = `${color.toLowerCase()}|${size.toLowerCase()}`
      if (existingKeys.has(key)) {
        skipped += 1
        continue
      }
      // Fallback : clé exacte → clé lowercased → stock par défaut
      const stock =
        data.stocks?.[stockKey(color, size)] ??
        data.stocks?.[stockKey(color.toLowerCase(), size)] ??
        data.defaultStock
      toCreate.push({
        productId: data.productId,
        sku: buildSku(product.slug, size, color),
        size,
        color,
        stock,
      })
      existingKeys.add(key) // évite les doublons dans le même batch
    }
  }

  if (toCreate.length === 0) {
    return {
      ok: true,
      created: 0,
      skipped,
    }
  }

  try {
    const result = await prisma.productVariant.createMany({
      data: toCreate,
      skipDuplicates: true,
    })
    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${data.productId}/edit`)
    return { ok: true, created: result.count, skipped }
  } catch (error) {
    const message = uniqueConstraintError(error)
    if (message) return { ok: false, error: message }
    throw error
  }
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
  const size = normalizeLabel(data.size)
  const color = normalizeLabel(data.color)
  const sku = buildSku(existing.product.slug, size, color)

  try {
    await prisma.productVariant.update({
      where: { id },
      data: {
        sku,
        size,
        color,
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
