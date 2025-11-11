/**
 * Project Git Connection Validator
 * 
 * This function checks if a newly created Vercel project has a Git repository
 * connected. Projects without Git connections may not follow best practices
 * for version control and deployment workflows.
 * 
 * @module projectNoGitUrl
 */

import { Vercel } from '@vercel/sdk';

/**
 * Configuration for Git connection validation
 */
interface GitValidationConfig {
  /** Vercel project ID */
  projectId: string;
  /** Project name for logging purposes */
  projectName?: string;
  /** Vercel team ID (optional for personal accounts) */
  teamId?: string;
  /** Owner ID from the webhook payload */
  ownerId?: string;
}

/**
 * Result of Git connection validation
 */
interface GitValidationResult {
  success: boolean;
  projectId: string;
  projectName?: string;
  hasGitConnection: boolean;
  gitProvider?: string;
  repository?: string;
  message: string;
  error?: string;
}

/**
 * Alert levels for monitoring and logging systems
 */
enum AlertLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

/**
 * Sends an alert to logging/monitoring systems
 * 
 * In production, this should integrate with your monitoring solution
 * (e.g., Datadog, Sentry, PagerDuty, Slack, etc.)
 * 
 * @param level - Alert severity level
 * @param message - Alert message
 * @param metadata - Additional context data
 */
function sendAlert(level: AlertLevel, message: string, metadata: Record<string, any>) {
  const alert = {
    level,
    message,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
      service: 'vercel-webhook-handler',
    },
  };

  // Log to console with appropriate level
  if (level === AlertLevel.ERROR) {
    console.error(`[${level}] ${message}`, alert.metadata);
  } else if (level === AlertLevel.WARNING) {
    console.warn(`[${level}] ${message}`, alert.metadata);
  } else {
    console.log(`[${level}] ${message}`, alert.metadata);
  }

  // TODO: Integrate with your monitoring/alerting system
  // Examples:
  // - await sendToSlack(alert);
  // - await sendToDatadog(alert);
  // - await sendToSentry(alert);
  // - await sendToPagerDuty(alert);
}

/**
 * Validates that a Vercel project has a Git repository connected
 * 
 * This function fetches the full project details from Vercel and checks
 * if a Git repository (GitHub, GitLab, or Bitbucket) is connected.
 * If no Git connection is found, it logs the issue and sends alerts.
 * 
 * @param config - Configuration object containing project details
 * @param config.projectId - The Vercel project ID to validate
 * @param config.projectName - Optional project name for better logging
 * @param config.teamId - Optional team ID (required for team projects)
 * @param config.ownerId - Optional owner ID from webhook payload
 * 
 * @returns Promise<GitValidationResult> - Result of the validation
 * 
 * @example
 * ```typescript
 * const result = await validateProjectGitConnection({
 *   projectId: 'prj_abc123',
 *   projectName: 'my-awesome-app',
 *   teamId: 'team_xyz789'
 * });
 * 
 * if (!result.hasGitConnection) {
 *   console.warn('Project created without Git:', result.message);
 * }
 * ```
 */
export async function validateProjectGitConnection(
  config: GitValidationConfig
): Promise<GitValidationResult> {
  const { projectId, projectName, teamId, ownerId } = config;

  try {
    if (!process.env.VERCEL_TOKEN) {
      throw new Error('VERCEL_TOKEN environment variable is not set');
    }

    const vercel = new Vercel({
      bearerToken: process.env.VERCEL_TOKEN,
    });

    // Fetch project details
    const projectsResponse = await vercel.projects.getProjects({
      search: projectId,
      teamId,
      limit: '1',
    });

    const project = projectsResponse.projects?.[0];

    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    // Check Git connection
    const hasGitConnection = Boolean(project.link?.type);
    const gitProvider = project.link?.type;
    
    // Get repository name
    let repository: string | undefined;
    if (project.link) {
      const link = project.link as any;
      repository = link.repo || link.name || link.projectName || link.slug;
    }

    if (!hasGitConnection) {
      // Log explicit alert for projects created without Git URL
      console.warn('[ALERT] Project created with no Git URL:', {
        projectId,
        projectName: projectName || project.name,
        ownerId: ownerId || project.accountId,
        teamId: teamId || 'personal',
      });
      
      // Send warning alert to monitoring system
      sendAlert(AlertLevel.WARNING, 'Project created with no Git URL', {
        projectId,
        projectName: projectName || project.name,
        ownerId: ownerId || project.accountId,
        teamId,
        action: 'PROJECT_NO_GIT_URL',
      });

      return {
        success: true,
        projectId,
        projectName: projectName || project.name,
        hasGitConnection: false,
        message: 'Project created with no Git URL',
      };
    }

    // Project has Git connection
    console.log('[GIT-VALIDATION] Git connected:', {
      projectId,
      gitProvider,
      repository,
    });

    return {
      success: true,
      projectId,
      projectName: projectName || project.name,
      hasGitConnection: true,
      gitProvider,
      repository,
      message: `Project connected to ${gitProvider}: ${repository}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error('[GIT-VALIDATION] ERROR:', {
      projectId,
      error: errorMessage,
    });

    sendAlert(AlertLevel.ERROR, 'Failed to validate Git connection', {
      projectId,
      projectName,
      teamId,
      error: errorMessage,
    });

    return {
      success: false,
      projectId,
      projectName,
      hasGitConnection: false,
      message: 'Failed to validate Git connection',
      error: errorMessage,
    };
  }
}

/**
 * Handles Git validation for project creation webhook events
 * 
 * This is a convenience wrapper specifically for use with Vercel webhook events.
 * It extracts the necessary information from the webhook payload and validates
 * the Git connection.
 * 
 * @param projectPayload - The project object from the webhook payload
 * @param teamId - Optional team ID
 * 
 * @returns Promise<GitValidationResult> - Result of the validation
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
  projectPayload: { id: string; name?: string; ownerId?: string },
  teamId?: string
): Promise<GitValidationResult> {
  if (!projectPayload || !projectPayload.id) {
    console.error('[GIT-VALIDATION] ERROR: Invalid project payload');
    return {
      success: false,
      projectId: 'unknown',
      projectName: projectPayload?.name,
      hasGitConnection: false,
      message: 'Invalid project payload',
      error: 'Project payload or project id is missing',
    };
  }

  return validateProjectGitConnection({
    projectId: projectPayload.id,
    projectName: projectPayload.name,
    teamId,
    ownerId: projectPayload.ownerId,
  });
}

