# Zuno - Universal Bookkeeping API (WIP)

A unified API that provides a thin layer over multiple ERP systems. Designed to serve as a consistent interface for services like midday.ai to export transactions with attachments from different accounting providers.

## 🚀 Features

- **Unified Interface**: Single API for multiple accounting providers
- **Read-Only Operations**: Thin layer that proxies requests to underlying ERPs
- **Attachment Proxy**: Forward attachment requests to provider APIs
- **OAuth 2.0 Authentication**: Secure authentication for all providers
- **Bulk Operations**: Support for bulk data operations
- **Real-time Sync**: Webhooks and real-time data synchronization
- **Comprehensive Entities**: Support for all major accounting entities

## 🔌 Supported Providers

| Provider | Region | Authentication | Entities | Attachments |
|----------|--------|---------------|----------|-------------|
| **Xero** | Global | OAuth 2.0 | ✅ Full | ✅ Download |
| **Fortnox** | Sweden | OAuth 2.0 | ✅ Full | ✅ Download |
| **QuickBooks** | US, CA, UK, AU | OAuth 2.0 | ✅ Full | ✅ Download |
| **Sage** | UK/EU | OAuth 2.0 | ✅ Full | ✅ Download |

## 📋 Supported Entities

- **Contacts**: Customers and Vendors
- **Products**: Items and Services
- **Transactions**: Invoices, Bills, Payments
- **Accounting**: Accounts, Journal Entries, Expenses
- **Attachments**: Receipts, Invoices, Documents

## 🔐 Authentication

All providers use OAuth 2.0 for secure authentication:

### Step 1: Get Authorization URL
```bash
curl -X POST https://api.zuno.dev/auth/url \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "sage",
    "scopes": ["full_access"],
    "redirectUri": "https://your-app.com/callback"
  }'
```

### Step 2: Exchange Code for Token
```bash
curl -X POST https://api.zuno.dev/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "sage",
    "code": "authorization_code_from_callback"
  }'
```

## 📖 API Examples

### Sage Business Cloud Accounting

#### Authentication
```javascript
// Get authorization URL
const authResponse = await fetch('/auth/url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'sage',
    scopes: ['full_access'],
    redirectUri: 'https://your-app.com/callback'
  })
});

// Exchange code for token
const tokenResponse = await fetch('/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'sage',
    code: 'authorization_code'
  })
});
```

#### Fetch Customers
```javascript
const customers = await fetch('/customers?provider=sage', {
  headers: { 
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

#### Create Invoice
```javascript
const invoice = await fetch('/invoices?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerId: 'customer-123',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    lineItems: [{
      description: 'Consulting services',
      quantity: 10,
      unitPrice: 150.00
    }]
  })
});
```

#### Download Attachments
```javascript
// Get invoice attachments
const attachments = await fetch('/attachments?provider=sage&entityType=invoice&entityId=inv-123', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// Download specific attachment
const fileStream = await fetch(`/attachments/att-456/download?provider=sage`, {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

### Xero

#### Authentication
```javascript
const authResponse = await fetch('/auth/url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'xero',
    scopes: ['accounting.transactions', 'accounting.attachments'],
    redirectUri: 'https://your-app.com/callback'
  })
});
```

#### Fetch Invoices with Attachments
```javascript
// Get invoices
const invoices = await fetch('/invoices?provider=xero', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// Get attachments for specific invoice
const attachments = await fetch('/attachments?provider=xero&entityType=invoice&entityId=inv-123', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

### Fortnox

#### Authentication
```javascript
const authResponse = await fetch('/auth/url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'fortnox',
    scopes: ['invoice', 'customer', 'supplier'],
    redirectUri: 'https://your-app.com/callback'
  })
});
```

#### Bulk Export
```javascript
const exportJob = await fetch('/export', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    provider: 'fortnox',
    entities: ['invoices', 'customers', 'attachments'],
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31'
    }
  })
});
```

### QuickBooks Online

#### Authentication
```javascript
const authResponse = await fetch('/auth/url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'quickbooks',
    scopes: ['com.intuit.quickbooks.accounting'],
    redirectUri: 'https://your-app.com/callback'
  })
});
```

#### Multi-Region Support
```javascript
// US region
const usCustomers = await fetch('/customers?provider=quickbooks&region=US', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// UK region
const ukCustomers = await fetch('/customers?provider=quickbooks&region=UK', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

## 🗂️ Data Models

### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  displayName?: string;
  email?: string;
  phone?: PhoneNumber;
  addresses: Address[];
  taxNumber?: string;
  currency: string;
  isActive: boolean;
  balance?: number;
  creditLimit?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Invoice
```typescript
interface Invoice {
  id: string;
  number: string;
  customerId: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  currency: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  amountDue: number;
  lineItems: LineItem[];
  createdAt: string;
  updatedAt: string;
}
```

### Attachment
```typescript
interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  downloadUrl: string;
  entityType: 'invoice' | 'bill' | 'expense';
  entityId: string;
  createdAt: string;
  updatedAt: string;
}
```

## 🛠️ Development

### Prerequisites
- Bun (Package manager)
- Node.js 18+
- TypeScript

### Setup
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Deploy to Cloudflare Workers
bun run deploy
```

### Environment Variables
```bash
# Provider Credentials
XERO_CLIENT_ID=your_xero_client_id
XERO_CLIENT_SECRET=your_xero_client_secret

FORTNOX_CLIENT_ID=your_fortnox_client_id
FORTNOX_CLIENT_SECRET=your_fortnox_client_secret

QUICKBOOKS_CLIENT_ID=your_quickbooks_client_id
QUICKBOOKS_CLIENT_SECRET=your_quickbooks_client_secret

SAGE_CLIENT_ID=your_sage_client_id
SAGE_CLIENT_SECRET=your_sage_client_secret

# Database
DATABASE_URL=your_database_url

# Optional: Environment
NODE_ENV=development
```

## 📊 Provider Capabilities

### Sage Business Cloud Accounting
- **Region**: UK and European markets
- **Authentication**: OAuth 2.0
- **Rate Limits**: 1000 requests/hour
- **Entities**: Customers, Suppliers, Invoices, Bills, Items, Accounts, Journal Entries, Expenses, Payments
- **Attachments**: Full support via native API
- **Bulk Operations**: Supported
- **Webhooks**: Available

### Xero
- **Region**: Global
- **Authentication**: OAuth 2.0
- **Rate Limits**: 10,000 requests/day
- **Entities**: Full accounting entity support
- **Attachments**: Download and metadata only
- **Bulk Operations**: Supported
- **Webhooks**: Available

### Fortnox
- **Region**: Sweden
- **Authentication**: OAuth 2.0
- **Rate Limits**: 25 requests/second
- **Entities**: Full Swedish accounting support
- **Attachments**: Full support
- **Bulk Operations**: Supported
- **Webhooks**: Available

### QuickBooks Online
- **Region**: US, Canada, UK, Australia
- **Authentication**: OAuth 2.0
- **Rate Limits**: 500 requests/minute
- **Entities**: Comprehensive US GAAP support
- **Attachments**: Full support
- **Bulk Operations**: Supported
- **Webhooks**: Available

## 🔄 Sync Options

All providers support incremental sync:

```javascript
// Sync customers modified since last sync
const customers = await fetch('/customers?provider=sage&modifiedSince=2024-01-01T00:00:00Z', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// Bulk export with date range
const exportJob = await fetch('/export', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    provider: 'sage',
    entities: ['invoices', 'customers', 'attachments'],
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31'
    },
    includeAttachments: true
  })
});
```

## 🚦 Rate Limiting

Each provider has different rate limits:

| Provider | Rate Limit | Reset Window |
|----------|------------|--------------|
| Xero | 10,000/day | 24 hours |
| Fortnox | 25/second | 1 second |
| QuickBooks | 500/minute | 1 minute |
| Sage | 1000/hour | 1 hour |

## 🔗 Webhooks

Real-time notifications for data changes:

```javascript
// Register webhook
const webhook = await fetch('/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    provider: 'sage',
    url: 'https://your-app.com/webhook',
    events: ['invoice.created', 'invoice.updated', 'payment.received']
  })
});
```

## 📈 Monitoring

Health check endpoint:
```bash
curl https://api.zuno.dev/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "providers": ["xero", "fortnox", "quickbooks", "sage"],
  "features": ["attachments", "bulk_export", "real_time_sync", "webhooks"],
  "version": "2.0.0"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@zuno.dev
- Documentation: https://docs.zuno.dev

---

Built with ❤️ for the accounting integration community
