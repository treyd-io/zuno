import { sqliteTable, text, integer, blob, index } from 'drizzle-orm/sqlite-core'

// Provider configurations
export const providerConfigs = sqliteTable('provider_configs', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(), // 'xero', 'fortnox', 'qbo'
  tenantId: text('tenant_id').notNull(),
  clientId: text('client_id').notNull(),
  clientSecret: text('client_secret').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: integer('expires_at'),
  baseUrl: text('base_url'),
  isActive: integer('is_active').default(1),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull()
}, (table) => ({
  providerTenantIdx: index('provider_tenant_idx').on(table.provider, table.tenantId),
  activeIdx: index('active_idx').on(table.isActive)
}))

// Sync history tracking
export const syncHistory = sqliteTable('sync_history', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  tenantId: text('tenant_id').notNull(),
  entityType: text('entity_type').notNull(), // 'customer', 'invoice', 'transaction', 'attachment'
  operation: text('operation').notNull(), // 'fetch', 'create', 'update', 'delete'
  entityId: text('entity_id'),
  status: text('status').notNull(), // 'pending', 'success', 'failed', 'retry'
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').default(0),
  startedAt: integer('started_at').notNull(),
  completedAt: integer('completed_at'),
  metadata: text('metadata') // JSON string for additional data
}, (table) => ({
  providerTenantIdx: index('sync_provider_tenant_idx').on(table.provider, table.tenantId),
  statusIdx: index('sync_status_idx').on(table.status),
  entityTypeIdx: index('sync_entity_type_idx').on(table.entityType),
  startedAtIdx: index('sync_started_at_idx').on(table.startedAt)
}))

// Cached entities (for performance and offline capabilities)
export const cachedEntities = sqliteTable('cached_entities', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  tenantId: text('tenant_id').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  externalId: text('external_id').notNull(),
  data: text('data').notNull(), // JSON string of the entity data
  hash: text('hash').notNull(), // For change detection
  lastSyncAt: integer('last_sync_at').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull()
}, (table) => ({
  providerTenantEntityIdx: index('cached_provider_tenant_entity_idx').on(table.provider, table.tenantId, table.entityType),
  externalIdIdx: index('cached_external_id_idx').on(table.externalId),
  hashIdx: index('cached_hash_idx').on(table.hash),
  lastSyncIdx: index('cached_last_sync_idx').on(table.lastSyncAt)
}))

// Rate limiting tracking
export const rateLimits = sqliteTable('rate_limits', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  tenantId: text('tenant_id').notNull(),
  endpoint: text('endpoint').notNull(),
  requestCount: integer('request_count').default(0),
  resetTime: integer('reset_time').notNull(),
  limit: integer('limit').notNull(),
  remaining: integer('remaining').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull()
}, (table) => ({
  providerTenantEndpointIdx: index('rate_provider_tenant_endpoint_idx').on(table.provider, table.tenantId, table.endpoint),
  resetTimeIdx: index('rate_reset_time_idx').on(table.resetTime)
}))

// Queue jobs tracking
export const queueJobs = sqliteTable('queue_jobs', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  tenantId: text('tenant_id'),
  method: text('method').notNull(),
  args: text('args').notNull(), // JSON string
  status: text('status').notNull(), // 'pending', 'processing', 'completed', 'failed'
  retryCount: integer('retry_count').default(0),
  maxRetries: integer('max_retries').default(3),
  scheduledAt: integer('scheduled_at').notNull(),
  startedAt: integer('started_at'),
  completedAt: integer('completed_at'),
  errorMessage: text('error_message'),
  result: text('result'), // JSON string of the result
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull()
}, (table) => ({
  providerIdx: index('queue_provider_idx').on(table.provider),
  statusIdx: index('queue_status_idx').on(table.status),
  scheduledAtIdx: index('queue_scheduled_at_idx').on(table.scheduledAt),
  retryCountIdx: index('queue_retry_count_idx').on(table.retryCount)
}))

export type ProviderConfig = typeof providerConfigs.$inferSelect
export type NewProviderConfig = typeof providerConfigs.$inferInsert
export type SyncHistory = typeof syncHistory.$inferSelect
export type NewSyncHistory = typeof syncHistory.$inferInsert
export type CachedEntity = typeof cachedEntities.$inferSelect
export type NewCachedEntity = typeof cachedEntities.$inferInsert
export type RateLimit = typeof rateLimits.$inferSelect
export type NewRateLimit = typeof rateLimits.$inferInsert
export type QueueJob = typeof queueJobs.$inferSelect
export type NewQueueJob = typeof queueJobs.$inferInsert 