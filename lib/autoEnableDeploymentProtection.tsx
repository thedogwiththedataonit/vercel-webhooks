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
  const { projectId, teamId, scope = 'all' } = config;

  try {
    // Validate environment variables
    if (!process.env.VERCEL_TOKEN) {
      throw new Error('VERCEL_TOKEN environment variable is not set');
    }

    // Initialize Vercel SDK client
    const vercel = new Vercel({
      bearerToken: process.env.VERCEL_TOKEN,
    });

    // Enable deployment protection by setting SSO protection
    // This requires Vercel Authentication for all deployments or just previews
    await vercel.projects.updateProject({
      idOrName: projectId,
      teamId,
      requestBody: {
        ssoProtection: {
          deploymentType: scope === 'all' ? 'all' : 'preview',
        },
      },
    });

    console.log(`✅ Deployment protection enabled for project: ${projectId}`, {
      scope,
      teamId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      projectId,
      message: `Deployment protection (${scope}) enabled successfully`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error(`❌ Failed to enable deployment protection for project: ${projectId}`, {
      error: errorMessage,
      projectId,
      teamId,
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
  console.log('🔐 Auto-enabling deployment protection for new project:', {
    projectId: projectPayload.id,
    projectName: projectPayload.name,
    teamId,
  });

  return autoEnableDeploymentProtection({
    projectId: projectPayload.id,
    teamId,
    scope: 'all', // Protect all deployments including production
  });
}

