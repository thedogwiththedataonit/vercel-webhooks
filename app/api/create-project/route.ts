import { NextRequest, NextResponse } from 'next/server';
import { Vercel } from '@vercel/sdk';

/**
 * API route to create a Vercel project without Git connection
 * 
 * This is useful for testing webhook handlers that detect missing Git connections
 * and automatically enable deployment protection.
 */
export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.VERCEL_TOKEN) {
      return NextResponse.json(
        { error: 'VERCEL_TOKEN environment variable is not set' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { projectName } = body;

    // Validate project name
    if (!projectName || typeof projectName !== 'string') {
      return NextResponse.json(
        { error: 'Project name is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedName = projectName.trim();
    
    if (trimmedName.length === 0) {
      return NextResponse.json(
        { error: 'Project name cannot be empty' },
        { status: 400 }
      );
    }

    // Validate project name format (Vercel requirements)
    const validNamePattern = /^[a-z0-9-]+$/;
    if (!validNamePattern.test(trimmedName)) {
      return NextResponse.json(
        { 
          error: 'Project name must contain only lowercase letters, numbers, and hyphens',
          hint: 'Example: my-awesome-project'
        },
        { status: 400 }
      );
    }

    // Initialize Vercel SDK client
    const vercel = new Vercel({
      bearerToken: process.env.VERCEL_TOKEN,
    });

    // Get teamId from environment if available
    const teamId = process.env.VERCEL_TEAM_ID;

    console.log('🚀 Creating Vercel project:', {
      projectName: trimmedName,
      teamId: teamId || 'personal account',
      gitConnection: false,
    });

    // Create project without Git connection
    // By not providing a 'gitRepository' parameter, the project is created without Git
    const project = await vercel.projects.createProject({
      requestBody: {
        name: trimmedName,
        // Framework preset (optional, can be auto-detected)
        framework: 'nextjs',
        // Build settings
        buildCommand: 'pnpm run build',
        devCommand: 'pnpm run dev',
        installCommand: 'pnpm install',
        outputDirectory: '.next',
        // Root directory (optional)
        rootDirectory: undefined,
        // Environment variables (optional)
        environmentVariables: [],
        // Explicitly not setting gitRepository to create without Git
      },
      teamId,
    });

    // Construct project URL
    const projectUrl = teamId
      ? `https://vercel.com/${teamId}/${project.name}`
      : `https://vercel.com/dashboard/projects/${project.id}`;

    console.log('✅ Project created successfully:', {
      projectId: project.id,
      projectName: project.name,
      projectUrl,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: `Project "${project.name}" created successfully without Git connection`,
        projectId: project.id,
        projectName: project.name,
        projectUrl,
        webhookInfo: {
          message: 'Webhook handlers should be triggered automatically',
          handlers: [
            'Auto-enable deployment protection',
            'Validate Git connection (will alert for missing Git)',
          ],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Failed to create project:', error);

    // Handle specific Vercel API errors
    if (error instanceof Error) {
      // Check for common Vercel API errors
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('already exists')) {
        return NextResponse.json(
          { 
            error: 'A project with this name already exists',
            hint: 'Try a different project name'
          },
          { status: 409 }
        );
      }
      
      if (errorMessage.includes('unauthorized') || errorMessage.includes('forbidden')) {
        return NextResponse.json(
          { 
            error: 'Authentication failed',
            hint: 'Check that your VERCEL_TOKEN has the correct permissions'
          },
          { status: 403 }
        );
      }
      
      if (errorMessage.includes('rate limit')) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            hint: 'Please wait a few moments before trying again'
          },
          { status: 429 }
        );
      }

      // Generic error with message
      return NextResponse.json(
        { 
          error: 'Failed to create project',
          details: error.message
        },
        { status: 500 }
      );
    }

    // Unknown error
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Optional: Add GET handler to describe the endpoint
export async function GET() {
  return NextResponse.json(
    {
      endpoint: '/api/create-project',
      method: 'POST',
      description: 'Create a Vercel project without Git connection for testing',
      requiredBody: {
        projectName: 'string (lowercase letters, numbers, and hyphens only)',
      },
      example: {
        projectName: 'my-test-project',
      },
      requiredEnv: [
        'VERCEL_TOKEN',
        'VERCEL_TEAM_ID (optional)',
      ],
    },
    { status: 200 }
  );
}

