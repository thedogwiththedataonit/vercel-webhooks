import { NextRequest, NextResponse } from 'next/server';

// Type definition for the Vercel webhook payload
interface VercelWebhookPayload<T = any> {
  id: string;
  type: string;
  createdAt: number;
  payload: T;
  region: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming webhook payload
    const body: VercelWebhookPayload = await request.json();

    // Validate required fields
    if (!body.id || !body.type || !body.createdAt || !body.payload) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // Log the webhook event
    console.log('Received Vercel webhook:', {
      id: body.id,
      type: body.type,
      createdAt: new Date(body.createdAt),
      region: body.region,
    });


    // Return success response
    return NextResponse.json(
      { received: true, id: body.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add GET handler for health check
export async function GET() {
  return NextResponse.json(
    { message: 'Webhook endpoint is active' },
    { status: 200 }
  );
}

