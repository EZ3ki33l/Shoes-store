import Link from 'next/link'
import { getCurrentDbtUser } from '@/lib/auth'

export default async function AdminFooterLink() {
  const user = await getCurrentDbtUser()
  if (user?.role !== 'ADMIN') return null

  return (
    <Link href={'/admin'} className="underline">
      Espace admin
    </Link>
  )
}
