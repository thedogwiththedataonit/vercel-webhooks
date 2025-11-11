/**
 * Vercel Webhook Type Definitions
 * 
 * Complete type-safe definitions for all Vercel webhook events
 * Based on: https://vercel.com/docs/observability/webhooks-overview/webhooks-api
 */

// Base webhook structure
export interface VercelWebhookPayload<T = any> {
  id: string;
  type: string;
  createdAt: number;
  payload: T;
  region?: string;
}

// Common types used across events
export interface TeamReference {
  id: string | null;
}

export interface UserReference {
  id: string;
}

export interface ProjectReference {
  id: string;
  name?: string;
}

export interface DeploymentReference {
  id: string;
  meta?: Record<string, any>;
  url?: string;
  name?: string;
  alias?: string[];
  target?: 'production' | 'staging' | null;
  customEnvironmentId?: string;
  regions?: string[];
}

export interface DomainReference {
  name: string;
  delegated?: boolean;
}

export interface ConfigurationReference {
  id: string;
  projectSelection?: 'all' | 'selected';
  projects?: string[];
  scopes?: string[];
}

export interface LinksReference {
  deployment?: string;
  project?: string;
  observability?: string;
}

// =============================================================================
// DEPLOYMENT EVENTS
// =============================================================================

export interface DeploymentCanceledPayload {
  team: TeamReference;
  user: UserReference;
  deployment: DeploymentReference;
  links: LinksReference;
  target?: 'production' | 'staging' | null;
  project: ProjectReference;
  plan: string;
  regions: string[];
}

export interface DeploymentCheckRerequestedPayload {
  team: TeamReference;
  user: UserReference;
  deployment: {
    id: string;
  };
  check: {
    id: string;
  };
}

export interface DeploymentCleanupPayload {
  team: TeamReference;
  user: UserReference;
  deployment: DeploymentReference;
  project: ProjectReference;
}

export interface DeploymentCreatedPayload {
  team: TeamReference;
  user: UserReference;
  alias: string[];
  deployment: DeploymentReference;
  links: LinksReference;
  target?: 'production' | 'staging' | null;
  project: ProjectReference;
  plan: string;
  regions: string[];
}

export interface DeploymentErrorPayload {
  team: TeamReference;
  user: UserReference;
  deployment: DeploymentReference;
  links: LinksReference;
  target?: 'production' | 'staging' | null;
  project: ProjectReference;
  plan: string;
  regions: string[];
}

export interface DeploymentIntegrationActionPayload {
  configuration: {
    id: string;
  };
  installationId: string;
  resourceId: string;
  action: string;
  deployment: {
    id: string;
  };
}

export interface DeploymentPromotedPayload {
  team: TeamReference;
  user: UserReference;
  deployment: DeploymentReference;
  links: LinksReference;
  project: ProjectReference;
  plan: string;
  regions: string[];
}

export interface DeploymentReadyPayload {
  team: TeamReference;
  user: UserReference;
  deployment: DeploymentReference;
  links: LinksReference;
  target?: 'production' | 'staging' | null;
  project: ProjectReference;
  plan: string;
  regions: string[];
}

export interface DeploymentSucceededPayload {
  team: TeamReference;
  user: UserReference;
  deployment: DeploymentReference;
  links: LinksReference;
  target?: 'production' | 'staging' | null;
  project: ProjectReference;
  plan: string;
  regions: string[];
}

// =============================================================================
// DOMAIN EVENTS
// =============================================================================

export interface DomainCreatedPayload {
  team: TeamReference;
  user: UserReference;
  domain: DomainReference;
}

export interface DomainAutoRenewChangedPayload {
  team: TeamReference;
  user: UserReference;
  domain: {
    name: string;
  };
  previous: boolean;
  next: boolean;
}

export interface DomainCertificatePayload {
  team: TeamReference;
  user: UserReference;
  cert: any; // Certificate object structure varies
}

export interface DomainCertificateFailedPayload {
  team: TeamReference;
  user: UserReference;
  dnsNames: string[];
}

export interface DomainDnsRecordsChangedPayload {
  team: TeamReference;
  user: UserReference;
  zone: string;
  changes: any[];
}

export interface DomainRenewalPayload {
  team: TeamReference;
  user: UserReference;
  domain: {
    name: string;
  };
  price: string;
  expirationDate: number;
  renewedAt: number;
}

export interface DomainRenewalFailedPayload {
  team: TeamReference;
  user: UserReference;
  domain: {
    name: string;
  };
  errorReason: string;
  failedAt: number;
}

export interface DomainTransferPayload {
  team: TeamReference;
  user: UserReference;
  domain: {
    name: string;
  };
}

// =============================================================================
// PROJECT EVENTS
// =============================================================================

export interface ProjectCreatedPayload {
  team?: TeamReference;
  teamId?: string;
  user: UserReference;
  project: {
    id: string;
    name: string;
    ownerId?: string;
    accountId?: string;
  };
}

export interface ProjectRemovedPayload {
  team: TeamReference;
  user: UserReference;
  project: ProjectReference;
}

export interface ProjectDomainCreatedPayload {
  team: TeamReference;
  user: UserReference;
  project: ProjectReference;
  domain: {
    name: string;
  };
}

export interface ProjectDomainDeletedPayload {
  team: TeamReference;
  user: UserReference;
  project: ProjectReference;
  domain: {
    name: string;
  };
}

export interface ProjectDomainMovedPayload {
  team: TeamReference;
  user: UserReference;
  domain: {
    name: string;
  };
  from: {
    projectId: string;
  };
  to: {
    projectId: string;
  };
  isRedirect: boolean;
}

export interface ProjectDomainUnverifiedPayload {
  team: TeamReference;
  user: UserReference;
  project: ProjectReference;
  domain: {
    name: string;
  };
}

export interface ProjectDomainUpdatedPayload {
  team: TeamReference;
  user: UserReference;
  project: ProjectReference;
  previous: {
    domain: string;
    redirect?: string | null;
    redirectStatusCode?: number | null;
    gitBranch?: string | null;
  };
  next: {
    domain: string;
    redirect?: string | null;
    redirectStatusCode?: number | null;
    gitBranch?: string | null;
  };
}

export interface ProjectDomainVerifiedPayload {
  team: TeamReference;
  user: UserReference;
  project: ProjectReference;
  domain: {
    name: string;
  };
}

// =============================================================================
// ROLLING RELEASE EVENTS
// =============================================================================

export interface RollingReleaseConfig {
  projectId: string;
  ownerId: string;
  deploymentIds: string[];
  state: 'ACTIVE' | 'COMPLETE' | 'ABORTED';
  activeStageIndex: number;
  default: {
    baseDeploymentId: string;
    targetDeploymentId: string;
    targetPercentage?: number;
    targetStartAt: number;
    targetUpdatedAt: number;
  };
  config: {
    target: string;
    stages: any[];
  };
  writtenBy: string;
}

export interface ProjectRollingReleasePayload {
  team: TeamReference;
  user: UserReference;
  project: ProjectReference;
  rollingRelease: RollingReleaseConfig;
  prevRollingRelease?: RollingReleaseConfig;
}

// =============================================================================
// INTEGRATION EVENTS
// =============================================================================

export interface IntegrationConfigurationPermissionUpgradedPayload {
  team: TeamReference;
  user: UserReference;
  configuration: ConfigurationReference;
  projects: {
    added: string[];
    removed: string[];
  };
}

export interface IntegrationConfigurationRemovedPayload {
  team: TeamReference;
  user: UserReference;
  configuration: ConfigurationReference;
}

export interface IntegrationConfigurationScopeChangeConfirmedPayload {
  team: TeamReference;
  user: UserReference;
  configuration: ConfigurationReference;
}

export interface IntegrationResourceProjectConnectedPayload {
  configuration: {
    id: string;
  };
  installationId: string;
  resourceId: string;
  project: ProjectReference;
  projectId: string;
  targets: string[];
}

export interface IntegrationResourceProjectDisconnectedPayload {
  configuration: {
    id: string;
  };
  installationId: string;
  resourceId: string;
  project: ProjectReference;
  projectId: string;
  targets: string[];
}

// =============================================================================
// MARKETPLACE EVENTS
// =============================================================================

export interface MarketplaceInvoicePayload {
  configuration: {
    id: string;
  };
  installationId: string;
  invoiceId: string;
  externalInvoiceId?: string | null;
  period: {
    start: string;
    end: string;
  };
  invoiceDate: string;
  invoiceTotal: string;
}

export interface MarketplaceInvoiceRefundedPayload {
  configuration: {
    id: string;
  };
  installationId: string;
  invoiceId: string;
  externalInvoiceId?: string | null;
  period: {
    start: string;
    end: string;
  };
  amount: string;
  reason: string;
}

export interface MarketplaceMemberChangedPayload {
  configuration: {
    id: string;
  };
  installationId: string;
  memberId: string;
  role: 'ADMIN' | 'USER' | 'NONE';
}

// =============================================================================
// OBSERVABILITY EVENTS
// =============================================================================

export interface ObservabilityAlert {
  startedAt: string;
  title: string;
  unit: string;
  formattedValues: Record<string, any>;
  count: number;
  average: number;
  stddev: number;
  zscore: number;
  zscoreThreshold: number;
  alertId: string;
  type: string;
  metric?: string;
  route?: string;
  statusGroup?: string;
  cause?: string;
  errorCode?: string;
}

export interface ObservabilityUsageAnomalyPayload {
  teamId: string;
  projectId: string;
  startedAt: number;
  links: {
    observability: string;
  };
  projectSlug: string;
  teamSlug: string;
  groupId?: string;
  alerts: ObservabilityAlert[];
}

export interface ObservabilityErrorAnomalyPayload {
  teamId: string;
  projectId: string;
  startedAt: number;
  links: {
    observability: string;
  };
  projectSlug: string;
  teamSlug: string;
  groupId?: string;
  alerts: ObservabilityAlert[];
}

// =============================================================================
// TYPE UNION FOR ALL EVENTS
// =============================================================================

export type WebhookEventType =
  | 'deployment.canceled'
  | 'deployment.check-rerequested'
  | 'deployment.cleanup'
  | 'deployment.created'
  | 'deployment.error'
  | 'deployment.integration.action.cancel'
  | 'deployment.integration.action.cleanup'
  | 'deployment.integration.action.start'
  | 'deployment.promoted'
  | 'deployment.ready'
  | 'deployment.succeeded'
  | 'domain.created'
  | 'domain.auto-renew-changed'
  | 'domain.certificate-add'
  | 'domain.certificate-add-failed'
  | 'domain.certificate-deleted'
  | 'domain.certificate-renew'
  | 'domain.certificate-renew-failed'
  | 'domain.dns-records-changed'
  | 'domain.renewal'
  | 'domain.renewal-failed'
  | 'domain.transfer-in-completed'
  | 'domain.transfer-in-failed'
  | 'domain.transfer-in-started'
  | 'project.domain-created'
  | 'project.domain-deleted'
  | 'project.domain-moved'
  | 'project.domain-unverified'
  | 'project.domain-updated'
  | 'project.domain-verified'
  | 'integration-configuration.permission-upgraded'
  | 'integration-configuration.removed'
  | 'integration-configuration.scope-change-confirmed'
  | 'integration-resource.project-connected'
  | 'integration-resource.project-disconnected'
  | 'marketplace.invoice.created'
  | 'marketplace.invoice.notpaid'
  | 'marketplace.invoice.paid'
  | 'marketplace.invoice.refunded'
  | 'marketplace.member.changed'
  | 'observability.usage-anomaly'
  | 'observability.error-anomaly'
  | 'project.created'
  | 'project.removed'
  | 'project.rolling-release.approved'
  | 'project.rolling-release.completed'
  | 'project.rolling-release.aborted'
  | 'project.rolling-release.started';

// Type-safe webhook payload mapper
export type WebhookPayloadMap = {
  'deployment.canceled': DeploymentCanceledPayload;
  'deployment.check-rerequested': DeploymentCheckRerequestedPayload;
  'deployment.cleanup': DeploymentCleanupPayload;
  'deployment.created': DeploymentCreatedPayload;
  'deployment.error': DeploymentErrorPayload;
  'deployment.integration.action.cancel': DeploymentIntegrationActionPayload;
  'deployment.integration.action.cleanup': DeploymentIntegrationActionPayload;
  'deployment.integration.action.start': DeploymentIntegrationActionPayload;
  'deployment.promoted': DeploymentPromotedPayload;
  'deployment.ready': DeploymentReadyPayload;
  'deployment.succeeded': DeploymentSucceededPayload;
  'domain.created': DomainCreatedPayload;
  'domain.auto-renew-changed': DomainAutoRenewChangedPayload;
  'domain.certificate-add': DomainCertificatePayload;
  'domain.certificate-add-failed': DomainCertificateFailedPayload;
  'domain.certificate-deleted': DomainCertificatePayload;
  'domain.certificate-renew': DomainCertificatePayload;
  'domain.certificate-renew-failed': DomainCertificateFailedPayload;
  'domain.dns-records-changed': DomainDnsRecordsChangedPayload;
  'domain.renewal': DomainRenewalPayload;
  'domain.renewal-failed': DomainRenewalFailedPayload;
  'domain.transfer-in-completed': DomainTransferPayload;
  'domain.transfer-in-failed': DomainTransferPayload;
  'domain.transfer-in-started': DomainTransferPayload;
  'project.domain-created': ProjectDomainCreatedPayload;
  'project.domain-deleted': ProjectDomainDeletedPayload;
  'project.domain-moved': ProjectDomainMovedPayload;
  'project.domain-unverified': ProjectDomainUnverifiedPayload;
  'project.domain-updated': ProjectDomainUpdatedPayload;
  'project.domain-verified': ProjectDomainVerifiedPayload;
  'integration-configuration.permission-upgraded': IntegrationConfigurationPermissionUpgradedPayload;
  'integration-configuration.removed': IntegrationConfigurationRemovedPayload;
  'integration-configuration.scope-change-confirmed': IntegrationConfigurationScopeChangeConfirmedPayload;
  'integration-resource.project-connected': IntegrationResourceProjectConnectedPayload;
  'integration-resource.project-disconnected': IntegrationResourceProjectDisconnectedPayload;
  'marketplace.invoice.created': MarketplaceInvoicePayload;
  'marketplace.invoice.notpaid': MarketplaceInvoicePayload;
  'marketplace.invoice.paid': MarketplaceInvoicePayload;
  'marketplace.invoice.refunded': MarketplaceInvoiceRefundedPayload;
  'marketplace.member.changed': MarketplaceMemberChangedPayload;
  'observability.usage-anomaly': ObservabilityUsageAnomalyPayload;
  'observability.error-anomaly': ObservabilityErrorAnomalyPayload;
  'project.created': ProjectCreatedPayload;
  'project.removed': ProjectRemovedPayload;
  'project.rolling-release.approved': ProjectRollingReleasePayload;
  'project.rolling-release.completed': ProjectRollingReleasePayload;
  'project.rolling-release.aborted': ProjectRollingReleasePayload;
  'project.rolling-release.started': ProjectRollingReleasePayload;
};

// Type-safe webhook event
export type TypedWebhookEvent<T extends WebhookEventType> = VercelWebhookPayload<WebhookPayloadMap[T]> & {
  type: T;
};

// Helper type to get payload type from event type
export type GetPayloadType<T extends WebhookEventType> = WebhookPayloadMap[T];

