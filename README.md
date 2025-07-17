# Zuno - Universal Bookkeeping API

A universal API for bookkeeping integrations with full attachment support, following patterns from merge.dev and rutter.com. Perfect for services like midday.ai to export transactions with attachments (receipts/invoices), manage customers, and handle complete bookkeeping workflows.

## Features

- **Universal Integration**: Connect to multiple accounting providers (Xero, Fortnox, QuickBooks Online, etc.)
- **Full Attachment Support**: Upload, download, and manage receipts, invoices, and supporting documents
- **Comprehensive Entities**: Customers, vendors, invoices, bills, transactions, expenses, journal entries, and more
- **Bulk Export**: Export large datasets with attachments in various formats
- **Real-time Sync**: Incremental updates with conflict resolution
- **File Management**: Advanced file handling with R2 storage, checksums, and validation
- **OpenAPI Documentation**: Auto-generated API documentation

## Quick Start

### 1. Authentication

```bash
# Get OAuth URL
curl -X POST https://api.zuno.dev/auth/url \
  -H "Content-Type: application/json" \
  -d   '{
    "provider": "quickbooks",
    "scopes": ["com.intuit.quickbooks.accounting"]
  }'
```

### 2. Sync Customers with Attachments

```bash
# Get customers with attachments
curl -X GET "https://api.zuno.dev/customers?provider=quickbooks&includeAttachments=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Export Transactions with Receipts

```bash
# Get transactions with attachments (perfect for midday.ai)
curl -X GET "https://api.zuno.dev/transactions?provider=xero&includeAttachments=true&dateFrom=2024-01-01T00:00:00Z" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Upload Receipt to Transaction

```bash
# Upload receipt attachment
curl -X POST "https://api.zuno.dev/attachments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@receipt.pdf" \
  -F "entityType=transaction" \
  -F "entityId=txn_123" \
  -F "attachmentType=receipt" \
  -F "description=Expense receipt for office supplies"
```

### 5. Bulk Export with Attachments

```bash
# Export all bookkeeping data with attachments
curl -X POST "https://api.zuno.dev/export/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "provider": "xero",
    "entityTypes": ["customers", "invoices", "transactions", "expenses"],
    "includeAttachments": true,
    "dateRange": {
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-12-31T23:59:59Z"
    },
    "format": "json"
  }'
```

## API Endpoints

### Core Entities

| Endpoint | Description |
|----------|-------------|
| `GET /customers` | List customers with optional attachments |
| `POST /customers` | Create new customer |
| `GET /vendors` | List vendors/suppliers |
| `POST /vendors` | Create new vendor |
| `GET /invoices` | List invoices with line items and attachments |
| `POST /invoices` | Create new invoice |
| `GET /bills` | List bills with attachments |
| `POST /bills` | Create new bill |
| `GET /transactions` | List transactions with attachments |
| `POST /transactions` | Create new transaction |
| `GET /expenses` | List expenses with receipts |
| `POST /expenses` | Create new expense |
| `GET /accounts` | List chart of accounts |
| `GET /items` | List products/services |

### Attachments

| Endpoint | Description |
|----------|-------------|
| `POST /attachments` | Upload file attachment |
| `GET /attachments` | List attachments for entity |
| `DELETE /attachments/{id}` | Delete attachment |
| `GET /attachments/{id}/download` | Download attachment |

### Bulk Operations

| Endpoint | Description |
|----------|-------------|
| `POST /export/bulk` | Bulk export with attachments |
| `GET /export/status/{jobId}` | Check export job status |
| `GET /export/download/{jobId}` | Download export results |

## Supported File Types

### Receipts & Invoices
- **Images**: JPG, PNG, WEBP, TIFF, BMP
- **Documents**: PDF, Word, Excel, CSV, TXT

### Size Limits
- **Images**: 10MB max
- **Documents**: 25MB max
- **Archives**: 100MB max

## Data Models

### Transaction with Attachments
```typescript
{
  "id": "txn_123",
  "type": "expense",
  "description": "Office supplies",
  "amount": 156.78,
  "currency": "USD",
  "date": "2024-01-15T10:30:00Z",
  "accountId": "acc_456",
  "accountName": "Office Expenses",
  "vendorId": "vendor_789",
  "status": "cleared",
  "reconciliationStatus": "reconciled",
  "attachments": [
    {
      "id": "att_001",
      "filename": "receipt.pdf",
      "originalFilename": "office_supplies_receipt.pdf",
      "mimeType": "application/pdf",
      "size": 245760,
      "url": "https://cdn.zuno.dev/attachments/receipt.pdf",
      "downloadUrl": "https://cdn.zuno.dev/attachments/receipt.pdf?download=true",
      "attachmentType": "receipt",
      "description": "Receipt for office supplies purchase"
    }
  ],
  "customFields": {
    "project": "Marketing Campaign Q1",
    "department": "Marketing"
  }
}
```

### Customer with Attachments
```typescript
{
  "id": "cust_123",
  "name": "Acme Corporation",
  "email": "billing@acme.com",
  "addresses": [
    {
      "type": "billing",
      "street": "123 Business St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    }
  ],
  "paymentTerms": "Net 30",
  "attachments": [
    {
      "id": "att_002",
      "filename": "contract.pdf",
      "attachmentType": "contract",
      "description": "Service agreement"
    }
  ]
}
```

### Invoice with Line Items & Attachments
```typescript
{
  "id": "inv_456",
  "number": "INV-2024-001",
  "customerId": "cust_123",
  "customerName": "Acme Corporation",
  "issueDate": "2024-01-01T00:00:00Z",
  "dueDate": "2024-01-31T00:00:00Z",
  "status": "sent",
  "currency": "USD",
  "subtotal": 1000.00,
  "taxTotal": 80.00,
  "total": 1080.00,
  "lineItems": [
    {
      "id": "line_001",
      "description": "Website Development",
      "quantity": 40,
      "unitPrice": 25.00,
      "total": 1000.00,
      "taxRate": 0.08,
      "taxAmount": 80.00
    }
  ],
  "attachments": [
    {
      "id": "att_003",
      "filename": "invoice.pdf",
      "attachmentType": "invoice",
      "description": "Generated invoice PDF"
    }
  ]
}
```

## Use Cases

### For Midday.ai Integration
```bash
# Export transactions with attachments for expense management
curl -X GET "https://api.zuno.dev/transactions?provider=xero&includeAttachments=true&type=expense&dateFrom=2024-01-01T00:00:00Z" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Upload expense receipt
curl -X POST "https://api.zuno.dev/attachments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@expense_receipt.jpg" \
  -F "entityType=expense" \
  -F "entityId=exp_789" \
  -F "attachmentType=receipt"
```

### For Accounting Firms
```bash
# Bulk export all client data with supporting documents
curl -X POST "https://api.zuno.dev/export/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "provider": "xero",
    "entityTypes": ["customers", "vendors", "invoices", "bills", "transactions", "journal_entries"],
    "includeAttachments": true,
    "includeCustomFields": true,
    "format": "json"
  }'
```

### For E-commerce Platforms
```bash
# Sync customers and their purchase history
curl -X GET "https://api.zuno.dev/customers?provider=quickbooks&includeAttachments=true" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create invoice with product attachments
curl -X POST "https://api.zuno.dev/invoices" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customerId": "cust_123",
    "lineItems": [
      {
        "description": "Premium Software License",
        "quantity": 1,
        "unitPrice": 299.99
      }
    ]
  }'
```

## Supported Providers

### Xero
- **Type**: Full accounting ERP
- **Features**: Complete CRUD operations, attachments, transactions, payments
- **Auth**: OAuth 2.0 with PKCE
- **Regions**: Global
- **Capabilities**: `customers`, `vendors`, `invoices`, `bills`, `transactions`, `attachments`, `accounts`, `payments`

### Fortnox
- **Type**: Swedish accounting system
- **Features**: Full CRUD operations, comprehensive bookkeeping
- **Auth**: OAuth 2.0
- **Regions**: Sweden
- **Capabilities**: `customers`, `vendors`, `invoices`, `bills`, `accounts`, `items`, `journal_entries`, `full_crud`

### QuickBooks Online
- **Type**: US market accounting system
- **Features**: Complete accounting suite with attachments, payments, journal entries
- **Auth**: OAuth 2.0 with realmId (tenant isolation)
- **Regions**: United States, Canada, UK, Australia
- **Capabilities**: `customers`, `vendors`, `invoices`, `bills`, `items`, `accounts`, `expenses`, `payments`, `journal_entries`, `attachments`, `full_crud`

### Coming Soon
- **NetSuite** - Enterprise ERP
- **Sage** - UK/Europe accounting

## Error Handling

The API returns structured error responses:

```json
{
  "error": "validation_failed",
  "message": "File size exceeds limit. Maximum size for document files: 25MB",
  "code": "FILE_TOO_LARGE"
}
```

## Rate Limits

- **Standard**: 100 requests/minute
- **Bulk Export**: 5 requests/minute
- **File Upload**: 20 requests/minute

## Webhooks

Real-time notifications for data changes:

```json
{
  "event": "transaction.created",
  "data": {
    "id": "txn_123",
    "type": "expense",
    "amount": 156.78,
    "attachments": [...]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## QuickBooks Online Example

```bash
# 1. Get OAuth URL
curl -X POST https://api.zuno.dev/auth/url \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "quickbooks",
    "scopes": ["com.intuit.quickbooks.accounting"]
  }'

# 2. Exchange code for token
curl -X POST https://api.zuno.dev/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "quickbooks",
    "code": "YOUR_AUTH_CODE"
  }'

# 3. Get customers with attachments
curl -X GET "https://api.zuno.dev/customers?provider=quickbooks&includeAttachments=true" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Create an invoice
curl -X POST https://api.zuno.dev/invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "quickbooks",
    "customerId": "123",
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "lineItems": [
      {
        "description": "Consulting Services",
        "quantity": 10,
        "unitPrice": 150,
        "total": 1500
      }
    ]
  }'

# 5. Get invoice with attachments
curl -X GET "https://api.zuno.dev/invoices/inv_123?provider=quickbooks&includeAttachments=true" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Export transactions for midday.ai
curl -X GET "https://api.zuno.dev/transactions?provider=quickbooks&includeAttachments=true&dateFrom=2024-01-01T00:00:00Z" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Generate types
bun run cf-typegen

# Run database migrations
bun run db:migrate
```

## License

MIT License - see LICENSE file for details.
