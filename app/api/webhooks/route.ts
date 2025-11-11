import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { handleProjectCreatedEvent as handleDeploymentProtection } from '@/lib/autoEnableDeploymentProtection';
import { handleProjectCreatedEvent as handleGitValidation } from '@/lib/projectNoGitUrl';

// Type definition for the Vercel webhook payload
interface VercelWebhookPayload<T = any> {
  id: string;
  type: string;
  createdAt: number;
  payload: T;
  region: string;
}

// Type definition for project.created event payload
interface ProjectCreatedPayload {
  project: {
    id: string;
    name: string;
    ownerId?: string;
    accountId?: string;
  };
  teamId?: string;
}

async function verifySignature(req: NextRequest): Promise<boolean> {
  const payload = await req.text();
  const signature = crypto
    .createHmac('sha1', process.env.WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');
  return signature === req.headers.get('x-vercel-signature');
}

export async function POST(request: NextRequest) {
  try {
    // Check if WEBHOOK_SECRET is configured
    if (!process.env.WEBHOOK_SECRET) {
      console.error('WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Verify the signature
    const isValid = await verifySignature(request);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Clone the request to read the body again (since we consumed it in verifySignature)
    const clonedRequest = request.clone();
    const body: VercelWebhookPayload = await clonedRequest.json();

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

    // Handle project.created events
    if (body.type === 'project.created') {
      const projectPayload = body.payload as ProjectCreatedPayload;
      const teamId = projectPayload.teamId || process.env.VERCEL_TEAM_ID;

      console.log('🎯 Processing project.created event:', {
        projectId: projectPayload.project.id,
        projectName: projectPayload.project.name,
        teamId,
      });

      // Run both handlers in parallel for better performance
      const [deploymentProtectionResult, gitValidationResult] = await Promise.allSettled([
        handleDeploymentProtection(projectPayload.project, teamId),
        handleGitValidation(projectPayload.project, teamId),
      ]);

      // Log results
      if (deploymentProtectionResult.status === 'fulfilled') {
        console.log('Deployment protection result:', deploymentProtectionResult.value);
      } else {
        console.error('Deployment protection failed:', deploymentProtectionResult.reason);
      }

      if (gitValidationResult.status === 'fulfilled') {
        console.log('Git validation result:', gitValidationResult.value);
      } else {
        console.error('Git validation failed:', gitValidationResult.reason);
      }
    }

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

