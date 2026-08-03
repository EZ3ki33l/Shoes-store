'use server'

import { requireAdminOrThrow } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function promoteToAdmin(targetUserId: string) {
  await requireAdminOrThrow()

  await prisma.user.update({
    where: { id: targetUserId },
    data: { role: 'ADMIN' },
  })

  revalidatePath('/admin')
}
