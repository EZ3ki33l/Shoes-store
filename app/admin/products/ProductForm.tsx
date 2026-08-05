'use client'

/**
 * Formulaire création / édition d'un produit (prix, marque, catégorie, audience, publication).
 */

import { createProduct, updateProduct } from '@/app/actions/product'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
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

  const brandItems = [
    { label: 'Choisir une marque', value: '' },
    ...brands.map((b) => ({ label: b.name, value: b.id })),
  ]

  const categoryItems = [
    { label: 'Choisir une catégorie', value: '' },
    ...categories.map((c) => ({ label: c.name, value: c.id })),
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
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col gap-4 rounded-lg border p-4"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nom</FieldLabel>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="price">Prix</FieldLabel>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="brandId">Marque</FieldLabel>
          <Select
            items={brandItems}
            value={brandId}
            onValueChange={(value) => setBrandId(value ?? '')}
            required
          >
            <SelectTrigger id="brandId">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {brandItems.map((item) => (
                <SelectItem key={item.value || 'none'} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="categoryId">Catégorie</FieldLabel>
          <Select
            items={categoryItems}
            value={categoryId}
            onValueChange={(value) => setCategoryId(value ?? '')}
            required
          >
            <SelectTrigger id="categoryId">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryItems.map((item) => (
                <SelectItem key={item.value || 'none'} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <FieldSet>
          <FieldLegend variant="label">Audience</FieldLegend>
          <FieldGroup className="gap-2 rounded border px-3 py-2">
            {AUDIENCE_OPTIONS.map((a) => (
              <Field key={a.value} orientation="horizontal">
                <Checkbox
                  id={`audience-${a.value}`}
                  checked={audience.includes(a.value)}
                  onCheckedChange={(checked) =>
                    setAudience((prev) =>
                      checked ? [...prev, a.value] : prev.filter((v) => v !== a.value),
                    )
                  }
                />
                <FieldLabel htmlFor={`audience-${a.value}`} className="font-normal">
                  {a.label}
                </FieldLabel>
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Checkbox
            id="published"
            checked={published}
            onCheckedChange={(checked) => setPublished(checked === true)}
          />
          <FieldLabel htmlFor="published">Publié</FieldLabel>
        </Field>
      </FieldGroup>
      <div className="flex w-full justify-center">
        <button
          type="submit"
          disabled={
            isPending || !name || !price || !brandId || !categoryId || audience.length === 0
          }
          autoComplete="off"
          className="bg-primary-500 text-primary-950 w-1/2 rounded px-4 py-2 disabled:opacity-50"
        >
          {isPending ? 'Enregistrement ...' : isEditing ? 'Enregistrer' : 'Créer le produit'}
        </button>
      </div>
    </form>
  )
}
