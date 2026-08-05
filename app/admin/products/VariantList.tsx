'use client'

/**
 * Tableau des variantes existantes, groupées par couleur.
 * Permet l'édition inline du stock / prix et la suppression.
 */

import { deleteProductVariant, updateProductVariant } from '@/app/actions/productVariant'
import { Input } from '@/components/ui/input'
import { useMemo, useState, useTransition } from 'react'

type Variant = {
  id: string
  sku: string
  size: string
  color: string
  price: string | null
  stock: number
}

type VariantListProps = {
  variants: Variant[]
}

export default function VariantList({ variants }: VariantListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [stockDraft, setStockDraft] = useState('')
  const [priceDraft, setPriceDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Groupe par couleur, trie les pointures numériquement, puis trie les groupes A→Z
  const grouped = useMemo(() => {
    const map = new Map<string, Variant[]>()
    for (const variant of variants) {
      const list = map.get(variant.color) ?? []
      list.push(variant)
      map.set(variant.color, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => {
        const na = Number(a.size)
        const nb = Number(b.size)
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
        return a.size.localeCompare(b.size, 'fr', { numeric: true })
      })
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, 'fr'))
  }, [variants])

  function startEdit(variant: Variant) {
    setEditingId(variant.id)
    setStockDraft(String(variant.stock))
    setPriceDraft(variant.price ?? '')
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setStockDraft('')
    setPriceDraft('')
    setError(null)
  }

  function saveEdit(variant: Variant) {
    setError(null)
    startTransition(async () => {
      const result = await updateProductVariant(variant.id, {
        size: variant.size,
        color: variant.color,
        stock: stockDraft,
        price: priceDraft || null,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      cancelEdit()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer cette variante ?')) return
    setError(null)
    startTransition(async () => {
      const result = await deleteProductVariant(id)
      if (!result.ok) {
        setError(result.error)
        return
      }
      if (editingId === id) cancelEdit()
    })
  }

  if (variants.length === 0) {
    return (
      <section className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold">Variantes existantes</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Aucune variante pour ce produit. Utilisez la matrice ci-dessus pour en générer.
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <div>
        <h2 className="text-lg font-semibold">Variantes existantes</h2>
        <p className="text-sm text-muted-foreground">
          {variants.length} variante{variants.length > 1 ? 's' : ''} — stock et prix modifiables
        </p>
      </div>

      {error && <p className="text-sm text-danger-600">{error}</p>}

      <div className="flex flex-col gap-6">
        {grouped.map(([color, items]) => (
          <div key={color} className="flex flex-col gap-2">
            <h3 className="font-medium">{color}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border bg-muted px-2 py-1 text-left font-medium">SKU</th>
                    <th className="border bg-muted px-2 py-1 text-left font-medium">
                      Pointure
                    </th>
                    <th className="border bg-muted px-2 py-1 text-left font-medium">Stock</th>
                    <th className="border bg-muted px-2 py-1 text-left font-medium">Prix</th>
                    <th className="border bg-muted px-2 py-1 text-left font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((variant) => {
                    const isEditing = editingId === variant.id
                    return (
                      <tr key={variant.id}>
                        <td className="border px-2 py-1 font-mono text-xs">{variant.sku}</td>
                        <td className="border px-2 py-1">{variant.size}</td>
                        <td className="border px-2 py-1">
                          {isEditing ? (
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={stockDraft}
                              onChange={(e) => setStockDraft(e.target.value)}
                              className="h-8 w-20"
                              disabled={isPending}
                            />
                          ) : (
                            variant.stock
                          )}
                        </td>
                        <td className="border px-2 py-1">
                          {isEditing ? (
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={priceDraft}
                              onChange={(e) => setPriceDraft(e.target.value)}
                              placeholder="base"
                              className="h-8 w-24"
                              disabled={isPending}
                            />
                          ) : variant.price != null ? (
                            `${variant.price} €`
                          ) : (
                            <span className="text-muted-foreground">base</span>
                          )}
                        </td>
                        <td className="border px-2 py-1">
                          <div className="flex flex-wrap gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isPending}
                                  autoComplete="off"
                                  onClick={() => saveEdit(variant)}
                                  className="rounded bg-primary-500 px-2 py-1 text-xs text-primary-950 disabled:opacity-50"
                                >
                                  Sauver
                                </button>
                                <button
                                  type="button"
                                  disabled={isPending}
                                  autoComplete="off"
                                  onClick={cancelEdit}
                                  className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                                >
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => startEdit(variant)}
                                className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                              >
                                Modifier
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleDelete(variant.id)}
                              className="rounded border border-danger-200 px-2 py-1 text-xs text-danger-700 disabled:opacity-50"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
