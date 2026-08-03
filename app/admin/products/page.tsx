import Typo from '@/app/components/Typography'
import { prisma } from '@/lib/prisma'
import ProductForm from './ProductForm'
import ProductList from './ProductList'

const AUDIENCE_LABELS: Record<string, string> = {
  HOMME: 'Homme',
  FEMME: 'Femme',
  ENFANT: 'Enfant',
  UNISEXE: 'Unisexe',
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ brandId?: string; categoryId?: string; audience?: string }>
}) {
  const { brandId, categoryId, audience } = await searchParams

  const [products, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(brandId ? { brandId } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(audience ? { audience: { has: audience as never } } : {}),
      },
      include: { brand: true, category: true },
      orderBy: { name: 'asc' },
    }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="flex flex-col gap-8">
      <Typo variant="h1" as="h1">
        Les produits
      </Typo>
      <ProductForm brands={brands} categories={categories} />

      <form className="flex flex-wrap gap-3">
        <select name="brandId" defaultValue={brandId ?? ''} className="h-10 rounded border px-3">
          <option value="">Toutes les marques</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          name="categoryId"
          defaultValue={categoryId ?? ''}
          className="h-10 rounded border px-3"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="audience" defaultValue={audience ?? ''} className="h-10 rounded border px-3">
          <option value="">Toutes les audiences</option>
          {Object.entries(AUDIENCE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded bg-neutral-200 px-4 py-2">
          Filtrer
        </button>
      </form>

      <ProductList
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          audience: product.audience,
          brand: {
            id: product.brand.id,
            name: product.brand.name,
            logoUrl: product.brand.logoUrl,
          },
          category: { name: product.category.name },
        }))}
      />
    </div>
  )
}
