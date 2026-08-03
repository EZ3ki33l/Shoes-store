'use server'

import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const categorySchema = z.object({
  name: z.string().min(2, 'La catégorie doit faire au moins 2 caractères'),
  parentId: z.string().optional(),
})

export async function createCategory(input: { name: string; parentId?: string }) {
  await requireAdminOrThrow()

  const data = categorySchema.parse(input)

  await prisma.category.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      parentId: data.parentId || null,
    },
  })
  revalidatePath('/admin/categories')
}

export async function updateCategory(id: string, input: { name: string; parentId?: string }) {
  await requireAdminOrThrow()

  const data = categorySchema.parse(input)

  await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: slugify(data.name),
      parentId: data.parentId || null,
    },
  })

  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  await requireAdminOrThrow()

  await prisma.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
}
