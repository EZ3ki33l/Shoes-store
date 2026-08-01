import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { syncCurrentUser } from '@/app/actions/user'

export async function getCurrenDbtUser() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (user) return user

  return syncCurrentUser()
}

export async function requireAdmin() {
  const user = await getCurrenDbtUser()
  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }
  return user
}
