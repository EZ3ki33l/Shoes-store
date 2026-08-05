'use client'

/**
 * Formulaire création / édition d'une catégorie (parent optionnel = sous-catégorie).
 */

import { createCategory, updateCategory } from '@/app/actions/category'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type CategoryFormProps = {
  category?: {
    id: string
    name: string
    parentId: string | null
  }
  mainCategories: { id: string; name: string }[]
}

export default function CategoryForm({ category, mainCategories }: CategoryFormProps) {
  const router = useRouter()
  const [name, setName] = useState(category?.name ?? '')
  const [parentId, setParentId] = useState(category?.parentId ?? '')
  const [isPending, startTransition] = useTransition()
  const isEditing = Boolean(category)

  const parentItems = [
    { label: 'Aucune catégorie principale', value: '' },
    ...mainCategories.map((c) => ({ label: c.name, value: c.id })),
  ]

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(async () => {
      if (category) {
        await updateCategory(category.id, { name, parentId: parentId || undefined })
        router.push('/admin/categories')
      } else {
        await createCategory({ name, parentId: parentId || undefined })
        setName('')
        setParentId('')
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
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="parentId">Catégorie principale ?</FieldLabel>
          <Select
            items={parentItems}
            value={parentId}
            onValueChange={(value) => setParentId(value ?? '')}
          >
            <SelectTrigger id="parentId">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {parentItems.map((item) => (
                <SelectItem key={item.value || 'none'} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
      <div className="flex w-full justify-center">
        <button
          type="submit"
          disabled={isPending || !name}
          autoComplete="off"
          className="bg-primary-500 text-primary-950 w-1/2 rounded px-4 py-2 disabled:opacity-50"
        >
          {isPending ? 'Enregistrement ...' : isEditing ? 'Enregistrer' : 'Créer la catégorie'}
        </button>
      </div>
    </form>
  )
}
