import { requireAdminOrThrow } from '@/lib/auth'
import Typo from '../components/Typography'
import Link from 'next/link'

export default async function AdminPage() {
  const admin = await requireAdminOrThrow()

  return (
    <div className="flex flex-col gap-8">
      <Typo variant="h1" as="h1">
        Espace admin
      </Typo>
      <Typo variant="body">Connecté en tant que {admin.email}</Typo>

      <div className="flex flex-col gap-3">
        <Link href="/admin/brands" className="underline">
          Gérer les marques
        </Link>
        <Link href={'/admin/categories'} className="underline">
          Gérer les catégories de produits
        </Link>
        <Link href={'/admin/products'} className="underline">
          Gérer les produits
        </Link>
      </div>
    </div>
  )
}
