/**
 * Auto-Enable Deployment Protection
 * 
 * This function automatically enables deployment protection for newly created projects.
 * Deployment protection requires manual approval before deployments go live, adding
 * an extra layer of security and control.
 * 
 * @module autoEnableDeploymentProtection
 */

import { Vercel } from '@vercel/sdk';

/**
 * Configuration for deployment protection settings
 */
interface DeploymentProtectionConfig {
  /** Vercel project ID */
  projectId: string;
  /** Vercel team ID (optional for personal accounts) */
  teamId?: string;
  /** Scope of protection: 'all' includes production, 'non-production' excludes it */
  scope?: 'all' | 'non-production';
}

/**
 * Result of enabling deployment protection
 */
interface DeploymentProtectionResult {
  success: boolean;
  projectId: string;
  message: string;
  error?: string;
}

/**
 * Enables deployment protection for a Vercel project
 * 
 * This function updates a project's settings to require approval before deployments
 * are made live. This is particularly useful for compliance, security, and quality
 * control requirements.
 * 
 * @param config - Configuration object containing project details
 * @param config.projectId - The Vercel project ID to update
 * @param config.teamId - Optional team ID (required for team projects)
 * @param config.scope - Protection scope: 'all' (includes production) or 'non-production'
 * 
 * @returns Promise<DeploymentProtectionResult> - Result of the operation
 * 
 * @example
 * ```typescript
 * const result = await autoEnableDeploymentProtection({
 *   projectId: 'prj_abc123',
 *   teamId: 'team_xyz789',
 *   scope: 'all'
 * });
 * 
 * if (result.success) {
 *   console.log('Protection enabled:', result.message);
 * }
 * ```
 */
export async function autoEnableDeploymentProtection(
  config: DeploymentProtectionConfig
): Promise<DeploymentProtectionResult> {
  console.log('[DEPLOY-PROTECTION] Function called with config:', {
    projectId: config.projectId,
    teamId: config.teamId || 'none',
    scope: config.scope || 'all',
  });

  const { projectId, teamId, scope = 'all' } = config;

  try {
    // Step 1: Validate environment variables
    console.log('[DEPLOY-PROTECTION] Step 1: Validating environment variables');
    if (!process.env.VERCEL_TOKEN) {
      console.error('[DEPLOY-PROTECTION] ERROR: VERCEL_TOKEN not set');
      throw new Error('VERCEL_TOKEN environment variable is not set');
    }
    console.log('[DEPLOY-PROTECTION] VERCEL_TOKEN is set');

    // Step 2: Initialize Vercel SDK client
    console.log('[DEPLOY-PROTECTION] Step 2: Initializing Vercel SDK');
    let vercel: Vercel;
    try {
      vercel = new Vercel({
        bearerToken: process.env.VERCEL_TOKEN,
      });
      console.log('[DEPLOY-PROTECTION] Vercel SDK initialized');
    } catch (sdkError) {
      console.error('[DEPLOY-PROTECTION] ERROR: Failed to initialize Vercel SDK:', sdkError);
      throw sdkError;
    }

    // Step 3: Prepare update request
    const deploymentType = scope === 'all' ? 'all' : 'preview';
    console.log('[DEPLOY-PROTECTION] Step 3: Preparing update request:', {
      projectId,
      teamId: teamId || 'none',
      deploymentType,
    });

    // Step 4: Enable deployment protection by setting SSO protection
    console.log('[DEPLOY-PROTECTION] Step 4: Calling updateProject API');
    try {
      await vercel.projects.updateProject({
        idOrName: projectId,
        teamId,
        requestBody: {
          ssoProtection: {
            deploymentType: deploymentType as 'all' | 'preview',
          },
        },
      });
      console.log('[DEPLOY-PROTECTION] updateProject API call succeeded');
    } catch (apiError) {
      console.error('[DEPLOY-PROTECTION] ERROR: updateProject API call failed:', {
        error: apiError,
        message: apiError instanceof Error ? apiError.message : String(apiError),
        stack: apiError instanceof Error ? apiError.stack : undefined,
      });
      throw apiError;
    }

    console.log(`[DEPLOY-PROTECTION] Deployment protection enabled for project: ${projectId}`, {
      scope,
      teamId: teamId || 'none',
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      projectId,
      message: `Deployment protection (${scope}) enabled successfully`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error(`[DEPLOY-PROTECTION] FATAL ERROR for project: ${projectId}`, {
      error: errorMessage,
      errorType: error?.constructor?.name,
      errorStack: error instanceof Error ? error.stack : undefined,
      projectId,
      teamId: teamId || 'none',
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      projectId,
      message: 'Failed to enable deployment protection',
      error: errorMessage,
    };
  }
}

/**
 * Handles deployment protection for project creation webhook events
 * 
 * This is a convenience wrapper specifically for use with Vercel webhook events.
 * It extracts the necessary information from the webhook payload and enables
 * deployment protection.
 * 
 * @param projectPayload - The project object from the webhook payload
 * @param teamId - Optional team ID
 * 
 * @returns Promise<DeploymentProtectionResult> - Result of the operation
 * 
 * @example
 * ```typescript
 * // In a webhook handler
 * if (event.type === 'project.created') {
 *   await handleProjectCreatedEvent(event.payload.project, teamId);
 * }
 * ```
 */
export async function handleProjectCreatedEvent(
  projectPayload: { id: string; name?: string },
  teamId?: string
): Promise<DeploymentProtectionResult> {
  console.log('[DEPLOY-PROTECTION] handleProjectCreatedEvent called:', {
    projectId: projectPayload?.id || 'missing',
    projectName: projectPayload?.name || 'missing',
    teamId: teamId || 'none',
    hasPayload: !!projectPayload,
  });

  if (!projectPayload || !projectPayload.id) {
    console.error('[DEPLOY-PROTECTION] ERROR: Invalid project payload - missing id');
    return {
      success: false,
      projectId: 'unknown',
      message: 'Invalid project payload - missing id',
      error: 'Project payload or project id is missing',
    };
  }

  console.log('[DEPLOY-PROTECTION] Auto-enabling deployment protection for new project');
  
  try {
    const result = await autoEnableDeploymentProtection({
      projectId: projectPayload.id,
      teamId,
      scope: 'all', // Protect all deployments including production
    });
    console.log('[DEPLOY-PROTECTION] handleProjectCreatedEvent completed:', result);
    return result;
  } catch (error) {
    console.error('[DEPLOY-PROTECTION] ERROR: handleProjectCreatedEvent error:', error);
    throw error;
  }
}

