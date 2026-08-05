'use client'

/**
 * Actions d'une ligne catégorie : éditer ou supprimer.
 */

import { deleteCategory } from '@/app/actions/category'
import IconButton from '@/app/components/IconButton'
import { Pencil, Trash2 } from 'lucide-react'
import { useTransition } from 'react'

type CategoryRowActionsProps = {
  categoryId: string
  categoryName: string
}

export default function CategoryRawActions({ categoryId, categoryName }: CategoryRowActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Supprimer la catégorie "${categoryName}" ?`)) return
    startTransition(() => deleteCategory(categoryId))
  }

  return (
    <div className="flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
      <IconButton
        href={`/admin/categories/${categoryId}/edit`}
        icon={<Pencil size={16} />}
        label="Modifier"
      />
      <IconButton
        icon={<Trash2 size={16} />}
        label="Supprimer"
        onClick={handleDelete}
        variant="danger"
        disabled={isPending}
      />
    </div>
  )
}
