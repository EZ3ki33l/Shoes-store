'use client'

import Typo from '@/app/components/Typography'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import ProductRowActions from './ProductRowActions'

const AUDIENCE_LABELS: Record<string, string> = {
  HOMME: 'Homme',
  FEMME: 'Femme',
  ENFANT: 'Enfant',
  UNISEXE: 'Unisexe',
}

type Product = {
  id: string
  name: string
  audience: string[]
  brand: { id: string; name: string; logoUrl: string | null }
  category: { name: string }
}

type ProductListProps = {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const [search, setSearch] = useState('')
  const [collapsedBrandIds, setCollapsedBrandIds] = useState<Set<string>>(new Set())

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
      <li key={product.id} className="flex flex-col gap-2">
        <div className="group flex items-center gap-3 rounded border p-3">
          <Typo variant="body" className="flex-1">
            {product.name}
            <span className="ml-2 text-sm text-gray-500">
              {product.brand.name} · {product.category.name} ·{' '}
              {product.audience.map((a) => AUDIENCE_LABELS[a]).join(', ')}
            </span>
          </Typo>
          <ProductRowActions productId={product.id} productName={product.name} />
        </div>
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
    </div>
  )
}
