import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '../../ProductForm'
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

  return (
    <div className="flex flex-col gap-8">
      <ProductForm
        product={{ ...product, basePrice: product.basePrice.toString() }}
        brands={brands}
        categories={categories}
      />
      <VariantForm productId={product.id} />
      <ImageForm productId={product.id} variants={product.variants} />
    </div>
  )
}
