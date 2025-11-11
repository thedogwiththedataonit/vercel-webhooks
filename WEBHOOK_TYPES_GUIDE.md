# Webhook Types Guide

## Problem Solved

The webhook was failing with "TypeError: unusable" when trying to parse the request body. This was because:

1. The request body was being consumed in `verifySignature()` by calling `request.text()`
2. Then we tried to clone the request and read it again
3. **In Next.js, you cannot clone a request after its body has been consumed**

## Solution

### 1. Fixed Request Body Handling

Changed the approach to read the body **once** and use it for both signature verification and JSON parsing:

```typescript
// OLD (BROKEN) - Body consumed twice
async function verifySignature(req: NextRequest): Promise<boolean> {
  const payload = await req.text();  // Consumes body
  // ...
}

const isValid = await verifySignature(request);  // Body consumed
const clonedRequest = request.clone();  // ❌ FAILS - can't clone consumed body
const body = await clonedRequest.json();  // ❌ FAILS

// NEW (WORKING) - Body read once
const bodyText = await request.text();  // Read once
const isValid = verifySignature(bodyText, signature);  // Use the text
const body = JSON.parse(bodyText);  // Parse the same text
```

### 2. Added Comprehensive TypeScript Types

Created `/app/api/webhooks/types.ts` with complete type definitions for **all** Vercel webhook events:

#### Event Categories

- **Deployment Events** (11 types)
  - `deployment.created`, `deployment.ready`, `deployment.succeeded`, etc.
  
- **Domain Events** (12 types)
  - `domain.created`, `domain.certificate-add`, `domain.renewal`, etc.
  
- **Project Events** (11 types)
  - `project.created`, `project.removed`, `project.domain-*`, `project.rolling-release.*`, etc.
  
- **Integration Events** (5 types)
  - `integration-configuration.*`, `integration-resource.*`, etc.
  
- **Marketplace Events** (5 types)
  - `marketplace.invoice.*`, `marketplace.member.changed`, etc.
  
- **Observability Events** (2 types)
  - `observability.usage-anomaly`, `observability.error-anomaly`

#### Type Safety Features

```typescript
// Type union for all event types
export type WebhookEventType = 
  | 'deployment.created'
  | 'project.created'
  | 'domain.created'
  // ... all 50+ event types

// Payload map for type-safe access
export type WebhookPayloadMap = {
  'deployment.created': DeploymentCreatedPayload;
  'project.created': ProjectCreatedPayload;
  // ... mapping for all events
};

// Type-safe webhook event
export type TypedWebhookEvent<T extends WebhookEventType> = 
  VercelWebhookPayload<WebhookPayloadMap[T]> & {
    type: T;
  };
```

## Usage Examples

### Basic Webhook Handling

```typescript
import { 
  VercelWebhookPayload, 
  ProjectCreatedPayload,
  DeploymentSucceededPayload 
} from './types';

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const body: VercelWebhookPayload = JSON.parse(bodyText);

  if (body.type === 'project.created') {
    const payload = body.payload as ProjectCreatedPayload;
    console.log('Project created:', payload.project.name);
  }

  if (body.type === 'deployment.succeeded') {
    const payload = body.payload as DeploymentSucceededPayload;
    console.log('Deployment succeeded:', payload.deployment.url);
  }
}
```

### Type-Safe Event Handling

```typescript
import { TypedWebhookEvent } from './types';

function handleProjectCreated(
  event: TypedWebhookEvent<'project.created'>
) {
  // TypeScript knows exact structure
  console.log(event.payload.project.id);
  console.log(event.payload.project.name);
  console.log(event.payload.team?.id);
}

function handleDeploymentSucceeded(
  event: TypedWebhookEvent<'deployment.succeeded'>
) {
  // Different structure, fully typed
  console.log(event.payload.deployment.url);
  console.log(event.payload.links.deployment);
  console.log(event.payload.target); // 'production' | 'staging' | null
}
```

### Pattern Matching with Type Guards

```typescript
function handleWebhook(body: VercelWebhookPayload) {
  switch (body.type) {
    case 'project.created': {
      const payload = body.payload as ProjectCreatedPayload;
      // Handle project creation
      break;
    }
    
    case 'deployment.succeeded': {
      const payload = body.payload as DeploymentSucceededPayload;
      // Handle successful deployment
      break;
    }
    
    case 'domain.created': {
      const payload = body.payload as DomainCreatedPayload;
      // Handle domain creation
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${body.type}`);
  }
}
```

## Benefits

### ✅ Fixed Issues

1. **No more "TypeError: unusable"** - Body is read once
2. **Type safety** - All 50+ webhook events have proper types
3. **Better DX** - Autocomplete and type checking in IDE
4. **Maintainable** - Easy to add new event handlers

### ✅ Comprehensive Logging

The webhook handler now logs every step:

```
🚀 [WEBHOOK] Incoming webhook request received
📋 [WEBHOOK] Step 1: Checking environment configuration
✅ [WEBHOOK] WEBHOOK_SECRET is configured
✅ [WEBHOOK] VERCEL_TOKEN is configured
📋 [WEBHOOK] Step 2: Reading request body
✅ [WEBHOOK] Request body read successfully
📋 [WEBHOOK] Step 3: Request headers
📋 [WEBHOOK] Step 4: Verifying signature
✅ [WEBHOOK] Signature verification result: true
📋 [WEBHOOK] Step 5: Parsing JSON body
✅ [WEBHOOK] Body parsed successfully
📋 [WEBHOOK] Step 6: Validating required fields
✅ [WEBHOOK] All required fields present
📋 [WEBHOOK] Step 7: Webhook event details
📋 [WEBHOOK] Step 8: Processing project.created event
// ... more detailed logs
```

## Adding New Event Handlers

To handle a new webhook event type:

1. Import the type from `types.ts`:
```typescript
import { DeploymentSucceededPayload } from './types';
```

2. Add a handler in the webhook route:
```typescript
if (body.type === 'deployment.succeeded') {
  const payload = body.payload as DeploymentSucceededPayload;
  
  // Your logic here
  await handleDeploymentSucceeded(payload);
}
```

3. Create your handler function:
```typescript
async function handleDeploymentSucceeded(
  payload: DeploymentSucceededPayload
) {
  console.log('Deployment succeeded:', {
    deploymentId: payload.deployment.id,
    url: payload.deployment.url,
    target: payload.target,
  });
  
  // Your custom logic
}
```

## Testing

The webhook handler now includes detailed logging at every step. When testing:

1. Create a project via the UI or API
2. Watch your logs for each step
3. Any errors will show exactly where they occurred

Example successful flow:
```
✅ [WEBHOOK] Step 2: Request body read successfully
✅ [WEBHOOK] Signature verification result: true
✅ [WEBHOOK] Body parsed successfully
✅ [WEBHOOK] Deployment protection succeeded
✅ [WEBHOOK] Git validation succeeded
✅ [WEBHOOK] Webhook processing completed successfully
```

## References

- [Vercel Webhooks API Documentation](https://vercel.com/docs/observability/webhooks-overview/webhooks-api)
- [Next.js Request API](https://nextjs.org/docs/app/api-reference/functions/next-request)

