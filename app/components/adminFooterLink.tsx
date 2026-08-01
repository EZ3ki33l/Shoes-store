import Link from 'next/link'
import { getCurrenDbtUser } from '@/lib/auth'

export default async function AdminFooterLink() {
  const user = await getCurrenDbtUser()
  if (user?.role !== 'ADMIN') return null

  return (
    <Link href={'/admin'} className="underline">
      Espace admin
    </Link>
  )
}
