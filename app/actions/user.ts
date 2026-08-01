'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function syncCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (existing) return existing

  const user = await currentUser()
  if (!user) return null

  return prisma.user.create({
    data: {
      clerkId: userId,
      email: user.emailAddresses[0]?.emailAddress ?? '',
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })
}
