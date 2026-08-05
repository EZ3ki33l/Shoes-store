'use client'

/**
 * Générateur de variantes en masse : couleurs × pointures → stocks → createMany.
 * Propose des presets EU (entières et demi-pointures).
 */

import { bulkCreateProductVariants } from '@/app/actions/productVariant'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useMemo, useState, useTransition } from 'react'

/** Preset pointures EU entières (36–46). */
const EU_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'] as const
/** Preset EU avec demi-pointures. */
const EU_HALF_SIZES = [
  '36',
  '36.5',
  '37',
  '37.5',
  '38',
  '38.5',
  '39',
  '39.5',
  '40',
  '40.5',
  '41',
  '41.5',
  '42',
  '42.5',
  '43',
  '43.5',
  '44',
  '44.5',
  '45',
  '45.5',
  '46',
] as const

function stockKey(color: string, size: string) {
  return `${color}|${size}`
}

type VariantMatrixProps = {
  productId: string
  existingColors?: string[]
}

export default function VariantMatrix({ productId, existingColors = [] }: VariantMatrixProps) {
  const [colors, setColors] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [colorInput, setColorInput] = useState('')
  const [sizeInput, setSizeInput] = useState('')
  const [stocks, setStocks] = useState<Record<string, string>>({})
  const [uniformStock, setUniformStock] = useState('0')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const comboCount = colors.length * sizes.length

  // Tri numérique des pointures pour l'affichage de la matrice
  const sortedSizes = useMemo(
    () =>
      [...sizes].sort((a, b) => {
        const na = Number(a)
        const nb = Number(b)
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
        return a.localeCompare(b, 'fr', { numeric: true })
      }),
    [sizes],
  )

  function addColor(raw: string) {
    const value = raw.trim().replace(/\s+/g, ' ')
    if (!value) return
    setColors((prev) => {
      if (prev.some((c) => c.toLowerCase() === value.toLowerCase())) return prev
      return [...prev, value]
    })
    setColorInput('')
  }

  function removeColor(color: string) {
    setColors((prev) => prev.filter((c) => c !== color))
    setStocks((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(next)) {
        if (key.startsWith(`${color}|`)) delete next[key]
      }
      return next
    })
  }

  function addSize(raw: string) {
    const value = raw.trim().replace(/\s+/g, ' ')
    if (!value) return
    setSizes((prev) => {
      if (prev.some((s) => s.toLowerCase() === value.toLowerCase())) return prev
      return [...prev, value]
    })
    setSizeInput('')
  }

  function removeSize(size: string) {
    setSizes((prev) => prev.filter((s) => s !== size))
    setStocks((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(next)) {
        if (key.endsWith(`|${size}`)) delete next[key]
      }
      return next
    })
  }

  function applyPreset(preset: readonly string[]) {
    setSizes((prev) => {
      const next = [...prev]
      for (const size of preset) {
        if (!next.some((s) => s.toLowerCase() === size.toLowerCase())) {
          next.push(size)
        }
      }
      return next
    })
  }

  function applyUniformStock() {
    const next: Record<string, string> = { ...stocks }
    for (const color of colors) {
      for (const size of sizes) {
        next[stockKey(color, size)] = uniformStock
      }
    }
    setStocks(next)
  }

  function setCellStock(color: string, size: string, value: string) {
    setStocks((prev) => ({ ...prev, [stockKey(color, size)]: value }))
  }

  function handleGenerate() {
    setMessage(null)
    setError(null)
    startTransition(async () => {
      const stockNumbers: Record<string, number> = {}
      for (const color of colors) {
        for (const size of sizes) {
          const raw = stocks[stockKey(color, size)] ?? '0'
          stockNumbers[stockKey(color, size)] = Number(raw) || 0
        }
      }

      const result = await bulkCreateProductVariants({
        productId,
        colors,
        sizes,
        stocks: stockNumbers,
        defaultStock: 0,
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      const created = result.created ?? 0
      const skipped = result.skipped ?? 0
      setMessage(
        created === 0 && skipped > 0
          ? `Aucune nouvelle variante (${skipped} déjà existante${skipped > 1 ? 's' : ''}).`
          : `${created} variante${created > 1 ? 's' : ''} créée${created > 1 ? 's' : ''}${
              skipped > 0 ? ` (${skipped} ignorée${skipped > 1 ? 's' : ''})` : ''
            }.`,
      )
      setColors([])
      setSizes([])
      setStocks({})
    })
  }

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <div>
        <h2 className="text-lg font-semibold">Générer les variantes</h2>
        <p className="text-sm text-muted-foreground">
          Ajoutez les couleurs et pointures, renseignez les stocks, puis générez toutes les
          combinaisons en une fois.
        </p>
      </div>

        <Field>
          <FieldLabel htmlFor="color-input">Couleurs</FieldLabel>
          <div className="flex flex-wrap gap-2">
            <Input
              id="color-input"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addColor(colorInput)
                }
              }}
              placeholder="ex. Noir"
              className="min-w-40 flex-1"
            />
            <button
              type="button"
              onClick={() => addColor(colorInput)}
              className="rounded border px-3 py-2 text-sm"
            >
              Ajouter
            </button>
          </div>
          {existingColors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {existingColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => addColor(color)}
                  className="rounded border border-dashed px-2 py-1 text-xs text-muted-foreground hover:border-border"
                >
                  + {color}
                </button>
              ))}
            </div>
          )}
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-sm"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Retirer ${color}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="size-input">Pointures</FieldLabel>
          <div className="flex flex-wrap gap-2">
            <Input
              id="size-input"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSize(sizeInput)
                }
              }}
              placeholder="ex. 42"
              className="min-w-40 flex-1"
            />
            <button
              type="button"
              onClick={() => addSize(sizeInput)}
              className="rounded border px-3 py-2 text-sm"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => applyPreset(EU_SIZES)}
              className="rounded border px-3 py-2 text-sm"
            >
              Preset EU 36–46
            </button>
            <button
              type="button"
              onClick={() => applyPreset(EU_HALF_SIZES)}
              className="rounded border px-3 py-2 text-sm"
            >
              + demi-pointures
            </button>
          </div>
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sortedSizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-sm"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Retirer ${size}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        {comboCount > 0 && (
          <>
            <p className="text-sm font-medium">
              {colors.length} couleur{colors.length > 1 ? 's' : ''} × {sizes.length} pointure
              {sizes.length > 1 ? 's' : ''} = {comboCount} variante{comboCount > 1 ? 's' : ''}
            </p>

            <Field className="w-auto">
              <div className="flex flex-wrap items-end gap-2">
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="uniform-stock">Stock uniforme</FieldLabel>
                  <Input
                    id="uniform-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={uniformStock}
                    onChange={(e) => setUniformStock(e.target.value)}
                    className="w-28"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyUniformStock}
                  className="h-10 rounded border px-3 py-2 text-sm"
                >
                  Appliquer à toutes les cellules
                </button>
              </div>
            </Field>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-muted px-2 py-1 text-left font-medium">Couleur</th>
                  {sortedSizes.map((size) => (
                    <th key={size} className="border bg-muted px-2 py-1 font-medium">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colors.map((color) => (
                  <tr key={color}>
                    <td className="border px-2 py-1 font-medium whitespace-nowrap">{color}</td>
                    {sortedSizes.map((size) => (
                      <td key={size} className="border p-1">
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          aria-label={`Stock ${color} ${size}`}
                          value={stocks[stockKey(color, size)] ?? '0'}
                          onChange={(e) => setCellStock(color, size, e.target.value)}
                          className="h-9 w-16 px-2 text-center"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex w-full justify-center">
        <button
          type="button"
          disabled={isPending || comboCount === 0}
          autoComplete="off"
          onClick={handleGenerate}
          className="bg-primary-500 text-primary-950 w-1/2 rounded px-4 py-2 disabled:opacity-50"
        >
          {isPending
            ? 'Génération…'
            : comboCount > 0
              ? `Générer ${comboCount} variante${comboCount > 1 ? 's' : ''}`
              : 'Générer les variantes'}
        </button>
      </div>

      {message && <p className="text-sm text-success-700">{message}</p>}
      {error && <p className="text-sm text-danger-600">{error}</p>}
    </section>
  )
}
