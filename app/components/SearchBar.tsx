'use client'

import { searcProducts } from '../actions/search'
import { useState, useTransition } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

type Hit = Awaited<ReturnType<typeof searcProducts>>[number]

export default function SearchBar() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [isPending, startTransition] = useTransition()

  function onChange(value: string) {
    setQ(value)
    const query = value.trim()
    if (query.length < 2) {
      setHits([])
      return
    }

    startTransition(async () => {
      const results = await searcProducts(query)
      setHits(results)
    })
  }

  return (
    <div className="relative w-full max-w-none lg:max-w-sm">
      <Field>
        <FieldLabel htmlFor="q" className="sr-only">
          Rechercher un produit
        </FieldLabel>
        <Input
          id="q"
          type="search"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher…"
          autoComplete="off"
        />
      </Field>
      {(hits.length > 0 || isPending) && (
        <ul className="bg-background absolute z-50 mt-1 w-full max-w-[100vw] rounded border shadow">
          {hits.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
                onClick={() => router.push(`/produits/${p.slug}`)}
              >
                <span className="min-w-0 truncate">{p.name}</span>
                <span className="text-muted-foreground ml-auto shrink-0">{p.brand.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
