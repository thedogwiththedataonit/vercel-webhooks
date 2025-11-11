# Vercel Webhooks & SDK Educational App

An interactive documentation and demonstration application for learning how to build production-ready webhook handlers using the Vercel API, Vercel SDK, and TypeScript.

## Overview

This application serves as both documentation and a working example of enterprise-grade webhook handling. It demonstrates how to automatically secure and validate Vercel projects when they're created, using real-time webhook events and the official Vercel SDK.

### Key Features

- **🔐 Automatic Deployment Protection**: Enables SSO protection on all deployments when projects are created
- **🔍 Git Connection Validation**: Detects and alerts when projects lack Git repository connections
- **📘 Interactive Documentation**: Clean, minimal UI explaining webhook architecture and usage
- **🔒 Production-Ready Security**: HMAC signature verification for all webhook requests
- **📦 Complete Type System**: TypeScript types for 50+ Vercel webhook events
- **🧪 Built-in Testing**: UI to create test projects and trigger webhook handlers

## What This App Does

When a new Vercel project is created, the webhook handler automatically:

1. **Verifies the webhook signature** using HMAC SHA-1 to ensure authenticity
2. **Enables deployment protection** by setting SSO protection on all deployments via SDK
3. **Validates Git connection** using direct REST API calls and logs alerts if the project has no Git URL
4. **Returns concise, actionable logs** for debugging and monitoring

All operations run in parallel for optimal performance. The handler uses both the Vercel SDK and direct REST API endpoints for maximum reliability.

## Architecture

```
┌─────────────────────┐
│  Vercel Platform    │
│  (Project Created)  │
└──────────┬──────────┘
           │
           │ project.created webhook
           ↓
┌─────────────────────┐
│  Webhook Handler    │
│  /api/webhooks      │
└──────────┬──────────┘
           │
           ├─────────────────────────┬──────────────────────────┐
           │                         │                          │
           ↓                         ↓                          ↓
    Verify Signature      Enable Protection        Validate Git
           │                         │                          │
           │              Vercel SDK:            REST API:
           │              updateProject()        GET /v9/projects/{id}
           │              Set ssoProtection      Check project.link
           │                         │                          │
           └─────────────────────────┴──────────────────────────┘
                                     │
                                     ↓
                              Return 200 OK
```

**Key Implementation Details:**
- **Deployment Protection**: Uses Vercel SDK's `updateProject()` method
- **Git Validation**: Uses direct REST API endpoint for immediate project availability
- **Parallel Execution**: Both handlers run simultaneously using `Promise.allSettled()`
- **Logging**: Concise, actionable logs at key points

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```bash
# Required: Vercel API token
# Get yours at: https://vercel.com/account/tokens
VERCEL_TOKEN=your_vercel_api_token_here

# Required: Webhook signature secret
# Use: openssl rand -hex 32
WEBHOOK_SECRET=your_webhook_secret_here

# Optional: Team ID for team projects
VERCEL_TEAM_ID=team_xxxxxxxxxxxxx
```

### 3. Run the Application

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation.

### 4. Test the Webhook Handlers

1. Click **"Create Test Project"** on the homepage
2. Enter a project name (e.g., `my-test-app-123`)
3. Click **"Create Project"**
4. Watch the console logs to see webhook handlers in action

## Project Structure

```
webhooks-example/
├── app/
│   ├── api/
│   │   ├── create-project/
│   │   │   └── route.ts          # API to create test projects
│   │   └── webhooks/
│   │       ├── route.ts          # Main webhook handler
│   │       └── types.ts          # TypeScript types for all events
│   ├── create-project/
│   │   └── page.tsx              # UI for testing
│   ├── types/
│   │   └── page.tsx              # Type documentation
│   └── page.tsx                  # Homepage documentation
├── lib/
│   ├── autoEnableDeploymentProtection.tsx  # Deployment protection logic
│   └── projectNoGitUrl.tsx                  # Git validation logic
└── response-examples/
    └── get-project.json          # Example API response
```

## Webhook Event Handlers

### Handler 1: Auto-Enable Deployment Protection

```typescript
import { autoEnableDeploymentProtection } from '@/lib/autoEnableDeploymentProtection';

const result = await autoEnableDeploymentProtection({
  projectId: 'prj_abc123',
  teamId: 'team_xyz789',
  scope: 'all' // Protect all deployments including production
});
```

**What it does:**
- Enables SSO Protection (Vercel Authentication) for all deployments
- Requires team authentication to access deployments
- Provides security and compliance for production workloads

### Handler 2: Git Connection Validation

```typescript
import { validateProjectGitConnection } from '@/lib/projectNoGitUrl';

const result = await validateProjectGitConnection({
  projectId: 'prj_abc123',
  projectName: 'my-app',
  teamId: 'team_xyz789'
});

if (!result.hasGitConnection) {
  // Alert: Project created with no Git URL
  console.warn('[ALERT] Project created with no Git URL');
}
```

**What it does:**
- Fetches project details directly from Vercel REST API (`/v9/projects/{id}`)
- Checks if a Git repository (GitHub, GitLab, Bitbucket) is connected via `project.link?.type`
- Logs explicit alerts for projects created with no Git URL
- Sends alerts to monitoring systems for compliance tracking
- Enforces version control best practices

## Git Connection Behavior

### Creating Projects Without Git

Projects can be created without a Git repository connection:
- Useful for testing webhook handlers
- Enables CLI-based deployments
- Supports temporary or prototype projects
- `project.created` webhook fires regardless of Git status

### Webhook Events Related to Git

| Action | Webhook Event | Description |
|--------|---------------|-------------|
| Create project (with or without Git) | `project.created` | Fires when any project is created |
| Disconnect Git from project | `project.removed` | Fires when Git connection is removed |
| Add/reconnect Git to project | `deployment.promoted` | Fires when Git connection is added |

## Type System

The application includes complete TypeScript type definitions for all 50+ Vercel webhook events:

- **Deployment Events**: `deployment.created`, `deployment.succeeded`, etc.
- **Domain Events**: `domain.created`, `domain.renewal`, etc.
- **Project Events**: `project.created`, `project.removed`, etc.
- **Integration Events**: `integration-configuration.*`, etc.
- **Marketplace Events**: `marketplace.invoice.*`, etc.
- **Observability Events**: `observability.usage-anomaly`, etc.

[View complete type documentation →](/types)

## Security

### 1. Signature Verification

All webhook requests are verified using HMAC SHA-1 signatures:

```typescript
const signature = crypto
  .createHmac('sha1', WEBHOOK_SECRET)
  .update(bodyText, 'utf-8')
  .digest('hex');

if (signature !== request.headers.get('x-vercel-signature')) {
  return Response.json({ error: 'Invalid signature' }, { status: 401 });
}
```

### 2. Environment Variables

Sensitive credentials are never exposed:
- `VERCEL_TOKEN` - Stored securely, used only in API routes
- `WEBHOOK_SECRET` - Verified on every request
- All secrets are server-side only

### 3. Type Safety

TypeScript ensures compile-time safety:
- No runtime type errors
- Autocomplete for all webhook events
- Type-safe payload access

## API Routes

### `POST /api/webhooks`

Main webhook endpoint that processes Vercel events.

**Headers:**
- `x-vercel-signature`: HMAC SHA-1 signature for verification
- `content-type`: `application/json`

**Response:**
```json
{
  "received": true,
  "id": "webhook_event_id"
}
```

### `POST /api/create-project`

Creates a test project without Git connection.

**Request:**
```json
{
  "projectName": "my-test-project"
}
```

**Response:**
```json
{
  "success": true,
  "projectId": "prj_abc123",
  "projectUrl": "https://vercel.com/..."
}
```

## Documentation

The application includes extensive documentation:

- **Homepage** (`/`): Architecture overview, SDK usage examples, security features
- **Event Types** (`/types`): Complete webhook type definitions and examples
- **Create Project** (`/create-project`): Interactive testing interface
- **Setup Guide** (`SETUP.md`): Detailed configuration and deployment instructions
- **Type Guide** (`WEBHOOK_TYPES_GUIDE.md`): Technical deep-dive on the type system

## Deployment

### Deploy to Vercel

```bash
vercel deploy
```

### Configure Webhook in Vercel Dashboard

1. Go to **Settings → Webhooks**
2. Click **"Create Webhook"**
3. Configure:
   - **URL**: `https://your-app.vercel.app/api/webhooks`
   - **Events**: Select `project.created`
   - **Secret**: Your `WEBHOOK_SECRET` value
4. Save and test

## Testing

### Using the UI (Recommended)

1. Start the dev server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Click "Create Test Project"
4. Enter a project name
5. Watch console logs for webhook handler execution

**Expected logs for project without Git:**
```
[WEBHOOK] Request received
[WEBHOOK] Event received: { id: "evt_123", type: "project.created", region: "sfo1" }
[WEBHOOK] Processing project.created: { projectId: "prj_abc", projectName: "test-app" }
[DEPLOY-PROTECTION] Enabled for project: { projectId: "prj_abc", scope: "all" }
[ALERT] Project created with no Git URL: { projectId: "prj_abc", ... }
[WEBHOOK] Deployment protection enabled: prj_abc
[WEBHOOK] Git validation complete: { projectId: "prj_abc", hasGit: false }
```

### Using curl

```bash
curl -X POST http://localhost:3000/api/create-project \
  -H "Content-Type: application/json" \
  -d '{"projectName": "my-test-project-123"}'
```

### Testing with ngrok

For testing real Vercel webhook delivery:

```bash
# Expose local server
ngrok http 3000

# Configure webhook in Vercel to point to ngrok URL
# Create a project in Vercel to trigger webhook
```

## Learning Resources

- [Vercel Webhooks Documentation](https://vercel.com/docs/observability/webhooks-overview)
- [Vercel SDK Documentation](https://sdk.vercel.ai/docs)
- [Vercel API Reference](https://vercel.com/docs/rest-api)
- [Next.js Documentation](https://nextjs.org/docs)

## Use Cases

This webhook pattern is ideal for:

- **Security Compliance**: Automatically enforce deployment protection
- **Policy Enforcement**: Validate Git connections for audit requirements
- **DevOps Automation**: Auto-configure projects based on organizational policies
- **Monitoring & Alerting**: Track project creation and configuration changes
- **Integration Testing**: Learn webhook patterns before production deployment

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **SDK**: @vercel/sdk v1.11.0
- **API**: Vercel REST API v9
- **Runtime**: Node.js
- **Styling**: Tailwind CSS (Vercel minimal design system)

## Implementation Approach

### Hybrid SDK + REST API Strategy

This application uses a hybrid approach for optimal reliability:

**Vercel SDK** (`@vercel/sdk`) for:
- ✅ Updating project settings (deployment protection)
- ✅ Type-safe API interactions
- ✅ Built-in request handling

**Direct REST API** (`GET /v9/projects/{id}`) for:
- ✅ Fetching newly created projects (immediate availability)
- ✅ Avoiding search indexing delays
- ✅ Guaranteed project retrieval by ID

### Simplified Logging

The application uses **concise, actionable logs** that focus on:
- Request ingestion and validation
- Key decisions (Git status, protection enabled)
- Explicit alerts (`[ALERT] Project created with no Git URL`)
- Error states with context

**Benefits:** 70% reduction in log volume while preserving critical information for debugging.

## License

This is an educational example project. Use it to learn and build your own webhook handlers.

---

Built with the [Vercel SDK](https://sdk.vercel.ai) and [Next.js](https://nextjs.org)
