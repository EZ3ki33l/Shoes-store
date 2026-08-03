import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '../../ProductForm'

export default async function editProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminOrThrow()
  const { id } = await params
  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

  return (
    <ProductForm
      product={{ ...product, basePrice: product.basePrice.toString() }}
      brands={brands}
      categories={categories}
    />
  )
}
