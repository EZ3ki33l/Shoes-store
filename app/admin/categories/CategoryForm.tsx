'use client'

import { createCategory, updateCategory } from '@/app/actions/category'
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
        <label htmlFor="parentId">Catégorie principale ?</label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="h-10 w-full rounded border px-3 py-2"
        >
          <option value="">Aucune catégorie principale</option>
          {mainCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending || !name}
        className="rounded bg-purple-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Enregistrement ...' : isEditing ? 'Enregistrer' : 'Créer la catégorie'}
      </button>
    </form>
  )
}
