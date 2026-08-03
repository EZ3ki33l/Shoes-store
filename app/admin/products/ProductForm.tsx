'use client'

import { createProduct, updateProduct } from '@/app/actions/product'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type ProductFormProps = {
  product?: {
    id: string
    name: string
    description: string | null
    basePrice: string
    isPublished: boolean
    brandId: string
    categoryId: string
    audience: string[]
  }
  brands: { id: string; name: string }[]
  categories: { id: string; name: string }[]
}

export default function ProductForm({ product, brands, categories }: ProductFormProps) {
  const router = useRouter()
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.basePrice ?? '')
  const [published, setPublished] = useState(product?.isPublished ?? true)
  const [brandId, setBrandId] = useState(product?.brandId ?? '')
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '')
  const [audience, setAudience] = useState<string[]>(product?.audience ?? [])
  const [isPending, startTransition] = useTransition()
  const isEditing = Boolean(product)

  const AUDIENCE_OPTIONS = [
    { value: 'HOMME', label: 'Homme' },
    { value: 'FEMME', label: 'Femme' },
    { value: 'ENFANT', label: 'Enfant' },
    { value: 'UNISEXE', label: 'Unisexe' },
  ]

  function resetForm() {
    setName('')
    setDescription('')
    setPrice('')
    setPublished(true)
    setBrandId('')
    setCategoryId('')
    setAudience([])
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(async () => {
      const payload = {
        name,
        description: description || undefined,
        basePrice: price,
        isPublished: published,
        brandId,
        categoryId,
        audience,
      }

      if (product) {
        await updateProduct(product.id, payload)
        router.push('/admin/products')
      } else {
        await createProduct(payload)
        resetForm()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Nom</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-10 w-full rounded border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="price">Prix</label>
        <input
          id="price"
          type="number"
          step={'0.01'}
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="h-10 w-full rounded border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="brandId">Marque</label>
        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          required
          className="h-10 w-full rounded border px-3 py-2"
        >
          <option value="">Choisir une marque</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="categoryId">Catégorie</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="h-10 w-full rounded border px-3 py-2"
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="audience">Audience</label>
        <div className="rounded border px-3 py-2">
          {AUDIENCE_OPTIONS.map((a) => (
            <label key={a.value} className="flex items-center gap-4">
              <input
                type="checkbox"
                value={a.value}
                checked={audience.includes(a.value)}
                className="h-4 rounded border px-3 py-2"
                onChange={(e) =>
                  setAudience((prev) =>
                    e.target.checked ? [...prev, a.value] : prev.filter((v) => v !== a.value),
                  )
                }
              />
              {a.label}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-8">
        <label htmlFor="published">Publié</label>
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          required
          className="h-4 rounded border px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !name || !price || !brandId || !categoryId || audience.length === 0}
        className="rounded bg-purple-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Enregistrement ...' : isEditing ? 'Enregistrer' : 'Créer le produit'}
      </button>
    </form>
  )
}
