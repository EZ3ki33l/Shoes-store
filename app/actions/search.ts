'use server'

import { prisma } from '@/lib/prisma'
import z from 'zod'

const searchSchema = z.object({
  q: z.string().trim().min(1).max(50),
})

export async function searcProducts(q: string) {
  const { q: query } = searchSchema.parse({ q })

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { name: { contains: query, mode: 'insensitive' } } },
        { category: { name: { contains: query, mode: 'insensitive' } } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      basePrice: true,
      brand: { select: { name: true } },
      images: {
        orderBy: { position: 'asc' },
        take: 1,
        select: { url: true, alt: true },
      },
    },
    orderBy: { name: 'asc' },
    take: 12,
  })

  return products.map((p) => ({
    ...p,
    basePrice: p.basePrice.toString(),
  }))
}
