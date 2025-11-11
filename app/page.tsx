import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold">Vercel Webhooks</h1>
            <Link
              href="/create-project"
              className="text-sm px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Create Test Project
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-24">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Automated Project Management<br />with Vercel Webhooks
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            A production-ready webhook handler that automatically enforces deployment protection 
            and validates Git connections when projects are created on Vercel.
          </p>
        </section>

        {/* Overview */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold mb-6">Overview</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            This application demonstrates three critical webhook use cases for managing Vercel projects. 
            Each use case listens for specific webhook events and automatically executes security and compliance operations using the Vercel SDK.
          </p>

          <div className="space-y-6">
            {/* Use Case 1 */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Project Created Without Git Repository</h3>
                      <code className="text-xs font-mono text-gray-500">project.created</code>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  When a project is created without a Git connection, the handler validates the project's 
                  Git status and logs an alert for compliance tracking.
                </p>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium mb-1">Actions Taken:</div>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-xs list-disc list-inside">
                      <li>Fetch project details using <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">vercel.projects.getProjects()</code></li>
                      <li>Check <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">project.link?.type</code> for Git connection</li>
                      <li>Log warning alert if no Git connection found</li>
                      <li>Send to monitoring system for compliance tracking</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium mb-1">Remediation Options:</div>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-xs list-disc list-inside">
                      <li><strong>Pause Project:</strong> Prevent deployments until Git is connected</li>
                      <li><strong>Notify Owner:</strong> Send email/Slack alert to project owner</li>
                      <li><strong>Schedule Deletion:</strong> Delete project after 48-72 hours if not resolved</li>
                      <li><strong>Lock Deployments:</strong> Require manual approval for all deployments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Auto-Enable Deployment Protection</h3>
                      <code className="text-xs font-mono text-gray-500">project.created</code>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  When any project is created (with or without Git), the handler automatically enables 
                  deployment protection to secure all deployments including production.
                </p>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium mb-1">Actions Taken:</div>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-xs list-disc list-inside">
                      <li>Initialize Vercel SDK with API token</li>
                      <li>Call <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">vercel.projects.updateProject()</code></li>
                      <li>Set <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">ssoProtection.deploymentType: 'all'</code></li>
                      <li>Require Vercel Authentication for all deployment access</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium mb-1">Benefits:</div>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-xs list-disc list-inside">
                      <li><strong>Security:</strong> Only authenticated team members can access deployments</li>
                      <li><strong>Compliance:</strong> Meets enterprise security requirements</li>
                      <li><strong>Control:</strong> Prevents unauthorized access to preview and production</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Git Connection Change Detection</h3>
                      <div className="flex gap-2 mt-1">
                        <code className="text-xs font-mono text-gray-500">project.removed</code>
                        <code className="text-xs font-mono text-gray-500">deployment.promoted</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Track when Git repositories are disconnected or connected to projects to maintain 
                  visibility and control over version control practices.
                </p>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium mb-1">Git Disconnected (<code className="text-xs bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">project.removed</code>):</div>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-xs list-disc list-inside">
                      <li>Detect when a project loses its Git connection</li>
                      <li>Log compliance violation for audit trail</li>
                      <li>Trigger alert to DevOps team</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium mb-1">Git Connected (<code className="text-xs bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">deployment.promoted</code>):</div>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-xs list-disc list-inside">
                      <li>Detect when Git is added or reconnected</li>
                      <li>Validate repository permissions and access</li>
                      <li>Update compliance status to resolved</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium mb-1">Remediation Options:</div>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-xs list-disc list-inside">
                      <li><strong>Re-enable Protection:</strong> If protection was disabled when Git was removed</li>
                      <li><strong>Audit Log:</strong> Record all Git connection changes</li>
                      <li><strong>Notification:</strong> Alert security team of connection status changes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Webhook Workflow */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold mb-6">Webhook Workflow</h2>
          
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-8 bg-gray-50 dark:bg-gray-900">
            <div className="font-mono text-xs space-y-3">
              {/* Trigger */}
              <div className="space-y-2">
                <div className="font-semibold">Trigger: Project Created</div>
                <div className="pl-4 text-gray-600 dark:text-gray-400">User creates project on Vercel (with or without Git)</div>
              </div>

              <div className="pl-4 text-gray-500">↓</div>

              {/* Webhook Event */}
              <div className="space-y-2">
                <div className="font-semibold">Vercel Platform</div>
                <div className="pl-4 space-y-1">
                  <div className="text-gray-600 dark:text-gray-400">Generates webhook event</div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <div className="text-gray-700 dark:text-gray-300">type: "project.created"</div>
                    <div className="text-gray-700 dark:text-gray-300">payload.project.id</div>
                    <div className="text-gray-700 dark:text-gray-300">payload.project.name</div>
                  </div>
                </div>
              </div>

              <div className="pl-4 text-gray-500">↓ HTTP POST</div>

              {/* Webhook Handler */}
              <div className="space-y-2">
                <div className="font-semibold">Webhook Handler (/api/webhooks)</div>
                <div className="pl-4 space-y-1 text-gray-600 dark:text-gray-400">
                  <div>1. Read request body (once)</div>
                  <div>2. Verify HMAC SHA-1 signature</div>
                  <div>3. Parse JSON payload</div>
                  <div>4. Validate required fields</div>
                </div>
              </div>

              <div className="pl-4 text-gray-500">↓</div>

              {/* Parallel Execution */}
              <div className="space-y-2">
                <div className="font-semibold">Parallel Handler Execution</div>
                <div className="pl-4 grid md:grid-cols-2 gap-4 mt-2">
                  {/* Left Handler */}
                  <div className="border border-gray-300 dark:border-gray-700 rounded p-3 bg-white dark:bg-black space-y-2">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">Deployment Protection</div>
                    <div className="space-y-1 text-gray-500">
                      <div>• Initialize Vercel SDK</div>
                      <div>• updateProject()</div>
                      <div>• Set ssoProtection: all</div>
                      <div className="text-green-600 dark:text-green-400">✓ Protection Enabled</div>
                    </div>
                  </div>

                  {/* Right Handler */}
                  <div className="border border-gray-300 dark:border-gray-700 rounded p-3 bg-white dark:bg-black space-y-2">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">Git Validation</div>
                    <div className="space-y-1 text-gray-500">
                      <div>• Initialize Vercel SDK</div>
                      <div>• getProjects()</div>
                      <div>• Check project.link?.type</div>
                      <div className="text-yellow-600 dark:text-yellow-400">⚠ Alert if no Git</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pl-4 text-gray-500">↓</div>

              {/* Decision Point */}
              <div className="space-y-2">
                <div className="font-semibold">Decision: Git Connection Status</div>
                <div className="pl-4 grid md:grid-cols-2 gap-4 mt-2">
                  {/* Has Git */}
                  <div className="border border-gray-300 dark:border-gray-700 rounded p-3 bg-white dark:bg-black">
                    <div className="font-semibold text-green-600 dark:text-green-400 mb-2">Has Git Connection</div>
                    <div className="space-y-1 text-gray-600 dark:text-gray-400 text-xs">
                      <div>✓ Log success</div>
                      <div>✓ Record Git provider</div>
                      <div>✓ Continue normal operation</div>
                    </div>
                  </div>

                  {/* No Git */}
                  <div className="border border-gray-300 dark:border-gray-700 rounded p-3 bg-white dark:bg-black">
                    <div className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">No Git Connection</div>
                    <div className="space-y-1 text-gray-600 dark:text-gray-400 text-xs">
                      <div>⚠ Log warning alert</div>
                      <div>⚠ Send to monitoring</div>
                      <div>⚠ Trigger remediation</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pl-4 text-gray-500">↓</div>

              {/* Response */}
              <div className="space-y-2">
                <div className="font-semibold">Return Response</div>
                <div className="pl-4 text-gray-600 dark:text-gray-400">HTTP 200 OK with event ID</div>
              </div>
            </div>
          </div>

          {/* Remediation Workflow */}
          <div className="mt-8 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Remediation Workflow for Projects Without Git</h3>
            <div className="font-mono text-xs space-y-3">
              <div className="space-y-2">
                <div className="font-semibold">Immediate Actions</div>
                <div className="pl-4 space-y-1 text-gray-600 dark:text-gray-400">
                  <div>1. Log alert to monitoring system (Datadog, Sentry, etc.)</div>
                  <div>2. Send notification to project owner via email/Slack</div>
                  <div>3. Create audit trail entry with timestamp</div>
                </div>
              </div>

              <div className="pl-4 text-gray-500">↓ If not resolved within timeframe</div>

              <div className="space-y-2">
                <div className="font-semibold">Escalation Options</div>
                <div className="pl-4 grid md:grid-cols-3 gap-3 mt-2">
                  <div className="border border-gray-300 dark:border-gray-700 rounded p-3 bg-white dark:bg-black">
                    <div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Option A: Pause</div>
                    <div className="text-gray-500 text-xs">
                      Set project.paused = true
                      <br />Prevent new deployments
                    </div>
                  </div>

                  <div className="border border-gray-300 dark:border-gray-700 rounded p-3 bg-white dark:bg-black">
                    <div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Option B: Lock</div>
                    <div className="text-gray-500 text-xs">
                      Require manual approval
                      <br />All deployments gated
                    </div>
                  </div>

                  <div className="border border-gray-300 dark:border-gray-700 rounded p-3 bg-white dark:bg-black">
                    <div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Option C: Delete</div>
                    <div className="text-gray-500 text-xs">
                      Schedule deletion
                      <br />After 48-72 hours
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Webhook Events */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold mb-6">Webhook Events Handled</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This application actively handles three webhook events to manage project security and compliance:
          </p>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {/* project.created */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono">project.created</code>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Triggered when a new project is created (with or without Git connection).
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  <strong>Handlers:</strong> Deployment Protection + Git Validation
                </div>
              </div>

              {/* project.removed */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono">project.removed</code>
                  <span className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    Monitoring
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Triggered when a Git connection is disconnected from a project.
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  <strong>Use Case:</strong> Track compliance violations when Git is removed
                </div>
              </div>

              {/* deployment.promoted */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono">deployment.promoted</code>
                  <span className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    Monitoring
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Triggered when a Git connection is added or reconnected to a project.
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  <strong>Use Case:</strong> Resolve compliance status when Git is connected
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="font-mono text-xs text-gray-600 dark:text-gray-400">Type System (50+ events)</div>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Full TypeScript types are available for all Vercel webhook events:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono mb-4">
                <div className="text-gray-500">deployment.*</div>
                <div className="text-gray-500">domain.*</div>
                <div className="text-gray-500">project.*</div>
                <div className="text-gray-500">integration.*</div>
                <div className="text-gray-500">marketplace.*</div>
                <div className="text-gray-500">observability.*</div>
              </div>
              <Link
                href="/types"
                className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
              >
                View Complete Type Documentation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Implementation Examples */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold mb-6">Implementation Examples</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Code examples showing how to handle each webhook event using the Vercel SDK:
          </p>

          <div className="space-y-6">
            {/* Event 1: project.created */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400">Handling project.created</div>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200">{`if (event.type === 'project.created') {
  const { project, teamId } = event.payload;
  
  // Initialize Vercel SDK
  const vercel = new Vercel({
    bearerToken: process.env.VERCEL_TOKEN,
  });
  
  // Enable deployment protection
  await vercel.projects.updateProject({
    idOrName: project.id,
    teamId,
    requestBody: {
      ssoProtection: {
        deploymentType: 'all', // Protect all deployments
      },
    },
  });
  
  // Validate Git connection
  const projectDetails = await vercel.projects.getProjects({
    search: project.id,
    teamId,
    limit: '1',
  });
  
  const hasGit = Boolean(projectDetails.projects?.[0]?.link?.type);
  
  if (!hasGit) {
    // Log alert for compliance tracking
    console.warn('[COMPLIANCE] Project created without Git:', {
      projectId: project.id,
      projectName: project.name,
      action: 'ALERT_NO_GIT',
    });
    
    // Trigger remediation options:
    // - Pause project
    // - Notify owner
    // - Schedule deletion
  }
}`}</code>
                </pre>
              </div>
            </div>

            {/* Event 2: project.removed */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400">Handling project.removed (Git Disconnected)</div>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200">{`if (event.type === 'project.removed') {
  const { project, teamId } = event.payload;
  
  // Log Git disconnection
  console.warn('[COMPLIANCE] Git connection removed:', {
    projectId: project.id,
    projectName: project.name,
    action: 'GIT_DISCONNECTED',
    timestamp: new Date().toISOString(),
  });
  
  // Trigger alerts
  await sendAlert({
    level: 'WARNING',
    message: 'Project lost Git connection',
    metadata: { projectId: project.id },
  });
  
  // Optional: Increase deployment protection
  // Optional: Pause project until Git is reconnected
}`}</code>
                </pre>
              </div>
            </div>

            {/* Event 3: deployment.promoted */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400">Handling deployment.promoted (Git Connected)</div>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200">{`if (event.type === 'deployment.promoted') {
  const { project, teamId, deployment } = event.payload;
  
  // Validate Git connection was added
  const vercel = new Vercel({
    bearerToken: process.env.VERCEL_TOKEN,
  });
  
  const projectDetails = await vercel.projects.getProjects({
    search: project.id,
    teamId,
    limit: '1',
  });
  
  const gitProvider = projectDetails.projects?.[0]?.link?.type;
  
  if (gitProvider) {
    // Log successful Git connection
    console.log('[COMPLIANCE] Git connection added:', {
      projectId: project.id,
      gitProvider,
      status: 'RESOLVED',
    });
    
    // Update compliance records
    // Clear any pending alerts
  }
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold mb-6">Security</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Signature Verification</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All webhook requests are verified using HMAC SHA-1 signatures with the <code className="text-xs bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">x-vercel-signature</code> header.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Environment Variables</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  API tokens and secrets are stored securely in environment variables and never exposed to the client.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Type Safety</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full TypeScript types ensure type-safe webhook handling and prevent runtime errors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold mb-6">Technical Details</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">Framework</div>
              <div className="font-semibold">Next.js 15</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">App Router</div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">Runtime</div>
              <div className="font-semibold">Node.js</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Edge Compatible</div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">Language</div>
              <div className="font-semibold">TypeScript</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Strict Mode</div>
            </div>
          </div>

          <div className="mt-6 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Key Dependencies</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">@vercel/sdk</span>
                <code className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">^1.11.0</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">next</span>
                <code className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">15.1.0</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">react</span>
                <code className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">19.0.0</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">typescript</span>
                <code className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">^5</code>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-gray-200 dark:border-gray-800 pt-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Try It Out</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Create a test project without a Git connection to see both webhook handlers in action. 
              You'll see deployment protection enabled and Git validation alerts in your logs.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/create-project"
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
              >
                Create Test Project
              </Link>
              <a
                href="https://github.com/thedogwiththedataonit/vercel-webhooks"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-24">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Built with <span className="font-semibold">Vercel SDK</span> and <span className="font-semibold">Next.js</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                href="/types"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Event Types
              </Link>
              <a
                href="https://vercel.com/docs/webhooks/webhooks-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Webhook Docs
              </a>
              <a
                href="https://vercel.com/docs/rest-api/reference/sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                SDK Docs
              </a>
              <a
                href="https://vercel.com/docs/rest-api/reference/endpoints/access-groups/reads-an-access-group"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                SDK Reference
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
