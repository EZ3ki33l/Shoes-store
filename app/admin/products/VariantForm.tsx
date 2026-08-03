'use client'

import { createProductVariant, updateProductVariant } from '@/app/actions/productVariant'
import { useState, useTransition } from 'react'

type VariantFormProps = {
  productId: string
  variant?: {
    id: string
    size: string
    color: string
    price: string | null
    stock: number
  }
}
export default function VariantForm({ productId, variant }: VariantFormProps) {
  const [size, setSize] = useState(variant?.size ?? '')
  const [color, setColor] = useState(variant?.color ?? '')
  const [price, setPrice] = useState(variant?.price ?? '')
  const [stock, setStock] = useState(variant ? String(variant.stock) : '0')
  const [isPending, startTransition] = useTransition()
  const isEditing = Boolean(variant)
  function resetForm() {
    setSize('')
    setColor('')
    setPrice('')
    setStock('0')
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(async () => {
      const payload = {
        size,
        color,
        stock,
        price: price || null,
      }
      if (variant) {
        await updateProductVariant(variant.id, payload)
      } else {
        await createProductVariant({ productId, ...payload })
        resetForm()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="size">Taille</label>
        <input
          id="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
          className="h-10 w-full rounded border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="color">Couleur</label>
        <input
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
          className="h-10 w-full rounded border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          type="number"
          step="1"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          className="h-10 w-full rounded border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="price">Prix (optionnel)</label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="h-10 w-full rounded border px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !size || !color}
        className="rounded bg-purple-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Enregistrement ...' : isEditing ? 'Enregistrer' : 'Créer la variante'}
      </button>
    </form>
  )
}
