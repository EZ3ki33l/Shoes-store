'use server'

import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { UTApi } from 'uploadthing/server'
import z from 'zod'

const brandSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  logoUrl: z.url().optional().or(z.literal('')),
})

const utapi = new UTApi()

export async function createBrand(input: { name: string; logoUrl?: string }) {
  await requireAdminOrThrow()

  const data = brandSchema.parse(input)

  await prisma.brand.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      logoUrl: data.logoUrl || null,
    },
  })
  revalidatePath('/admin/brands')
}

export async function updateBrand(id: string, input: { name: string; logoUrl?: string }) {
  await requireAdminOrThrow()

  const data = brandSchema.parse(input)

  const existing = await prisma.brand.findUnique({ where: { id } })
  const newLogoUrl = data.logoUrl || null

  await prisma.brand.update({
    where: { id },
    data: {
      name: data.name,
      slug: slugify(data.name),
      logoUrl: data.logoUrl || null,
    },
  })

  if (existing?.logoUrl && existing.logoUrl !== newLogoUrl) {
    const key = existing.logoUrl.split('/').pop()
    if (key) {
      try {
        await utapi.deleteFiles(key)
      } catch (error) {
        console.error(`Echec de suppression du logo Uploadthing (key : ${key})`, error)
      }
    }
  }
  revalidatePath('/admin/brands')
}

export async function deleteBrand(id: string) {
  await requireAdminOrThrow()

  const brand = await prisma.brand.findUnique({ where: { id } })

  if (brand?.logoUrl) {
    const key = brand.logoUrl.split('/').pop()
    if (key) {
      try {
        await utapi.deleteFiles(key)
      } catch (error) {
        console.error(`Echec de suppression du logo Uploadthing (key : ${key})`, error)
      }
    }
  }

  await prisma.brand.delete({ where: { id } })
  revalidatePath('/admin/brands')
}
