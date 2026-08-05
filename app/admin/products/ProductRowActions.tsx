'use client'

/**
 * Actions d'une ligne produit : éditer ou supprimer.
 */

import { deleteProduct } from '@/app/actions/product'
import IconButton from '@/app/components/IconButton'
import { Pencil, Trash2 } from 'lucide-react'
import { useTransition } from 'react'

type ProductRowActionsProps = {
  productId: string
  productName: string
}

export default function ProductRawActions({ productId, productName }: ProductRowActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Supprimer le produit "${productName}" ?`)) return
    startTransition(() => deleteProduct(productId))
  }

  return (
    <div className="flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
      <IconButton
        href={`/admin/products/${productId}/edit`}
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
