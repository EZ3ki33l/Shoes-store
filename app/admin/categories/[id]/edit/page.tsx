/**
 * Page d'édition d'une catégorie.
 * Exclut la catégorie courante des parents possibles (évite une boucle parentale).
 */

import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CategoryForm from '../../CategoryForm'

export default async function editCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminOrThrow()
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) notFound()

  // Impossible de se choisir soi-même comme parent
  const mainCategories = await prisma.category.findMany({
    where: { parentId: null, NOT: { id } },
    orderBy: { name: 'asc' },
  })

  return <CategoryForm category={category} mainCategories={mainCategories} />
}
