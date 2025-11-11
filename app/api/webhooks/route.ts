import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { handleProjectCreatedEvent as handleDeploymentProtection } from '@/lib/autoEnableDeploymentProtection';
import { handleProjectCreatedEvent as handleGitValidation } from '@/lib/projectNoGitUrl';
import {
  VercelWebhookPayload,
  ProjectCreatedPayload,
  WebhookEventType,
} from './types';

/**
 * Verifies the webhook signature
 * @param bodyText - The raw request body as text
 * @param signature - The x-vercel-signature header value
 * @returns true if signature is valid
 */
function verifySignature(bodyText: string, signature: string | null): boolean {
  if (!signature || !process.env.WEBHOOK_SECRET) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha1', process.env.WEBHOOK_SECRET)
    .update(bodyText, 'utf-8')
    .digest('hex');

  return expectedSignature === signature;
}

export async function POST(request: NextRequest) {
  console.log('[WEBHOOK] Request received');
  
  // IMPORTANT: Read the body ONCE as text - we'll use it for both signature verification and JSON parsing
  let bodyText: string;
  
  try {
    // Validate environment configuration
    if (!process.env.WEBHOOK_SECRET || !process.env.VERCEL_TOKEN) {
      console.error('[WEBHOOK] ERROR: Missing required environment variables');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Read and verify request
    bodyText = await request.text();
    const signatureHeader = request.headers.get('x-vercel-signature');
    
    if (!verifySignature(bodyText, signatureHeader)) {
      console.error('[WEBHOOK] ERROR: Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    let body: VercelWebhookPayload;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('[WEBHOOK] ERROR: Failed to parse JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.id || !body.type || !body.createdAt || !body.payload) {
      console.error('[WEBHOOK] ERROR: Missing required fields');
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // Log webhook event
    console.log('[WEBHOOK] Event received:', {
      id: body.id,
      type: body.type,
      region: body.region || 'unknown',
    });

    // Handle project.created events
    if (body.type === 'project.created') {
      const projectPayload = body.payload as ProjectCreatedPayload;

      if (!projectPayload.project || !projectPayload.project.id) {
        console.error('[WEBHOOK] ERROR: Invalid project payload');
        return NextResponse.json(
          { error: 'Invalid project.created payload' },
          { status: 400 }
        );
      }

      const teamId = projectPayload.teamId || process.env.VERCEL_TEAM_ID;
      
      console.log('[WEBHOOK] Processing project.created:', {
        projectId: projectPayload.project.id,
        projectName: projectPayload.project.name,
        teamId: teamId || 'personal',
      });

      // Execute handlers in parallel
      const [deploymentProtectionResult, gitValidationResult] = await Promise.allSettled([
        handleDeploymentProtection(projectPayload.project, teamId),
        handleGitValidation(projectPayload.project, teamId),
      ]);

      // Log results
      if (deploymentProtectionResult.status === 'fulfilled') {
        const result = deploymentProtectionResult.value;
        if (result.success) {
          console.log('[WEBHOOK] Deployment protection enabled:', result.projectId);
        } else {
          console.error('[WEBHOOK] Deployment protection failed:', result.error);
        }
      } else {
        console.error('[WEBHOOK] Deployment protection error:', deploymentProtectionResult.reason);
      }

      if (gitValidationResult.status === 'fulfilled') {
        const result = gitValidationResult.value;
        if (result.success) {
          console.log('[WEBHOOK] Git validation complete:', {
            projectId: result.projectId,
            hasGit: result.hasGitConnection,
          });
        } else {
          console.error('[WEBHOOK] Git validation failed:', result.error);
        }
      } else {
        console.error('[WEBHOOK] Git validation error:', gitValidationResult.reason);
      }
    } else {
      console.log(`[WEBHOOK] Ignoring event type: ${body.type}`);
    }

    return NextResponse.json(
      { received: true, id: body.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('[WEBHOOK] Fatal error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
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

