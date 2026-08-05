/**
 * Liste des marques + formulaire de création (admin).
 */

import Typo from '@/app/components/Typography'
import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import BrandForm from './BrandForm'
import BrandRowActions from './BrandRowActions'

export default async function BrandPage() {
  await requireAdminOrThrow()

  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } })
  return (
    <div className="flex flex-col gap-8">
      <Typo variant="h1" as="h1">
        Marques
      </Typo>

      <BrandForm />

      <ul className="flex flex-col gap-3">
        {brands.map((brand) => (
          <li key={brand.id} className="group flex items-center gap-3 rounded border p-3">
            {brand.logoUrl && (
              <Image
                src={brand.logoUrl}
                alt=""
                height={40}
                width={40}
                className="h-10 w-10 object-contain"
              />
            )}
            <Typo variant="body" className="flex-1">
              {brand.name}
            </Typo>
            <BrandRowActions brandId={brand.id} brandName={brand.name} />
          </li>
        ))}
      </ul>
    </div>
  )
}
