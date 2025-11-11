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
  console.log('[WEBHOOK] Incoming webhook request received');
  
  // IMPORTANT: Read the body ONCE as text - we'll use it for both signature verification and JSON parsing
  let bodyText: string;
  
  try {
    // Step 1: Check environment configuration
    console.log('[WEBHOOK] Step 1: Checking environment configuration');
    if (!process.env.WEBHOOK_SECRET) {
      console.error('[WEBHOOK] ERROR: WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }
    console.log('[WEBHOOK] WEBHOOK_SECRET is configured');

    if (!process.env.VERCEL_TOKEN) {
      console.error('[WEBHOOK] ERROR: VERCEL_TOKEN is not configured');
      return NextResponse.json(
        { error: 'VERCEL_TOKEN not configured' },
        { status: 500 }
      );
    }
    console.log('[WEBHOOK] VERCEL_TOKEN is configured');

    // Step 2: Read the raw request body
    console.log('[WEBHOOK] Step 2: Reading request body');
    try {
      bodyText = await request.text();
      console.log('[WEBHOOK] Request body read successfully:', {
        bodyLength: bodyText.length,
        bodyPreview: bodyText.substring(0, 100) + (bodyText.length > 100 ? '...' : ''),
      });
    } catch (readError) {
      console.error('[WEBHOOK] ERROR: Failed to read request body:', readError);
      return NextResponse.json(
        { error: 'Failed to read request body' },
        { status: 400 }
      );
    }

    // Step 3: Log request headers
    const signatureHeader = request.headers.get('x-vercel-signature');
    console.log('[WEBHOOK] Step 3: Request headers:', {
      signature: signatureHeader ? 'present' : 'missing',
      contentType: request.headers.get('content-type'),
      userAgent: request.headers.get('user-agent'),
    });

    // Step 4: Verify the signature
    console.log('[WEBHOOK] Step 4: Verifying signature');
    let isValid = false;
    try {
      isValid = verifySignature(bodyText, signatureHeader);
      console.log(`[WEBHOOK] Signature verification result: ${isValid}`);
    } catch (sigError) {
      console.error('[WEBHOOK] ERROR: Signature verification error:', sigError);
      throw sigError;
    }
    
    if (!isValid) {
      console.error('[WEBHOOK] ERROR: Invalid webhook signature - rejecting request');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Step 5: Parse the JSON body
    console.log('[WEBHOOK] Step 5: Parsing JSON body');
    let body: VercelWebhookPayload;
    try {
      body = JSON.parse(bodyText);
      console.log('[WEBHOOK] Body parsed successfully:', {
        hasId: !!body.id,
        hasType: !!body.type,
        hasCreatedAt: !!body.createdAt,
        hasPayload: !!body.payload,
        type: body.type,
      });
    } catch (parseError) {
      console.error('[WEBHOOK] ERROR: Failed to parse JSON body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Step 6: Validate required fields
    console.log('[WEBHOOK] Step 6: Validating required fields');
    if (!body.id || !body.type || !body.createdAt || !body.payload) {
      console.error('[WEBHOOK] ERROR: Missing required fields:', {
        id: !!body.id,
        type: !!body.type,
        createdAt: !!body.createdAt,
        payload: !!body.payload,
      });
      return NextResponse.json(
        { error: 'Invalid webhook payload - missing required fields' },
        { status: 400 }
      );
    }
    console.log('[WEBHOOK] All required fields present');

    // Step 7: Log the webhook event details
    console.log('[WEBHOOK] Step 7: Webhook event details:', {
      id: body.id,
      type: body.type,
      createdAt: new Date(body.createdAt).toISOString(),
      region: body.region || 'unknown',
    });

    // Step 8: Handle project.created events
    if (body.type === 'project.created') {
      console.log('[WEBHOOK] Step 8: Processing project.created event');
      
      let projectPayload: ProjectCreatedPayload;
      try {
        projectPayload = body.payload as ProjectCreatedPayload;
        console.log('[WEBHOOK] Project payload extracted:', {
          projectId: projectPayload.project?.id || 'missing',
          projectName: projectPayload.project?.name || 'missing',
          hasProject: !!projectPayload.project,
        });
      } catch (castError) {
        console.error('[WEBHOOK] ERROR: Failed to cast payload to ProjectCreatedPayload:', castError);
        throw castError;
      }

      if (!projectPayload.project || !projectPayload.project.id) {
        console.error('[WEBHOOK] ERROR: Invalid project payload - missing project or project.id');
        return NextResponse.json(
          { error: 'Invalid project.created payload' },
          { status: 400 }
        );
      }

      const teamId = projectPayload.teamId || process.env.VERCEL_TEAM_ID;
      console.log('[WEBHOOK] Using teamId:', teamId || 'none (personal account)');

      console.log('[WEBHOOK] Project details:', {
        projectId: projectPayload.project.id,
        projectName: projectPayload.project.name,
        ownerId: projectPayload.project.ownerId,
        accountId: projectPayload.project.accountId,
        teamId,
      });

      // Step 9: Run handlers in parallel
      console.log('[WEBHOOK] Step 9: Starting parallel handler execution');
      console.log('[WEBHOOK] Invoking handleDeploymentProtection...');
      console.log('[WEBHOOK] Invoking handleGitValidation...');

      let deploymentProtectionResult;
      let gitValidationResult;

      try {
        [deploymentProtectionResult, gitValidationResult] = await Promise.allSettled([
          handleDeploymentProtection(projectPayload.project, teamId),
          handleGitValidation(projectPayload.project, teamId),
        ]);
        console.log('[WEBHOOK] Both handlers completed execution');
      } catch (handlerError) {
        console.error('[WEBHOOK] ERROR: Error during handler execution:', handlerError);
        throw handlerError;
      }

      // Step 10: Log handler results
      console.log('[WEBHOOK] Step 10: Processing handler results');
      
      if (deploymentProtectionResult.status === 'fulfilled') {
        console.log('[WEBHOOK] Deployment protection succeeded:', {
          success: deploymentProtectionResult.value.success,
          message: deploymentProtectionResult.value.message,
          projectId: deploymentProtectionResult.value.projectId,
        });
      } else {
        console.error('[WEBHOOK] ERROR: Deployment protection failed:', {
          reason: deploymentProtectionResult.reason,
          message: deploymentProtectionResult.reason?.message,
          stack: deploymentProtectionResult.reason?.stack,
        });
      }

      if (gitValidationResult.status === 'fulfilled') {
        console.log('[WEBHOOK] Git validation succeeded:', {
          success: gitValidationResult.value.success,
          hasGitConnection: gitValidationResult.value.hasGitConnection,
          message: gitValidationResult.value.message,
          projectId: gitValidationResult.value.projectId,
        });
      } else {
        console.error('[WEBHOOK] ERROR: Git validation failed:', {
          reason: gitValidationResult.reason,
          message: gitValidationResult.reason?.message,
          stack: gitValidationResult.reason?.stack,
        });
      }
    } else {
      console.log(`[WEBHOOK] INFO: Ignoring event type: ${body.type}`);
    }

    // Step 11: Return success response
    console.log('[WEBHOOK] Step 11: Returning success response');
    console.log('[WEBHOOK] Webhook processing completed successfully');
    return NextResponse.json(
      { received: true, id: body.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('[WEBHOOK] FATAL ERROR during webhook processing:', {
      errorType: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorObject: error,
    });
    
    // Try to extract more info from the error
    if (error && typeof error === 'object') {
      console.error('[WEBHOOK] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
    
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

