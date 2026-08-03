import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { syncCurrentUser } from '@/app/actions/user'

export async function getCurrentDbtUser() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (user) return user

  return syncCurrentUser()
}

export async function requireAdminOrThrow() {
  const user = await getCurrentDbtUser()
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
  return user
}
