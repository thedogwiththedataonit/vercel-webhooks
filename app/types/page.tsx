import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webhook Event Types - Vercel Webhooks",
  description: "Complete TypeScript type definitions for 50+ Vercel webhook events including deployment, domain, project, integration, marketplace, and observability events.",
  openGraph: {
    title: "Webhook Event Types - Vercel Webhooks",
    description: "Complete TypeScript type definitions for 50+ Vercel webhook events.",
  },
  twitter: {
    title: "Webhook Event Types - Vercel Webhooks",
    description: "Complete TypeScript type definitions for 50+ Vercel webhook events.",
  },
};

export default function TypesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold hover:opacity-70 transition-opacity">
              ← Vercel Webhooks
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Webhook Event Types
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Complete TypeScript type definitions for all Vercel webhook events. 
            This application includes type-safe handling for 50+ webhook event types.
          </p>
        </section>

        {/* Base Webhook Structure */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Base Webhook Structure</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            All webhook events share a common structure with a typed payload based on the event type:
          </p>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400">VercelWebhookPayload&lt;T&gt;</div>
            </div>
            <div className="p-4">
              <pre className="text-sm overflow-x-auto">
                <code className="text-gray-800 dark:text-gray-200">{`interface VercelWebhookPayload<T = any> {
  id: string;           // Unique webhook delivery ID
  type: string;         // Event type (e.g., "project.created")
  createdAt: number;    // Unix timestamp (milliseconds)
  payload: T;           // Type-specific payload
  region?: string;      // Region where event occurred
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Event Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Event Categories</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Deployment Events */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Deployment Events</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                11 events related to deployment lifecycle
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-gray-500">deployment.canceled</div>
                <div className="text-gray-500">deployment.check-rerequested</div>
                <div className="text-gray-500">deployment.cleanup</div>
                <div className="text-gray-500">deployment.created</div>
                <div className="text-gray-500">deployment.error</div>
                <div className="text-gray-500">deployment.promoted</div>
                <div className="text-gray-500">deployment.ready</div>
                <div className="text-gray-500">deployment.succeeded</div>
                <div className="text-gray-500">deployment.integration.action.*</div>
              </div>
            </div>

            {/* Domain Events */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Domain Events</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                12 events for domain management
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-gray-500">domain.created</div>
                <div className="text-gray-500">domain.auto-renew-changed</div>
                <div className="text-gray-500">domain.certificate-add</div>
                <div className="text-gray-500">domain.certificate-add-failed</div>
                <div className="text-gray-500">domain.certificate-deleted</div>
                <div className="text-gray-500">domain.certificate-renew</div>
                <div className="text-gray-500">domain.renewal</div>
                <div className="text-gray-500">domain.renewal-failed</div>
                <div className="text-gray-500">domain.transfer-in-*</div>
              </div>
            </div>

            {/* Project Events */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Project Events</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                11 events for project lifecycle
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-gray-500">project.created</div>
                <div className="text-gray-500">project.removed</div>
                <div className="text-gray-500">project.domain-created</div>
                <div className="text-gray-500">project.domain-deleted</div>
                <div className="text-gray-500">project.domain-moved</div>
                <div className="text-gray-500">project.domain-verified</div>
                <div className="text-gray-500">project.rolling-release.*</div>
              </div>
            </div>

            {/* Integration Events */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Integration Events</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                5 events for integration management
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-gray-500">integration-configuration.*</div>
                <div className="text-gray-500">integration-resource.*</div>
              </div>
            </div>

            {/* Marketplace Events */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Marketplace Events</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                5 events for marketplace billing
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-gray-500">marketplace.invoice.created</div>
                <div className="text-gray-500">marketplace.invoice.paid</div>
                <div className="text-gray-500">marketplace.invoice.notpaid</div>
                <div className="text-gray-500">marketplace.invoice.refunded</div>
                <div className="text-gray-500">marketplace.member.changed</div>
              </div>
            </div>

            {/* Observability Events */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Observability Events</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                2 events for monitoring alerts
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-gray-500">observability.usage-anomaly</div>
                <div className="text-gray-500">observability.error-anomaly</div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Payload Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Common Payload Types</h2>
          
          <div className="space-y-6">
            {/* Project Created */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">project.created</code>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                    Active
                  </span>
                </div>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto mb-4">
                  <code className="text-gray-800 dark:text-gray-200">{`interface ProjectCreatedPayload {
  team?: {
    id: string | null;
  };
  teamId?: string;
  user: {
    id: string;
  };
  project: {
    id: string;
    name: string;
    ownerId?: string;
    accountId?: string;
  };
}`}</code>
                </pre>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Triggered when a new project is created on Vercel.
                </p>
              </div>
            </div>

            {/* Deployment Created */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <code className="text-sm font-mono">deployment.created</code>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto mb-4">
                  <code className="text-gray-800 dark:text-gray-200">{`interface DeploymentCreatedPayload {
  team: { id: string | null };
  user: { id: string };
  alias: string[];
  deployment: {
    id: string;
    meta?: Record<string, any>;
    url?: string;
    name?: string;
    alias?: string[];
    target?: 'production' | 'staging' | null;
    regions?: string[];
  };
  links: {
    deployment?: string;
    project?: string;
  };
  target?: 'production' | 'staging' | null;
  project: { id: string };
  plan: string;
  regions: string[];
}`}</code>
                </pre>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Triggered when a new deployment is created.
                </p>
              </div>
            </div>

            {/* Deployment Succeeded */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <code className="text-sm font-mono">deployment.succeeded</code>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto mb-4">
                  <code className="text-gray-800 dark:text-gray-200">{`interface DeploymentSucceededPayload {
  team: { id: string | null };
  user: { id: string };
  deployment: {
    id: string;
    meta?: Record<string, any>;
    url?: string;
    name?: string;
  };
  links: {
    deployment?: string;
    project?: string;
  };
  target?: 'production' | 'staging' | null;
  project: { id: string };
  plan: string;
  regions: string[];
}`}</code>
                </pre>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Triggered when a deployment completes successfully and passes all checks.
                </p>
              </div>
            </div>

            {/* Domain Created */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <code className="text-sm font-mono">domain.created</code>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto mb-4">
                  <code className="text-gray-800 dark:text-gray-200">{`interface DomainCreatedPayload {
  team: { id: string | null };
  user: { id: string };
  domain: {
    name: string;
    delegated?: boolean;
  };
}`}</code>
                </pre>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Triggered when a domain is created.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Type-Safe Usage */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Type-Safe Usage</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The type system ensures compile-time safety when handling webhooks:
          </p>

          <div className="space-y-6">
            {/* Type Union */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400">Event Type Union</div>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200">{`type WebhookEventType =
  | 'deployment.canceled'
  | 'deployment.created'
  | 'deployment.succeeded'
  | 'project.created'
  | 'project.removed'
  | 'domain.created'
  // ... 50+ total event types`}</code>
                </pre>
              </div>
            </div>

            {/* Payload Map */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400">Payload Mapping</div>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200">{`type WebhookPayloadMap = {
  'project.created': ProjectCreatedPayload;
  'deployment.created': DeploymentCreatedPayload;
  'deployment.succeeded': DeploymentSucceededPayload;
  'domain.created': DomainCreatedPayload;
  // ... mappings for all event types
};`}</code>
                </pre>
              </div>
            </div>

            {/* Type Helper */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400">Type-Safe Helper</div>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200">{`type TypedWebhookEvent<T extends WebhookEventType> = 
  VercelWebhookPayload<WebhookPayloadMap[T]> & {
    type: T;
  };

// Usage: TypeScript knows the exact payload structure
function handleProjectCreated(
  event: TypedWebhookEvent<'project.created'>
) {
  console.log(event.payload.project.id);    // ✓ Type-safe
  console.log(event.payload.project.name);  // ✓ Type-safe
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Implementation Example</h2>
          
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400">app/api/webhooks/route.ts</div>
            </div>
            <div className="p-4">
              <pre className="text-sm overflow-x-auto">
                <code className="text-gray-800 dark:text-gray-200">{`import { VercelWebhookPayload, ProjectCreatedPayload } from './types';

export async function POST(request: Request) {
  // Read body once for signature and parsing
  const bodyText = await request.text();
  
  // Verify signature
  if (!verifySignature(bodyText, signature)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const body: VercelWebhookPayload = JSON.parse(bodyText);

  // Type narrowing with switch statement
  switch (body.type) {
    case 'project.created': {
      const payload = body.payload as ProjectCreatedPayload;
      await handleProjectCreated(payload);
      break;
    }
    
    case 'deployment.succeeded': {
      const payload = body.payload as DeploymentSucceededPayload;
      await handleDeploymentSucceeded(payload);
      break;
    }
    
    default:
      console.log(\`Unhandled event: \${body.type}\`);
  }

  return Response.json({ received: true });
}`}</code>
              </pre>
            </div>
          </div>

          <div className="mt-6 border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-sm font-semibold mb-2">Best Practices</h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>Read request body once to avoid "unusable" errors</li>
              <li>Use direct REST API (<code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">GET /v9/projects/{'{id}'}</code>) for immediate project availability</li>
              <li>Verify signatures before processing any payload</li>
              <li>Use type narrowing for type-safe payload access</li>
              <li>Log concisely at key decision points</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <section className="border-t border-gray-200 dark:border-gray-800 pt-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Complete Type Definitions</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              All 50+ webhook event types are fully documented with TypeScript interfaces in the codebase.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Documentation
              </Link>
              <a
                href="https://vercel.com/docs/observability/webhooks-overview/webhooks-api"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium"
              >
                Vercel API Docs
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
              Type definitions powered by <span className="font-semibold">TypeScript</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/create-project"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Create Project
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

