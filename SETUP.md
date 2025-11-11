# Vercel Webhook Project Setup Guide

This project implements automated Vercel webhook handlers for project creation events, with two main features:
1. **Auto-Enable Deployment Protection** - Automatically enables deployment protection on all new projects
2. **Git Connection Validation** - Validates that new projects have a Git repository connected and alerts if they don't

## Features

### 1. Auto-Enable Deployment Protection (`lib/autoEnableDeploymentProtection.tsx`)

When a new project is created on Vercel, this handler automatically:
- Enables SSO Protection (Vercel Authentication) for all deployments (including production)
- Requires visitors to be logged into Vercel with minimum Viewer access on your team
- Logs the action for audit purposes
- Returns detailed success/failure information

**Benefits:**
- Enhanced security and control over deployments
- Prevents unauthorized access to deployments
- Ensures compliance with team authentication requirements
- Works seamlessly with Vercel's built-in authentication

### 2. Git Connection Validation (`lib/projectNoGitUrl.tsx`)

When a new project is created, this handler:
- Fetches the full project details from Vercel
- Checks if a Git repository (GitHub, GitLab, or Bitbucket) is connected
- Logs a warning if no Git connection is found
- Sends alerts to your monitoring system
- Provides detailed compliance information

**Benefits:**
- Enforces Git-based deployment workflows
- Ensures version control best practices
- Provides audit trail for compliance
- Enables integration with alerting systems

## Installation

### 1. Install Dependencies

```bash
pnpm install
```

This will install all required dependencies including:
- `@vercel/sdk` - Official Vercel SDK for API interactions
- Next.js and React for the web framework
- TypeScript for type safety

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required: Secret for verifying webhook signatures
WEBHOOK_SECRET=your_webhook_secret_here

# Required: API token for making API calls to Vercel
# Generate at: https://vercel.com/account/tokens
VERCEL_TOKEN=your_vercel_api_token_here

# Optional: Team ID for team projects
VERCEL_TEAM_ID=team_xxxxxxxxxxxxx
```

#### Getting Your Vercel Token:
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a descriptive name (e.g., "Webhook Handler")
4. Select appropriate scope (needs project read/write permissions)
5. Copy the token and add it to your `.env.local` file

#### Setting Up Webhook Secret:
1. Generate a secure random string (e.g., using `openssl rand -hex 32`)
2. Add it to your `.env.local` file as `WEBHOOK_SECRET`
3. Use this same secret when configuring the webhook in Vercel

### 3. Deploy to Vercel

```bash
vercel deploy
```

After deployment, you'll get a URL like: `https://your-app.vercel.app`

### 4. Configure Webhook in Vercel Dashboard

1. Go to your Vercel dashboard
2. Navigate to Settings → Webhooks
3. Click "Create Webhook"
4. Configure:
   - **URL**: `https://your-app.vercel.app/api/webhooks`
   - **Events**: Select "project.created"
   - **Secret**: Enter the same value you used for `WEBHOOK_SECRET`
5. Save the webhook

## API Routes

### POST `/api/webhooks`

Main webhook endpoint that receives and processes Vercel webhook events.

**Features:**
- Signature verification for security
- Handles `project.created` events
- Runs deployment protection and Git validation in parallel
- Comprehensive error handling and logging

**Request Headers:**
- `x-vercel-signature`: SHA-1 HMAC signature for verification

**Response:**
```json
{
  "received": true,
  "id": "webhook_event_id"
}
```

### GET `/api/webhooks`

Health check endpoint to verify the webhook is active.

**Response:**
```json
{
  "message": "Webhook endpoint is active"
}
```

### POST `/api/create-project`

Creates a new Vercel project without a Git connection for testing webhook handlers.

**Features:**
- Creates projects using the Vercel SDK
- Validates project name format
- Automatically triggers webhook handlers
- Returns project details and dashboard URL

**Request Body:**
```json
{
  "projectName": "my-test-project"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "projectId": "prj_abc123",
  "projectName": "my-test-project",
  "projectUrl": "https://vercel.com/team/my-test-project",
  "webhookInfo": {
    "message": "Webhook handlers should be triggered automatically",
    "handlers": [
      "Auto-enable deployment protection",
      "Validate Git connection (will alert for missing Git)"
    ]
  }
}
```

**Response (Error):**
```json
{
  "error": "Error message",
  "hint": "Helpful suggestion"
}
```

### GET `/api/create-project`

Returns information about the create-project endpoint.

**Response:**
```json
{
  "endpoint": "/api/create-project",
  "method": "POST",
  "description": "Create a Vercel project without Git connection for testing"
}
```

## Function Documentation

### `autoEnableDeploymentProtection(config)`

Located in: `lib/autoEnableDeploymentProtection.tsx`

Enables SSO Protection (Vercel Authentication) for a Vercel project.

**Parameters:**
- `config.projectId` (string) - The Vercel project ID
- `config.teamId` (string, optional) - Team ID for team projects
- `config.scope` ('all' | 'non-production', default: 'all') - Protection scope
  - `'all'` - Protects all deployments including production
  - `'non-production'` - Protects only preview deployments

**Returns:** `Promise<DeploymentProtectionResult>`

**How it works:**
- Uses the Vercel SDK to update the project's `ssoProtection` settings
- When enabled, visitors must be logged into Vercel and have team access
- Applies to the specified deployment types (all or preview only)

**Example:**
```typescript
const result = await autoEnableDeploymentProtection({
  projectId: 'prj_abc123',
  teamId: 'team_xyz789',
  scope: 'all'
});

if (result.success) {
  console.log('Protection enabled:', result.message);
}
```

**Note:** This requires that your team has Vercel Pro or Enterprise plan for SSO Protection.

### `validateProjectGitConnection(config)`

Located in: `lib/projectNoGitUrl.tsx`

Validates that a project has a Git repository connected.

**Parameters:**
- `config.projectId` (string) - The Vercel project ID
- `config.projectName` (string, optional) - Project name for logging
- `config.teamId` (string, optional) - Team ID for team projects
- `config.ownerId` (string, optional) - Owner ID from webhook payload

**Returns:** `Promise<GitValidationResult>`

**Example:**
```typescript
const result = await validateProjectGitConnection({
  projectId: 'prj_abc123',
  projectName: 'my-app',
  teamId: 'team_xyz789'
});

if (!result.hasGitConnection) {
  console.warn('Project missing Git connection:', result.message);
}
```

## Monitoring & Alerts

### Current Implementation

The project currently logs alerts to the console with structured metadata:

```typescript
console.log('⚠️ [WARNING] Project created without Git repository connection', {
  projectId: 'prj_abc123',
  projectName: 'my-app',
  timestamp: '2025-11-11T...',
  // ... additional metadata
});
```

### Integration Points

To integrate with your monitoring system, update the `sendAlert()` function in `lib/projectNoGitUrl.tsx`:

**Slack Integration:**
```typescript
async function sendAlert(level: AlertLevel, message: string, metadata: Record<string, any>) {
  // ... existing console.log ...
  
  if (level === AlertLevel.WARNING || level === AlertLevel.ERROR) {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${level}: ${message}`,
        attachments: [{
          color: level === AlertLevel.ERROR ? 'danger' : 'warning',
          fields: Object.entries(metadata).map(([key, value]) => ({
            title: key,
            value: String(value),
            short: true
          }))
        }]
      })
    });
  }
}
```

**Datadog Integration:**
```typescript
import { datadogLogs } from '@datadog/browser-logs';

function sendAlert(level: AlertLevel, message: string, metadata: Record<string, any>) {
  // ... existing console.log ...
  
  datadogLogs.logger.log(message, metadata, level.toLowerCase());
}
```

## Testing

### Easy Testing with UI (Recommended)

The easiest way to test the webhook handlers is using the built-in UI:

1. Start the development server:
```bash
pnpm run dev
```

2. Open http://localhost:3000 in your browser

3. Click "Create Test Project"

4. Enter a project name and click "Create Project"

5. Watch the console logs to see the webhook handlers in action:
   - ✅ Deployment protection enabled
   - ⚠️ Git validation alert (no Git connection detected)

6. Check the created project in your Vercel dashboard to verify the protection is enabled

**Note:** This requires proper environment variables (`VERCEL_TOKEN`, `WEBHOOK_SECRET`) to be configured.

### Test Webhook Locally with ngrok

For testing the actual webhook delivery from Vercel:

1. Start the development server:
```bash
pnpm run dev
```

2. Use a tool like ngrok to expose your local server:
```bash
ngrok http 3000
```

3. Configure the webhook in Vercel to point to your ngrok URL:
   - URL: `https://your-ngrok-url.ngrok.io/api/webhooks`
   - Events: `project.created`
   - Secret: Your `WEBHOOK_SECRET` value

4. Create a test project in Vercel (with or without Git) to trigger the webhook

5. Watch the webhook logs in both:
   - Your local console
   - Vercel webhook dashboard (Settings → Webhooks → Recent Deliveries)

### Manual Testing via API

You can test the create-project API endpoint directly using curl:

```bash
curl -X POST http://localhost:3000/api/create-project \
  -H "Content-Type: application/json" \
  -d '{"projectName": "my-test-project-123"}'
```

### Direct Function Testing

You can also test the functions directly in your code:

```typescript
import { autoEnableDeploymentProtection } from '@/lib/autoEnableDeploymentProtection';
import { validateProjectGitConnection } from '@/lib/projectNoGitUrl';

// Test deployment protection
const result1 = await autoEnableDeploymentProtection({
  projectId: 'prj_test123',
  teamId: 'team_test',
  scope: 'all'
});

// Test Git validation
const result2 = await validateProjectGitConnection({
  projectId: 'prj_test123',
  projectName: 'test-project',
  teamId: 'team_test'
});
```

## Project Structure

```
webhooks-example/
├── app/
│   ├── api/
│   │   ├── create-project/
│   │   │   └── route.ts          # API to create test projects
│   │   └── webhooks/
│   │       └── route.ts          # Main webhook handler
│   ├── create-project/
│   │   └── page.tsx              # UI for creating test projects
│   ├── layout.tsx
│   ├── page.tsx                  # Homepage with navigation
│   └── globals.css
├── lib/
│   ├── autoEnableDeploymentProtection.tsx  # Deployment protection logic
│   └── projectNoGitUrl.tsx                  # Git validation logic
├── response-examples/
│   └── get-project.json          # Example Vercel project API response
├── package.json
├── tsconfig.json
├── SETUP.md                      # This file - comprehensive setup guide
└── README.md
```

### Key Files

- **`app/api/webhooks/route.ts`**: Main webhook handler that processes `project.created` events
- **`app/api/create-project/route.ts`**: API endpoint to create Vercel projects for testing
- **`app/create-project/page.tsx`**: User-friendly UI to create test projects
- **`lib/autoEnableDeploymentProtection.tsx`**: Automatic deployment protection enablement
- **`lib/projectNoGitUrl.tsx`**: Git connection validation and alerting

## Security Considerations

1. **Webhook Signature Verification**: All webhooks are verified using HMAC SHA-1 signature
2. **Environment Variables**: Sensitive data (tokens, secrets) stored in environment variables
3. **Error Handling**: Comprehensive error handling prevents information leakage
4. **Logging**: All actions are logged for audit purposes

## Troubleshooting

### Webhook not receiving events

1. Check that the webhook URL is correct and accessible
2. Verify the webhook secret matches between Vercel and your `.env.local`
3. Check Vercel webhook logs in the dashboard for delivery failures
4. Ensure your app is deployed and not in draft mode

### Deployment protection not enabling

1. Verify `VERCEL_TOKEN` has sufficient permissions
2. Check that the token has access to the project/team
3. Review the console logs for detailed error messages
4. Ensure the project ID is correct

### Git validation failing

1. Verify the Vercel API token has project read permissions
2. Check that the project exists and is accessible
3. Review error logs for specific API errors

## License

This project is for internal use. See your organization's license terms.

