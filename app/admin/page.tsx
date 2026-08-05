/**
 * Tableau de bord admin — accessible uniquement aux utilisateurs ADMIN.
 */

import { requireAdminOrThrow } from '@/lib/auth'
import Typo from '../components/Typography'

export default async function AdminPage() {
  const admin = await requireAdminOrThrow()

  return (
    <div className="flex flex-col gap-4">
      <Typo variant="h1" as="h1">
        Espace admin
      </Typo>
      <Typo variant="body">Connecté en tant que {admin.email}</Typo>
      <Typo variant="caption">
        Utilisez le menu Catalogue pour gérer les marques, catégories et produits.
      </Typo>
    </div>
  )
}
