import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '../../ProductForm'
import VariantMatrix from '../../VariantMatrix'
import VariantList from '../../VariantList'
import VariantForm from '../../VariantForm'
import ImageForm from '../../ImageForm'

export default async function editProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminOrThrow()
  const { id } = await params
  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: [{ color: 'asc' }, { size: 'asc' }] },
        images: { orderBy: { position: 'asc' } },
      },
    }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

  const existingColors = [...new Set(product.variants.map((v) => v.color))]
  const variantsForList = product.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    color: v.color,
    price: v.price?.toString() ?? null,
    stock: v.stock,
  }))

  return (
    <div className="flex flex-col gap-8">
      <ProductForm
        product={{ ...product, basePrice: product.basePrice.toString() }}
        brands={brands}
        categories={categories}
      />
      <VariantMatrix productId={product.id} existingColors={existingColors} />
      <VariantList variants={variantsForList} />
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer font-medium">Ajouter une combinaison isolée</summary>
        <div className="mt-4">
          <VariantForm productId={product.id} />
        </div>
      </details>
      <ImageForm
        productId={product.id}
        variants={product.variants}
        images={product.images}
      />
    </div>
  )
}
