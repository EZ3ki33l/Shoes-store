/**
 * Liste hiérarchique des catégories (racines + enfants) et formulaire de création.
 */

import Typo from '@/app/components/Typography'
import { prisma } from '@/lib/prisma'
import CategoryForm from './CategoryForm'
import CategoryRawActions from './CategoryRowActions'

export default async function CategoryPage() {
  // Racines uniquement ; les enfants sont inclus pour l'affichage hiérarchique
  const mainCategories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
    include: {
      children: { orderBy: { name: 'asc' } },
    },
  })

  return (
    <div className="flex flex-col gap-8">
      <Typo variant="h1" as="h1">
        Les catégories
      </Typo>
      <CategoryForm mainCategories={mainCategories} />
      <ul className="flex flex-col gap-3">
        {mainCategories.map((category) => (
          <li key={category.id} className="flex flex-col gap-2">
            <div className="group flex items-center gap-3 rounded border p-3">
              <Typo variant="body" className="flex-1">
                {category.name}
              </Typo>
              <CategoryRawActions categoryId={category.id} categoryName={category.name} />
            </div>

            {category.children.length > 0 && (
              <ul className="ml-6 flex flex-col gap-1 border-l-2 border-border pl-4">
                {category.children.map((child) => (
                  <li
                    key={child.id}
                    className="group flex items-center gap-3 rounded border-dashed bg-muted p-2"
                  >
                    <Typo variant="body" className="flex-1 text-sm text-muted-foreground">
                      {child.name}
                    </Typo>
                    <CategoryRawActions categoryId={child.id} categoryName={child.name} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
