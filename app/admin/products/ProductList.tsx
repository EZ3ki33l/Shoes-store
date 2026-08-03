'use client'

import Typo from '@/app/components/Typography'
import IconButton from '@/app/components/IconButton'
import { ChevronDown, ChevronRight, Eye, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import ProductRowActions from './ProductRowActions'

const AUDIENCE_LABELS: Record<string, string> = {
  HOMME: 'Homme',
  FEMME: 'Femme',
  ENFANT: 'Enfant',
  UNISEXE: 'Unisexe',
}

type ColorSummary = {
  color: string
  sizes: string[]
  stock: number
}

type ProductImage = {
  url: string
  alt: string | null
  color: string | null
}

type Product = {
  id: string
  name: string
  description: string | null
  basePrice: string
  audience: string[]
  brand: { id: string; name: string; logoUrl: string | null }
  category: { name: string }
  images: ProductImage[]
  colors: ColorSummary[]
}

type PreviewState = {
  product: Product
  color: ColorSummary
}

type ProductListProps = {
  products: Product[]
}

function sortSizes(sizes: string[]) {
  return [...sizes].sort((a, b) => {
    const na = Number(a)
    const nb = Number(b)
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
    return a.localeCompare(b, 'fr', { numeric: true })
  })
}

function imagesForColor(product: Product, color: string) {
  const forColor = product.images.filter((img) => img.color === color)
  const generic = product.images.filter((img) => img.color == null)
  const other = product.images.filter(
    (img) => img.color != null && img.color !== color,
  )
  // Couleur ciblée d'abord, puis images génériques, puis le reste du produit
  const combined = [...forColor, ...generic, ...other]
  return combined.length > 0 ? combined : product.images
}

function ProductPreviewModal({
  preview,
  onClose,
}: {
  preview: PreviewState
  onClose: () => void
}) {
  const { product, color } = preview
  const images = imagesForColor(product, color.color)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-preview-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border bg-white p-5 shadow-lg dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="product-preview-title" className="text-lg font-semibold">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500">
              {product.brand.name} · {product.category.name} ·{' '}
              {product.audience.map((a) => AUDIENCE_LABELS[a]).join(', ')}
            </p>
          </div>
          <IconButton icon={<X size={16} />} label="Fermer" onClick={onClose} />
        </div>

        {images.length > 0 ? (
          <div
            className={`mb-4 grid gap-2 ${
              images.length === 1
                ? 'grid-cols-1'
                : images.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-3'
            }`}
          >
            {images.map((img, index) => (
              <div
                key={`${img.url}-${index}`}
                className="overflow-hidden rounded border bg-neutral-50"
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? `${product.name} — ${color.color} (${index + 1})`}
                  width={640}
                  height={640}
                  className="mx-auto h-auto max-h-64 w-full object-contain"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-4 flex h-48 items-center justify-center rounded border bg-neutral-50 text-sm text-gray-400">
            Aucune image
          </div>
        )}

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-gray-500">Couleur</dt>
          <dd className="font-medium">{color.color}</dd>
          <dt className="text-gray-500">Prix de base</dt>
          <dd>{product.basePrice} €</dd>
          <dt className="text-gray-500">Stock</dt>
          <dd>{color.stock}</dd>
          <dt className="text-gray-500">Pointures</dt>
          <dd>{sortSizes(color.sizes).join(', ')}</dd>
        </dl>

        {product.description && (
          <p className="mt-4 text-sm text-gray-600">{product.description}</p>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default function ProductList({ products }: ProductListProps) {
  const [search, setSearch] = useState('')
  const [collapsedBrandIds, setCollapsedBrandIds] = useState<Set<string>>(new Set())
  const [preview, setPreview] = useState<PreviewState | null>(null)

  function toggleBrand(brandId: string) {
    setCollapsedBrandIds((prev) => {
      const next = new Set(prev)
      if (next.has(brandId)) {
        next.delete(brandId)
      } else {
        next.add(brandId)
      }
      return next
    })
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return products
    return products.filter(
      (p) => p.id.toLowerCase().includes(query) || p.name.toLowerCase().includes(query),
    )
  }, [products, search])

  const brandGroups = useMemo(() => {
    const map = new Map<string, { brand: Product['brand']; products: Product[] }>()
    for (const product of filteredProducts) {
      const group = map.get(product.brand.id)
      if (group) {
        group.products.push(product)
      } else {
        map.set(product.brand.id, { brand: product.brand, products: [product] })
      }
    }
    return Array.from(map.values()).sort((a, b) => a.brand.name.localeCompare(b.brand.name))
  }, [filteredProducts])

  function renderProduct(product: Product) {
    return (
      <li key={product.id} className="overflow-hidden rounded border">
        <div className="group flex items-center gap-3 border-b p-3">
          <Typo variant="body" className="flex-1">
            {product.name}
            <span className="ml-2 text-sm text-gray-500">
              {product.brand.name} · {product.category.name} ·{' '}
              {product.audience.map((a) => AUDIENCE_LABELS[a]).join(', ')}
            </span>
          </Typo>
          <ProductRowActions productId={product.id} productName={product.name} />
        </div>

        {product.colors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50 text-left dark:bg-neutral-800">
                  <th className="border-b px-3 py-2 font-medium">Couleur</th>
                  <th className="border-b px-3 py-2 font-medium">Pointures</th>
                  <th className="border-b px-3 py-2 font-medium">Stock</th>
                  <th className="border-b px-3 py-2 font-medium">Tailles</th>
                </tr>
              </thead>
              <tbody>
                {product.colors.map((color) => (
                  <tr key={color.color} className="border-b last:border-b-0">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{color.color}</span>
                        <IconButton
                          icon={<Eye size={16} />}
                          label={`Voir ${product.name} — ${color.color}`}
                          onClick={() => setPreview({ product, color })}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{color.sizes.length}</td>
                    <td className="px-3 py-2 text-gray-600">{color.stock}</td>
                    <td className="px-3 py-2 text-gray-500">
                      {sortSizes(color.sizes).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-3 py-2 text-sm text-gray-400">Aucune variante</p>
        )}
      </li>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher par id ou nom..."
        className="h-10 w-full max-w-sm rounded border px-3"
      />

      {filteredProducts.length === 0 && (
        <Typo variant="body" className="text-gray-500">
          Aucun produit trouvé.
        </Typo>
      )}

      <div className="flex flex-col gap-6">
        {brandGroups.map(({ brand, products: brandProducts }) => {
          const isCollapsed = collapsedBrandIds.has(brand.id)
          return (
            <div key={brand.id} className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => toggleBrand(brand.id)}
                className="flex w-full items-center gap-3 border-b pb-2 text-left"
              >
                {isCollapsed ? (
                  <ChevronRight size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
                {brand.logoUrl && (
                  <Image
                    src={brand.logoUrl}
                    alt=""
                    height={32}
                    width={32}
                    className="h-8 w-8 object-contain"
                  />
                )}
                <Typo variant="h3" as="h2">
                  {brand.name}
                </Typo>
                <span className="text-sm text-gray-500">({brandProducts.length})</span>
              </button>
              {!isCollapsed && (
                <ul className="flex flex-col gap-3 pl-2">{brandProducts.map(renderProduct)}</ul>
              )}
            </div>
          )
        })}
      </div>

      {preview && <ProductPreviewModal preview={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
