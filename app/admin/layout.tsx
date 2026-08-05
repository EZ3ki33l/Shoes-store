/**
 * Layout admin : garde d'accès + navigation partagée sur toutes les pages /admin.
 */

import type { ReactNode } from 'react'
import { requireAdminOrThrow } from '@/lib/auth'
import AdminNav from '@/app/components/AdminNav'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminOrThrow()

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex justify-center">
        <AdminNav />
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}
