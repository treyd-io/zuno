import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ProviderManager } from '../providers/manager'
import { XeroProvider } from '../providers/xero'
import { FortnoxProvider } from '../providers/fortnox'
import { QuickBooksProvider } from '../providers/quickbooks'
import { SageProvider } from '../providers/sage'
 import { 
  CustomerSchema, 
  VendorSchema,
  InvoiceSchema, 
  BillSchema,
  TransactionSchema,
  ExpenseSchema,
  JournalEntrySchema,
  PaymentSchema,
  AccountSchema,
  ItemSchema,
  AttachmentSchema,
  CompanyInfoSchema,
  BulkExportSchema,
  PaginationSchema,
  ApiRequestSchema
} from '../schemas'

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>()

// Initialize provider manager and file handler
let providerManager: ProviderManager
 
// Middleware to initialize provider manager and file handler
app.use('*', async (c, next) => {
  if (!providerManager) {
    providerManager = new ProviderManager(c.env)
    providerManager.registerProvider('xero', XeroProvider)
   providerManager.registerProvider('fortnox', FortnoxProvider)
  providerManager.registerProvider('quickbooks', QuickBooksProvider)
  providerManager.registerProvider('sage', SageProvider)
  }

 

  await next()
})

// Error response schema
const ErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
})

// Success response schemas
const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

// ======================
// AUTHENTICATION ROUTES
// ======================

// Authentication - Get OAuth URL
const getAuthUrlRoute = createRoute({
  method: 'post',
  path: '/auth/url',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            provider: z.enum(['xero', 'fortnox', 'quickbooks', 'sage']),
            scopes: z.array(z.string()),
            redirectUri: z.string().url().optional()
          })
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            authUrl: z.string().url(),
            state: z.string(),
            provider: z.string()
          })
        }
      },
      description: 'Authentication URL generated'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Bad request'
    }
  },
  summary: 'Get OAuth authorization URL',
  tags: ['Authentication']
})

app.openapi(getAuthUrlRoute, async (c) => {
  const { provider, scopes, redirectUri } = await c.req.json()
  
  const providerInstance = await providerManager.initializeProvider(provider, {
    clientId: c.env.XERO_CLIENT_ID || 'placeholder',
    clientSecret: c.env.XERO_CLIENT_SECRET || 'placeholder',
    redirectUri: redirectUri || c.env.REDIRECT_URI || 'http://localhost:3000/callback'
  })
  
  const state = crypto.randomUUID()
  const authUrl = providerInstance.getAuthUrl(scopes, state)
  
  return c.json({
    authUrl,
    state,
    provider
  })
})

// Authentication - Exchange code for tokens
const exchangeTokenRoute = createRoute({
  method: 'post',
  path: '/auth/token',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            provider: z.enum(['xero', 'fortnox', 'quickbooks', 'sage']),
            code: z.string(),
            state: z.string().optional()
          })
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            accessToken: z.string(),
            refreshToken: z.string().optional(),
            expiresAt: z.string().optional(),
            tenantId: z.string().optional(),
            provider: z.string()
          })
        }
      },
      description: 'Tokens exchanged successfully'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Bad request'
    }
  },
  summary: 'Exchange authorization code for tokens',
  tags: ['Authentication']
})

app.openapi(exchangeTokenRoute, async (c) => {
  const { provider, code } = await c.req.json()
  
  const providerInstance = await providerManager.initializeProvider(provider, {
    clientId: c.env.XERO_CLIENT_ID || 'placeholder',
    clientSecret: c.env.XERO_CLIENT_SECRET || 'placeholder'
  })
  
  const auth = await providerInstance.exchangeCodeForToken(code)
  
  return c.json({
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    expiresAt: auth.expiresAt?.toISOString(),
    tenantId: auth.tenantId,
    provider
  })
})

// ======================
// COMPANY INFO ROUTES
// ======================

const getCompanyInfoRoute = createRoute({
  method: 'get',
  path: '/company-info',
  request: {
    query: ApiRequestSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: CompanyInfoSchema,
            provider: z.string()
          })
        }
      },
      description: 'Company information retrieved successfully'
    }
  },
  summary: 'Get company information',
  tags: ['Company']
})

app.openapi(getCompanyInfoRoute, async (c) => {
  const { provider } = c.req.valid('query')
  
  const companyInfo = await providerManager.getCompanyInfo(provider)
  
  return c.json({
    success: true,
    data: companyInfo,
    provider
  })
})

// ======================
// ACCOUNT ROUTES
// ======================

const getAccountsRoute = createRoute({
  method: 'get',
  path: '/accounts',
  request: {
    query: ApiRequestSchema.extend({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(20),
      accountType: z.enum(['asset', 'liability', 'equity', 'income', 'expense']).optional(),
      isActive: z.coerce.boolean().optional(),
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(AccountSchema),
            pagination: PaginationSchema,
            provider: z.string()
          })
        }
      },
      description: 'Accounts retrieved successfully'
    }
  },
  summary: 'Get chart of accounts',
  tags: ['Accounts']
})

app.openapi(getAccountsRoute, async (c) => {
  const query = c.req.valid('query')
  const { provider, page, limit, accountType, isActive, ...options } = query
  
  const result = await providerManager.getAccounts(provider, {
    ...options,
    page,
    limit,
    accountType,
    isActive
  })
  
  return c.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    provider
  })
})

const createAccountRoute = createRoute({
  method: 'post',
  path: '/accounts',
  request: {
    query: z.object({
            provider: z.enum(['xero', 'fortnox', 'quickbooks', 'sage']),
    }),
    body: {
      content: {
        'application/json': {
          schema: AccountSchema.omit({ id: true, createdAt: true, updatedAt: true })
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: AccountSchema,
            provider: z.string()
          })
        }
      },
      description: 'Account created successfully'
    }
  },
  summary: 'Create account',
  tags: ['Accounts']
})

app.openapi(createAccountRoute, async (c) => {
  const { provider } = c.req.valid('query')
  const accountData = c.req.valid('json')
  
  const account = await providerManager.createAccount(provider, accountData)
  
  return c.json({
    success: true,
    data: account,
    provider
  }, 201)
})

// ======================
// CUSTOMER ROUTES
// ======================

const getCustomersRoute = createRoute({
  method: 'get',
  path: '/customers',
  request: {
    query: ApiRequestSchema.extend({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(20),
      isActive: z.coerce.boolean().optional(),
      search: z.string().optional(),
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(CustomerSchema),
            pagination: PaginationSchema,
            provider: z.string()
          })
        }
      },
      description: 'Customers retrieved successfully'
    }
  },
  summary: 'Get customers',
  tags: ['Customers']
})

app.openapi(getCustomersRoute, async (c) => {
  const query = c.req.valid('query')
  const { provider, page, limit, isActive, search, ...options } = query
  
  const result = await providerManager.getCustomers(provider, {
    ...options,
    page,
    limit,
    isActive,
    search
  })
  
  return c.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    provider
  })
})

const createCustomerRoute = createRoute({
  method: 'post',
  path: '/customers',
  request: {
    query: z.object({
        provider: z.enum(['xero', 'fortnox', 'quickbooks', 'sage']),
    }),
    body: {
      content: {
        'application/json': {
          schema: CustomerSchema.omit({ id: true, createdAt: true, updatedAt: true })
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: CustomerSchema,
            provider: z.string()
          })
        }
      },
      description: 'Customer created successfully'
    }
  },
  summary: 'Create customer',
  tags: ['Customers']
})

app.openapi(createCustomerRoute, async (c) => {
  const { provider } = c.req.valid('query')
  const customerData = c.req.valid('json')
  
  const customer = await providerManager.createCustomer(provider, customerData)
  
  return c.json({
    success: true,
    data: customer,
    provider
  }, 201)
})

// ======================
// VENDOR ROUTES
// ======================

const getVendorsRoute = createRoute({
  method: 'get',
  path: '/vendors',
  request: {
    query: ApiRequestSchema.extend({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(20),
      isActive: z.coerce.boolean().optional(),
      search: z.string().optional(),
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(VendorSchema),
            pagination: PaginationSchema,
            provider: z.string()
          })
        }
      },
      description: 'Vendors retrieved successfully'
    }
  },
  summary: 'Get vendors',
  tags: ['Vendors']
})

app.openapi(getVendorsRoute, async (c) => {
  const query = c.req.valid('query')
  const { provider, page, limit, isActive, search, ...options } = query
  
  const result = await providerManager.getVendors(provider, {
    ...options,
    page,
    limit,
    isActive,
    search
  })
  
  return c.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    provider
  })
})

const createVendorRoute = createRoute({
  method: 'post',
  path: '/vendors',
  request: {
    query: z.object({
        provider: z.enum(['xero', 'fortnox', 'quickbooks', 'sage']),
    }),
    body: {
      content: {
        'application/json': {
          schema: VendorSchema.omit({ id: true, createdAt: true, updatedAt: true })
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: VendorSchema,
            provider: z.string()
          })
        }
      },
      description: 'Vendor created successfully'
    }
  },
  summary: 'Create vendor',
  tags: ['Vendors']
})

app.openapi(createVendorRoute, async (c) => {
  const { provider } = c.req.valid('query')
  const vendorData = c.req.valid('json')
  
  const vendor = await providerManager.createVendor(provider, vendorData)
  
  return c.json({
    success: true,
    data: vendor,
    provider
  }, 201)
})

// ======================
// INVOICE ROUTES
// ======================

const getInvoicesRoute = createRoute({
  method: 'get',
  path: '/invoices',
  request: {
    query: ApiRequestSchema.extend({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(20),
      status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled', 'void']).optional(),
      customerId: z.string().optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(InvoiceSchema),
            pagination: PaginationSchema,
            provider: z.string()
          })
        }
      },
      description: 'Invoices retrieved successfully'
    }
  },
  summary: 'Get invoices',
  tags: ['Invoices']
})

app.openapi(getInvoicesRoute, async (c) => {
  const query = c.req.valid('query')
  const { provider, page, limit, status, customerId, dateFrom, dateTo, ...options } = query
  
  const result = await providerManager.getInvoices(provider, {
    ...options,
    page,
    limit,
    status,
    customerId,
    dateFrom,
    dateTo
  })
  
  return c.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    provider
  })
})

const createInvoiceRoute = createRoute({
  method: 'post',
  path: '/invoices',
  request: {
    query: z.object({
        provider: z.enum(['xero', 'fortnox', 'quickbooks', 'sage']),
    }),
    body: {
      content: {
        'application/json': {
          schema: InvoiceSchema.omit({ id: true, createdAt: true, updatedAt: true })
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: InvoiceSchema,
            provider: z.string()
          })
        }
      },
      description: 'Invoice created successfully'
    }
  },
  summary: 'Create invoice',
  tags: ['Invoices']
})

app.openapi(createInvoiceRoute, async (c) => {
  const { provider } = c.req.valid('query')
  const invoiceData = c.req.valid('json')
  
  const invoice = await providerManager.createInvoice(provider, invoiceData)
  
  return c.json({
    success: true,
    data: invoice,
    provider
  }, 201)
})

// ======================
// TRANSACTION ROUTES
// ======================

const getTransactionsRoute = createRoute({
  method: 'get',
  path: '/transactions',
  request: {
    query: ApiRequestSchema.extend({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(20),
      type: z.enum(['payment', 'receipt', 'transfer', 'adjustment', 'deposit', 'withdrawal', 'charge', 'refund']).optional(),
      accountId: z.string().optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(TransactionSchema),
            pagination: PaginationSchema,
            provider: z.string()
          })
        }
      },
      description: 'Transactions retrieved successfully'
    }
  },
  summary: 'Get transactions',
  tags: ['Transactions']
})

app.openapi(getTransactionsRoute, async (c) => {
  const query = c.req.valid('query')
  const { provider, page, limit, type, accountId, dateFrom, dateTo, ...options } = query
  
  const result = await providerManager.getTransactions(provider, {
    ...options,
    page,
    limit,
    type,
    accountId,
    dateFrom,
    dateTo
  })
  
  return c.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    provider
  })
})

// ======================
// ATTACHMENT ROUTES
// ======================

const uploadAttachmentRoute = createRoute({
  method: 'post',
  path: '/attachments/upload',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.instanceof(File),
            entityType: z.enum(['invoice', 'customer', 'transaction', 'expense', 'bill', 'receipt', 'journal_entry']),
            entityId: z.string(),
            attachmentType: z.enum(['receipt', 'invoice', 'contract', 'supporting_document', 'other']).optional(),
            description: z.string().optional(),
            isPublic: z.coerce.boolean().default(false),
          })
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: AttachmentSchema,
            message: z.string()
          })
        }
      },
      description: 'File uploaded successfully'
    }
  },
  summary: 'Upload attachment',
  tags: ['Attachments']
})

app.openapi(uploadAttachmentRoute, async (c) => {
  const formData = await c.req.parseBody()
  const file = formData.file as File
  const entityType = formData.entityType as string
  const entityId = formData.entityId as string
  const attachmentType = formData.attachmentType as string
  const description = formData.description as string
  const isPublic = formData.isPublic === 'true'
  
  const upload = {
    file,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    entityType,
    entityId,
    attachmentType,
    description,
    isPublic,
  }
  
  const attachment = await fileHandler.uploadFile(upload)
  
  return c.json({
    success: true,
    data: attachment,
    message: 'File uploaded successfully'
  }, 201)
})

const getAttachmentsRoute = createRoute({
  method: 'get',
  path: '/attachments',
  request: {
    query: z.object({
      entityType: z.enum(['invoice', 'customer', 'transaction', 'expense', 'bill', 'receipt', 'journal_entry']),
      entityId: z.string(),
      attachmentType: z.enum(['receipt', 'invoice', 'contract', 'supporting_document', 'other']).optional(),
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(AttachmentSchema),
            count: z.number()
          })
        }
      },
      description: 'Attachments retrieved successfully'
    }
  },
  summary: 'Get attachments for entity',
  tags: ['Attachments']
})

app.openapi(getAttachmentsRoute, async (c) => {
  const { entityType, entityId, attachmentType } = c.req.valid('query')
  
  const attachments = await providerManager.getAttachments(entityType, entityId, attachmentType)
  
  return c.json({
    success: true,
    data: attachments,
    count: attachments.length
  })
})

// ======================
// BULK EXPORT ROUTES
// ======================

const bulkExportRoute = createRoute({
  method: 'post',
  path: '/export/bulk',
  request: {
    body: {
      content: {
        'application/json': {
          schema: BulkExportSchema
        }
      }
    }
  },
  responses: {
    202: {
      content: {
        'application/json': {
          schema: z.object({
            jobId: z.string(),
            status: z.literal('queued'),
            provider: z.string(),
            entityTypes: z.array(z.string()),
            timestamp: z.string(),
            estimatedCompletion: z.string().optional()
          })
        }
      },
      description: 'Bulk export job queued successfully'
    }
  },
  summary: 'Bulk export bookkeeping data',
  tags: ['Export']
})

app.openapi(bulkExportRoute, async (c) => {
  const exportRequest = c.req.valid('json')
  
  const jobId = await providerManager.enqueueBulkExport(exportRequest)
  
  return c.json({
    jobId,
    status: 'queued' as const,
    provider: exportRequest.provider,
    entityTypes: exportRequest.entityTypes,
    timestamp: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + (exportRequest.entityTypes.length * 60000)).toISOString()
  }, 202)
})

// ======================
// HEALTH CHECK
// ======================

const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.literal('healthy'),
            timestamp: z.string(),
            providers: z.array(z.string()),
            features: z.array(z.string()),
            version: z.string()
          })
        }
      },
      description: 'Service health status'
    }
  },
  summary: 'Health check',
  tags: ['Health']
})

app.openapi(healthRoute, (c) => {
  return c.json({
    status: 'healthy' as const,
    timestamp: new Date().toISOString(),
    providers: ['xero', 'fortnox', 'quickbooks', 'sage'],
    features: ['attachments', 'bulk_export', 'real_time_sync', 'webhooks'],
    version: '2.0.0'
  })
})

export default app 