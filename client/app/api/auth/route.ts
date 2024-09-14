// Clerk Webhook
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { User } from '@/types/api'

import { db } from '@/lib/firebase/admin'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  // Handle the user.created event
  const eventType = evt.type
  if (eventType === 'user.created') {
    try {
      const id = evt.data.id

      // Reference the path 'users/{id}'
      const userRef = db.ref(`users/${id}`)

      // Prepare the user data
      const userData: User = {
        uid: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        firstname: evt.data.first_name as string,
        lastname: evt.data.last_name as string,
        currentStreak: 0,
        highestStreak: 0,
        interactions: [],
        latestUploadedImage: ""
      }

      // Set the data at 'users/{id}'
      await userRef.set(userData)

      return NextResponse.json({
        userId: id,
        message: 'Successfully added user to Firebase',
      })
    } catch (e) {
      console.error('Error adding user to Firebase:', e)
      return NextResponse.error()
    }
  }

  return new Response('', { status: 200 })
}
