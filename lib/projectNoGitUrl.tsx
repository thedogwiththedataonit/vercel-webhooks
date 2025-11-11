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

  // Log to console with appropriate emoji
  const emoji = level === AlertLevel.ERROR ? '🚨' : level === AlertLevel.WARNING ? '⚠️' : 'ℹ️';
  console.log(`${emoji} [${level}] ${message}`, alert.metadata);

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
  console.log('🔍 [GIT-VALIDATION] Function called with config:', {
    projectId: config.projectId,
    projectName: config.projectName || 'none',
    teamId: config.teamId || 'none',
    ownerId: config.ownerId || 'none',
  });

  const { projectId, projectName, teamId, ownerId } = config;

  try {
    // Step 1: Validate environment variables
    console.log('📋 [GIT-VALIDATION] Step 1: Validating environment variables');
    if (!process.env.VERCEL_TOKEN) {
      console.error('❌ [GIT-VALIDATION] VERCEL_TOKEN not set');
      throw new Error('VERCEL_TOKEN environment variable is not set');
    }
    console.log('✅ [GIT-VALIDATION] VERCEL_TOKEN is set');

    // Step 2: Initialize Vercel SDK client
    console.log('📋 [GIT-VALIDATION] Step 2: Initializing Vercel SDK');
    let vercel: Vercel;
    try {
      vercel = new Vercel({
        bearerToken: process.env.VERCEL_TOKEN,
      });
      console.log('✅ [GIT-VALIDATION] Vercel SDK initialized');
    } catch (sdkError) {
      console.error('❌ [GIT-VALIDATION] Failed to initialize Vercel SDK:', sdkError);
      throw sdkError;
    }

    // Step 3: Fetch project details using getProjects with search
    console.log('📋 [GIT-VALIDATION] Step 3: Fetching project details from Vercel API');
    let projectsResponse;
    try {
      projectsResponse = await vercel.projects.getProjects({
        search: projectId,
        teamId,
        limit: '1',
      });
      console.log('✅ [GIT-VALIDATION] getProjects API call succeeded:', {
        projectsCount: projectsResponse.projects?.length || 0,
      });
    } catch (apiError) {
      console.error('❌ [GIT-VALIDATION] getProjects API call failed:', {
        error: apiError,
        message: apiError instanceof Error ? apiError.message : String(apiError),
        stack: apiError instanceof Error ? apiError.stack : undefined,
      });
      throw apiError;
    }

    // Step 4: Extract project from response
    console.log('📋 [GIT-VALIDATION] Step 4: Extracting project from response');
    const project = projectsResponse.projects?.[0];

    if (!project) {
      console.error('❌ [GIT-VALIDATION] Project not found in response');
      throw new Error(`Project with ID ${projectId} not found`);
    }
    console.log('✅ [GIT-VALIDATION] Project found:', {
      id: project.id,
      name: project.name,
      hasLink: !!project.link,
    });

    // Step 5: Check if project has a Git connection
    console.log('📋 [GIT-VALIDATION] Step 5: Checking Git connection');
    const hasGitConnection = Boolean(project.link?.type);
    const gitProvider = project.link?.type;
    console.log('📋 [GIT-VALIDATION] Git connection status:', {
      hasGitConnection,
      gitProvider: gitProvider || 'none',
    });
    
    // Get repository name - different providers use different property names
    let repository: string | undefined;
    if (project.link) {
      const link = project.link as any;
      repository = link.repo || link.name || link.projectName || link.slug;
      console.log('📋 [GIT-VALIDATION] Repository info:', { repository });
    }

    if (!hasGitConnection) {
      console.log('⚠️  [GIT-VALIDATION] No Git connection detected - sending alerts');
      
      // Log and alert for projects without Git connection
      const alertMessage = `Project created without Git repository connection`;
      const metadata = {
        projectId,
        projectName: projectName || project.name,
        ownerId: ownerId || project.accountId,
        teamId,
        action: 'PROJECT_NO_GIT_CONNECTION',
      };

      // Send warning alert
      sendAlert(AlertLevel.WARNING, alertMessage, metadata);

      // Log detailed compliance information
      console.warn('📋 [GIT-VALIDATION] Compliance Check Failed:', {
        check: 'Git Connection Required',
        recommendation: 'Connect a GitHub, GitLab, or Bitbucket repository',
        documentationUrl: 'https://vercel.com/docs/concepts/git',
        ...metadata,
      });

      return {
        success: true,
        projectId,
        projectName: projectName || project.name,
        hasGitConnection: false,
        message: 'Project does not have a Git repository connected',
      };
    }

    // Project has Git connection - log success
    console.log('✅ [GIT-VALIDATION] Git connection validated successfully:', {
      projectId,
      projectName: projectName || project.name,
      gitProvider,
      repository,
      timestamp: new Date().toISOString(),
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

    console.error('❌ [GIT-VALIDATION] FATAL ERROR:', {
      error: errorMessage,
      errorType: error?.constructor?.name,
      errorStack: error instanceof Error ? error.stack : undefined,
      projectId,
      projectName,
      teamId,
      timestamp: new Date().toISOString(),
    });

    // Send error alert for validation failures
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
  console.log('🔍 [GIT-VALIDATION] handleProjectCreatedEvent called:', {
    projectId: projectPayload?.id || 'missing',
    projectName: projectPayload?.name || 'missing',
    ownerId: projectPayload?.ownerId || 'none',
    teamId: teamId || 'none',
    hasPayload: !!projectPayload,
  });

  if (!projectPayload || !projectPayload.id) {
    console.error('❌ [GIT-VALIDATION] Invalid project payload - missing id');
    return {
      success: false,
      projectId: 'unknown',
      projectName: projectPayload?.name,
      hasGitConnection: false,
      message: 'Invalid project payload - missing id',
      error: 'Project payload or project id is missing',
    };
  }

  console.log('🔍 [GIT-VALIDATION] Validating Git connection for new project');

  try {
    const result = await validateProjectGitConnection({
      projectId: projectPayload.id,
      projectName: projectPayload.name,
      teamId,
      ownerId: projectPayload.ownerId,
    });
    console.log('✅ [GIT-VALIDATION] handleProjectCreatedEvent completed:', result);
    return result;
  } catch (error) {
    console.error('❌ [GIT-VALIDATION] handleProjectCreatedEvent error:', error);
    throw error;
  }
}

