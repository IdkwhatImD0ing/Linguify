// Clerk Webhook
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { UploadImagePayload, User } from '@/types/api'

import { db } from '@/lib/firebase/admin'



export async function POST(req: Request) {
  // Get the body
  const payload: UploadImagePayload = await req.json();

  try {
    const userRef = db.ref(`users/${payload.id}`)
    await userRef.update({
      latestUploadedImage: payload.imageb64 as string
    })
    return NextResponse.json("Successfully updated latest image", {
      status: 200
    });
  } catch (error: any) {
    console.error('Error updating latest image:', error.response?.data || error.message);

    // Determine the status code
    const status = error.response?.status || 500;

    // Optionally, provide more detailed error messages
    const errorMessage =
      error.response?.data?.error || 'Failed to update latest imag';

    return NextResponse.json(
      { error: errorMessage },
      {status}
    );
  }




}