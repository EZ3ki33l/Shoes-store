'use client'

/**
 * Actions d'une ligne marque : éditer ou supprimer (confirm + transition).
 */

import { deleteBrand } from '@/app/actions/brand'
import IconButton from '@/app/components/IconButton'
import { useTransition } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

type BrandRowActionsProps = {
  brandId: string
  brandName: string
}

export default function BrandRowActions({ brandId, brandName }: BrandRowActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Supprimer la marque "${brandName}" ?`)) return
    startTransition(() => {
      deleteBrand(brandId)
    })
  }

  return (
    <div className="flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
      <IconButton
        href={`/admin/brands/${brandId}/edit`}
        icon={<Pencil size={16} />}
        label="Modifier"
      />
      <IconButton
        icon={<Trash2 size={16} />}
        label="Supprimer"
        variant="danger"
        onClick={handleDelete}
        disabled={isPending}
      />
    </div>
  )
}
