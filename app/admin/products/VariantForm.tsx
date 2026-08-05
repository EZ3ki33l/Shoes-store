'use client'

/**
 * Formulaire création / édition d'une variante isolée (taille, couleur, stock, prix).
 */

import { createProductVariant, updateProductVariant } from '@/app/actions/productVariant'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col gap-4 rounded-lg border p-4"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="size">Taille</FieldLabel>
          <Input
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="color">Couleur</FieldLabel>
          <Input
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="stock">Stock</FieldLabel>
          <Input
            id="stock"
            type="number"
            step="1"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="price">Prix (optionnel)</FieldLabel>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Field>
      </FieldGroup>
      <div className="flex w-full justify-center">
        <button
          type="submit"
          disabled={isPending || !size || !color}
          autoComplete="off"
          className="bg-primary-500 text-primary-950 w-1/2 rounded px-4 py-2 disabled:opacity-50"
        >
          {isPending ? 'Enregistrement ...' : isEditing ? 'Enregistrer' : 'Créer la variante'}
        </button>
      </div>
    </form>
  )
}
