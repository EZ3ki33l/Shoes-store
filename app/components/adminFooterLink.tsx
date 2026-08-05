/**
 * Lien vers /admin affiché dans le footer uniquement si l'utilisateur courant est ADMIN.
 */

import Link from 'next/link'
import { getCurrentDbtUser } from '@/lib/auth'

export default async function AdminFooterLink() {
  const user = await getCurrentDbtUser()
  if (user?.role !== 'ADMIN') return null

  return (
    <Link
      href={'/admin'}
      className="text-primary-700 bg-secondary-50 rounded-full border-none p-2 text-center text-xs"
    >
      Espace admin
    </Link>
  )
}
