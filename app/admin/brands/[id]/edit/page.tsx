import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import BrandForm from '../../BrandForm'
import { notFound } from 'next/navigation'

export default async function editBrandPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminOrThrow()
  const { id } = await params
  const brand = await prisma.brand.findUnique({ where: { id } })

  if (!brand) notFound()

  return <BrandForm brand={brand} />
}
