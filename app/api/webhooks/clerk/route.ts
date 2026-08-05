/**
 * Webhook Clerk (Svix) : synchronise les événements user.created / updated / deleted
 * avec la table User Prisma.
 */

import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const signingSecret = process.env.CLERK_WEBHOOKS_SIGNING_SECRET
  if (!signingSecret) {
    throw new Error('CLERK_WEBHOOKS_SIGNING_SECRET manquant')
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('En tête svix manquants', { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(signingSecret)

  // Vérifie la signature Svix avant de traiter le payload
  let event: any
  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-signature': svixSignature,
      'svix-timestamp': svixTimestamp,
    })
  } catch {
    return new Response('Signature invalide', { status: 400 })
  }

  const { type, data } = event

  // Upsert : crée à la première synchro, met à jour email / nom ensuite
  if (type === 'user.created' || type === 'user.updated') {
    const email = data.email_addresses?.[0]?.email_address ?? ''
    await prisma.user.upsert({
      where: { clerkId: data.id },
      update: {
        email,
        firstName: data.first_name,
        lastName: data.last_name,
      },
      create: {
        clerkId: data.id,
        email,
        firstName: data.first_name,
        lastName: data.last_name,
      },
    })
  }

  if (type === 'user.deleted') {
    await prisma.user.deleteMany({ where: { clerkId: data.id } })
  }

  return new Response('OK', { status: 200 })
}
