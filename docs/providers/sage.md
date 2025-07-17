# Sage Business Cloud Accounting Provider

Sage Business Cloud Accounting is a comprehensive cloud-based accounting solution designed for small and medium-sized businesses, particularly popular in the UK and European markets.

## Overview

- **Provider**: Sage Business Cloud Accounting
- **Region**: UK, Ireland, and European markets
- **Authentication**: OAuth 2.0
- **Base URL**: `https://api.columbus.sage.com`
- **Rate Limits**: 1000 requests per hour
- **Webhook Support**: Yes
- **Bulk Operations**: Supported

## Authentication

### OAuth 2.0 Flow

1. **Authorization URL**:
   ```
   https://www.sageone.com/oauth2/auth
   ```

2. **Token URL**:
   ```
   https://oauth.sageone.com/oauth2/token
   ```

3. **Scopes**:
   - `full_access` - Complete access to all accounting data
   - `read_only` - Read-only access to accounting data

### Example Authentication Flow

```javascript
// Step 1: Get authorization URL
const authUrl = await fetch('/auth/url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'sage',
    scopes: ['full_access'],
    redirectUri: 'https://your-app.com/callback'
  })
});

// Step 2: Exchange code for tokens
const tokens = await fetch('/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'sage',
    code: 'authorization_code_from_callback'
  })
});
```

## Supported Entities

### Core Entities

| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| **Customers** | ✅ | ✅ | ✅ | ✅ | Full CRUD support |
| **Vendors** | ✅ | ✅ | ✅ | ✅ | Called "Suppliers" in Sage |
| **Invoices** | ✅ | ✅ | ✅ | ✅ | Sales invoices with line items |
| **Bills** | ✅ | ✅ | ✅ | ✅ | Purchase invoices |
| **Items** | ✅ | ✅ | ✅ | ✅ | Products and services |
| **Accounts** | ✅ | ✅ | ✅ | ✅ | Chart of accounts |
| **Expenses** | ✅ | ✅ | ✅ | ✅ | Expense management |
| **Payments** | ✅ | ✅ | ✅ | ✅ | Payment processing |
| **Journal Entries** | ✅ | ✅ | ✅ | ✅ | Manual journal entries |
| **Attachments** | ❌ | ✅ | ❌ | ❌ | Read-only via proxy |

### Attachment Support

Sage supports attachments through their native API:
- **Download**: Direct download via attachment URLs
- **Metadata**: Full attachment metadata including file size, type, description
- **Entity Links**: Attachments linked to invoices, bills, and other entities
- **File Types**: PDF, images, documents

## API Examples

### Customers

#### List Customers
```javascript
const customers = await fetch('/customers?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Create Customer
```javascript
const customer = await fetch('/customers?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Acme Corporation',
    displayName: 'Acme Corp',
    email: 'contact@acme.com',
    phone: { number: '+44 20 7123 4567', type: 'work' },
    addresses: [{
      type: 'billing',
      street: '123 Business Street',
      city: 'London',
      state: 'England',
      postalCode: 'SW1A 1AA',
      country: 'United Kingdom'
    }],
    taxNumber: 'GB123456789',
    currency: 'GBP',
    creditLimit: 10000
  })
});
```

### Invoices

#### List Invoices
```javascript
const invoices = await fetch('/invoices?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
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
    currency: 'GBP',
    reference: 'INV-2024-001',
    lineItems: [{
      description: 'Consulting Services',
      quantity: 10,
      unitPrice: 150.00,
      total: 1500.00
    }],
    notes: 'Payment terms: Net 30 days'
  })
});
```

#### Send Invoice
```javascript
const result = await fetch('/invoices/inv-123/send?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'customer@example.com',
    subject: 'Invoice INV-2024-001',
    message: 'Please find attached your invoice.'
  })
});
```

### Vendors (Suppliers)

#### List Vendors
```javascript
const vendors = await fetch('/vendors?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Create Vendor
```javascript
const vendor = await fetch('/vendors?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Office Supplies Ltd',
    displayName: 'Office Supplies',
    email: 'orders@officesupplies.com',
    phone: { number: '+44 20 7987 6543', type: 'work' },
    addresses: [{
      type: 'billing',
      street: '456 Supply Street',
      city: 'Manchester',
      state: 'England',
      postalCode: 'M1 2AB',
      country: 'United Kingdom'
    }],
    taxNumber: 'GB987654321',
    currency: 'GBP'
  })
});
```

### Bills

#### List Bills
```javascript
const bills = await fetch('/bills?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Create Bill
```javascript
const bill = await fetch('/bills?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    vendorId: 'vendor-456',
    issueDate: '2024-01-10',
    dueDate: '2024-02-10',
    currency: 'GBP',
    reference: 'BILL-2024-001',
    total: 500.00,
    notes: 'Monthly office supplies'
  })
});
```

### Items

#### List Items
```javascript
const items = await fetch('/items?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Create Item
```javascript
const item = await fetch('/items?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Business Consultancy',
    code: 'CONS-001',
    description: 'Professional business consulting services',
    unitPrice: 150.00,
    currency: 'GBP',
    unit: 'hour',
    isSold: true,
    isPurchased: false
  })
});
```

### Accounts

#### List Accounts
```javascript
const accounts = await fetch('/accounts?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Create Account
```javascript
const account = await fetch('/accounts?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Professional Services Income',
    code: '4100',
    description: 'Income from professional consulting services',
    accountType: 'income',
    currency: 'GBP'
  })
});
```

### Expenses

#### List Expenses
```javascript
const expenses = await fetch('/expenses?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Create Expense
```javascript
const expense = await fetch('/expenses?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 85.50,
    currency: 'GBP',
    date: '2024-01-15',
    description: 'Client lunch meeting',
    categoryId: 'acc-789',
    vendorId: 'vendor-123',
    reference: 'EXP-2024-001'
  })
});
```

### Payments

#### List Payments
```javascript
const payments = await fetch('/payments?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Create Payment
```javascript
const payment = await fetch('/payments?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerId: 'customer-123',
    amount: 1500.00,
    currency: 'GBP',
    date: '2024-01-20',
    reference: 'PAY-2024-001'
  })
});
```

### Journal Entries

#### List Journal Entries
```javascript
const journalEntries = await fetch('/journal-entries?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Create Journal Entry
```javascript
const journalEntry = await fetch('/journal-entries?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: '2024-01-15',
    reference: 'JE-2024-001',
    description: 'Monthly depreciation adjustment',
    journalRows: [
      {
        accountId: 'acc-100',
        description: 'Depreciation expense',
        debit: 500.00,
        credit: 0
      },
      {
        accountId: 'acc-101',
        description: 'Accumulated depreciation',
        debit: 0,
        credit: 500.00
      }
    ]
  })
});
```

### Attachments

#### List Attachments
```javascript
const attachments = await fetch('/attachments?provider=sage&entityType=invoice&entityId=inv-123', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Get Attachment
```javascript
const attachment = await fetch('/attachments/att-456?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

#### Download Attachment
```javascript
const fileStream = await fetch('/attachments/att-456/download?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

## Bulk Operations

### Bulk Export
```javascript
const exportJob = await fetch('/export', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    provider: 'sage',
    entities: ['customers', 'invoices', 'bills', 'expenses', 'attachments'],
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31'
    },
    includeAttachments: true,
    format: 'json'
  })
});
```

### Bulk Create
```javascript
const result = await fetch('/bulk/customers?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    entities: [
      {
        name: 'Customer 1',
        email: 'customer1@example.com',
        currency: 'GBP'
      },
      {
        name: 'Customer 2',
        email: 'customer2@example.com',
        currency: 'GBP'
      }
    ]
  })
});
```

## Error Handling

Sage API returns structured error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request is invalid",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Invalid or expired token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `DUPLICATE_ENTRY` - Duplicate record

## Rate Limiting

Sage implements rate limiting:
- **Limit**: 1000 requests per hour
- **Reset**: Hourly reset window
- **Headers**: 
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

## Webhooks

Sage supports webhooks for real-time notifications:

### Supported Events
- `invoice.created`
- `invoice.updated`
- `invoice.deleted`
- `customer.created`
- `customer.updated`
- `payment.created`
- `payment.updated`

### Webhook Registration
```javascript
const webhook = await fetch('/webhooks?provider=sage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://your-app.com/webhook',
    events: ['invoice.created', 'invoice.updated', 'payment.created']
  })
});
```

## Data Mapping

### Sage to Unified Schema

| Sage Field | Unified Field | Notes |
|------------|---------------|-------|
| `contact.name` | `name` | Customer/vendor name |
| `contact.display_name` | `displayName` | Display name |
| `contact.email` | `email` | Email address |
| `contact.telephone` | `phone.number` | Phone number |
| `contact.tax_number` | `taxNumber` | VAT/tax number |
| `sales_invoice.date` | `issueDate` | Invoice date |
| `sales_invoice.due_date` | `dueDate` | Payment due date |
| `sales_invoice.total_amount` | `total` | Total amount |
| `sales_invoice.outstanding_amount` | `amountDue` | Outstanding balance |
| `product.item_code` | `code` | Item code |
| `product.description` | `description` | Item description |
| `product.sales_price` | `unitPrice` | Unit price |

### Currency Handling

Sage primarily uses GBP (British Pounds) but supports multi-currency:
- Default currency: `GBP`
- Supported currencies: `GBP`, `EUR`, `USD`
- Currency conversion: Handled by Sage

## Best Practices

### 1. Error Handling
```javascript
try {
  const response = await fetch('/customers?provider=sage', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Sage API Error:', error);
    throw new Error(error.message);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Request failed:', error);
  throw error;
}
```

### 2. Rate Limit Management
```javascript
const rateLimitInfo = await fetch('/rate-limit?provider=sage', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

const { remaining, reset } = await rateLimitInfo.json();

if (remaining < 10) {
  console.warn('Rate limit approaching, consider slowing down requests');
}
```

### 3. Incremental Sync
```javascript
// Sync data modified since last sync
const lastSync = '2024-01-01T00:00:00Z';
const customers = await fetch(`/customers?provider=sage&modifiedSince=${lastSync}`, {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

### 4. Batch Operations
```javascript
// Process in batches to avoid rate limits
const batchSize = 50;
const allCustomers = [];

for (let i = 0; i < customers.length; i += batchSize) {
  const batch = customers.slice(i, i + batchSize);
  const result = await fetch('/bulk/customers?provider=sage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ entities: batch })
  });
  
  allCustomers.push(...result.success);
  
  // Wait to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

## Limitations

1. **Direct Transaction Access**: Sage doesn't provide direct transaction endpoints
2. **Attachment Upload**: Only read-only attachment access (no upload via API)
3. **Historical Data**: Limited historical data access (typically 7 years)
4. **Concurrent Requests**: Limited concurrent request handling
5. **Region Restrictions**: Primarily UK/EU focused

## Support

For Sage-specific issues:
- **Sage Developer Portal**: https://developer.sage.com
- **API Documentation**: https://developer.sage.com/docs
- **Support**: https://support.sage.com

## Migration Guide

### From Sage 50 Desktop
1. Export data from Sage 50
2. Import into Sage Business Cloud
3. Configure API access
4. Test integrations

### From Other Providers
1. Map entities to Sage schema
2. Convert currency to GBP if needed
3. Adjust date formats
4. Test all CRUD operations

This comprehensive documentation should help you integrate with Sage Business Cloud Accounting effectively through the Zuno API. 