'use client'

import { bulkCreateProductVariants } from '@/app/actions/productVariant'
import { useMemo, useState, useTransition } from 'react'

const EU_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'] as const
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
        <p className="text-sm text-neutral-600">
          Ajoutez les couleurs et pointures, renseignez les stocks, puis générez toutes les
          combinaisons en une fois.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium" htmlFor="color-input">
          Couleurs
        </label>
        <div className="flex flex-wrap gap-2">
          <input
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
            className="h-10 min-w-40 flex-1 rounded border px-3 py-2"
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
                className="rounded border border-dashed px-2 py-1 text-xs text-neutral-600 hover:border-neutral-400"
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
                className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-1 text-sm"
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="text-neutral-500 hover:text-black"
                  aria-label={`Retirer ${color}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium" htmlFor="size-input">
          Pointures
        </label>
        <div className="flex flex-wrap gap-2">
          <input
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
            className="h-10 min-w-40 flex-1 rounded border px-3 py-2"
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
                className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-1 text-sm"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="text-neutral-500 hover:text-black"
                  aria-label={`Retirer ${size}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {comboCount > 0 && (
        <>
          <p className="text-sm font-medium">
            {colors.length} couleur{colors.length > 1 ? 's' : ''} × {sizes.length} pointure
            {sizes.length > 1 ? 's' : ''} = {comboCount} variante{comboCount > 1 ? 's' : ''}
          </p>

          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="uniform-stock" className="text-sm">
                Stock uniforme
              </label>
              <input
                id="uniform-stock"
                type="number"
                min="0"
                step="1"
                value={uniformStock}
                onChange={(e) => setUniformStock(e.target.value)}
                className="h-10 w-28 rounded border px-3 py-2"
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

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-neutral-50 px-2 py-1 text-left font-medium">Couleur</th>
                  {sortedSizes.map((size) => (
                    <th key={size} className="border bg-neutral-50 px-2 py-1 font-medium">
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
                        <input
                          type="number"
                          min="0"
                          step="1"
                          aria-label={`Stock ${color} ${size}`}
                          value={stocks[stockKey(color, size)] ?? '0'}
                          onChange={(e) => setCellStock(color, size, e.target.value)}
                          className="h-9 w-16 rounded border px-2 py-1 text-center"
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

      <button
        type="button"
        disabled={isPending || comboCount === 0}
        onClick={handleGenerate}
        className="w-fit rounded bg-purple-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending
          ? 'Génération…'
          : comboCount > 0
            ? `Générer ${comboCount} variante${comboCount > 1 ? 's' : ''}`
            : 'Générer les variantes'}
      </button>

      {message && <p className="text-sm text-green-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  )
}
