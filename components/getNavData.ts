import { prisma } from '@/lib/prisma'
import { Audience } from '@/generated/prisma/client'

/** Entrées nav principales — toujours affichées, indépendamment du catalogue. */
const NAV_AUDIENCES: Audience[] = [Audience.HOMME, Audience.FEMME, Audience.ENFANT]

export async function getNavData() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        children: {
          orderBy: { name: 'asc' },
          select: { name: true, slug: true },
        },
      },
    }),
  ])

  return { brands, categories, audiences: NAV_AUDIENCES }
}
