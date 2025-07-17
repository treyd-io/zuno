import { CoreProvider, ProviderConfig, ProviderAuth, SyncOptions, SyncResult, RateLimitInfo } from './core'
import { 
  Customer, 
  Vendor, 
  Item, 
  Invoice, 
  Bill, 
  Transaction, 
  Expense, 
  JournalEntry, 
  Payment, 
  Account, 
  Attachment, 
  CompanyInfo,
  BulkExport 
} from '../schemas'

export class SageProvider extends CoreProvider {
  private baseUrl = 'https://api.columbus.sage.com'
  private authUrl = 'https://www.sageone.com/oauth2/auth'
  private tokenUrl = 'https://oauth.sageone.com/oauth2/token'
  
  constructor(config: ProviderConfig) {
    super(config)
    if (config.environment === 'sandbox') {
      this.baseUrl = 'https://api.columbus.sage.com' // Same URL for sandbox
    }
  }

  getAuthUrl(scopes: string[]): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri || '',
      response_type: 'code',
      scope: scopes.join(' ') || 'full_access',
      state: crypto.randomUUID()
    })
    
    return `${this.authUrl}?${params.toString()}`
  }

  async exchangeCodeForToken(code: string): Promise<ProviderAuth> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri || ''
      })
    })

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.statusText}`)
    }

    const data = await response.json() as any
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000)
    }
  }

  async refreshAccessToken(): Promise<ProviderAuth> {
    if (!this.auth?.refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: this.auth.refreshToken
      })
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    const data = await response.json() as any
    
    const newAuth = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000)
    }
    
    this.setAuth(newAuth)
    return newAuth
  }

  async validateAuth(): Promise<boolean> {
    if (!this.auth?.accessToken) {
      return false
    }

    try {
      const response = await this.request('/core/v3.1/businesses')
      return response.ok
    } catch {
      return false
    }
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers as Record<string, string>
    }

    if (this.auth?.accessToken) {
      headers['Authorization'] = `Bearer ${this.auth.accessToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After')
      if (retryAfter) {
        await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000))
        return this.request(endpoint, options)
      }
    }

    // Handle token refresh
    if (response.status === 401 && this.auth?.refreshToken) {
      await this.refreshAccessToken()
      const updatedHeaders = { ...headers }
      updatedHeaders['Authorization'] = `Bearer ${this.auth.accessToken}`
      return fetch(url, { ...options, headers: updatedHeaders })
    }

    return response
  }

  // Transform data to unified format
  private transformContact(sageContact: any): Customer {
    return {
      id: sageContact.id,
      name: sageContact.name,
      displayName: sageContact.display_name || sageContact.name,
      email: sageContact.email,
      website: sageContact.website,
      phone: sageContact.telephone ? {
        number: sageContact.telephone,
        type: 'work' as any
      } : undefined,
      addresses: this.transformAddresses(sageContact.main_address, sageContact.delivery_address),
      taxNumber: sageContact.tax_number,
      currency: sageContact.currency?.iso_code || 'GBP',
      paymentTerms: sageContact.default_payment_terms_template?.name,
      isActive: sageContact.status === 'ACTIVE',
      balance: sageContact.balance,
      creditLimit: sageContact.credit_limit,
      createdAt: sageContact.created_at || new Date().toISOString(),
      updatedAt: sageContact.updated_at || new Date().toISOString()
    }
  }

  private transformSupplier(sageSupplier: any): Vendor {
    return {
      id: sageSupplier.id,
      name: sageSupplier.name,
      displayName: sageSupplier.display_name || sageSupplier.name,
      email: sageSupplier.email,
      website: sageSupplier.website,
      phone: sageSupplier.telephone ? {
        number: sageSupplier.telephone,
        type: 'work' as any
      } : undefined,
      addresses: this.transformAddresses(sageSupplier.main_address, sageSupplier.delivery_address),
      taxNumber: sageSupplier.tax_number,
      currency: sageSupplier.currency?.iso_code || 'GBP',
      paymentTerms: sageSupplier.default_payment_terms_template?.name,
      isActive: sageSupplier.status === 'ACTIVE',
      balance: sageSupplier.balance,
      createdAt: sageSupplier.created_at || new Date().toISOString(),
      updatedAt: sageSupplier.updated_at || new Date().toISOString()
    }
  }

  private transformAddresses(mainAddress?: any, deliveryAddress?: any): any[] {
    const addresses = []
    
    if (mainAddress) {
      addresses.push({
        type: 'billing' as any,
        street: mainAddress.address_line_1,
        street2: mainAddress.address_line_2,
        city: mainAddress.city,
        state: mainAddress.region,
        postalCode: mainAddress.postal_code,
        country: mainAddress.country?.name
      })
    }
    
    if (deliveryAddress && deliveryAddress.id !== mainAddress?.id) {
      addresses.push({
        type: 'shipping' as any,
        street: deliveryAddress.address_line_1,
        street2: deliveryAddress.address_line_2,
        city: deliveryAddress.city,
        state: deliveryAddress.region,
        postalCode: deliveryAddress.postal_code,
        country: deliveryAddress.country?.name
      })
    }
    
    return addresses.filter(addr => addr.street || addr.city)
  }

  private transformInvoice(sageInvoice: any): Invoice {
    return {
      id: sageInvoice.id,
      number: sageInvoice.invoice_number,
      customerId: sageInvoice.contact?.id,
      customerName: sageInvoice.contact?.name,
      issueDate: sageInvoice.date,
      dueDate: sageInvoice.due_date,
      status: this.mapInvoiceStatus(sageInvoice.status),
      currency: sageInvoice.currency?.iso_code || 'GBP',
      subtotal: sageInvoice.net_amount,
      taxTotal: sageInvoice.tax_amount,
      total: sageInvoice.total_amount,
      amountDue: sageInvoice.outstanding_amount,
      reference: sageInvoice.reference,
      notes: sageInvoice.notes,
      lineItems: sageInvoice.invoice_lines?.map((line: any) => ({
        id: line.id,
        itemId: line.product?.id,
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unit_price,
        discount: line.discount_percentage,
        total: line.total_amount,
        taxAmount: line.tax_amount,
        accountId: line.ledger_account?.id
      })) || [],
      createdAt: sageInvoice.created_at || new Date().toISOString(),
      updatedAt: sageInvoice.updated_at || new Date().toISOString()
    }
  }

  private mapInvoiceStatus(status: string): 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'void' {
    switch (status) {
      case 'DRAFT': return 'draft'
      case 'SENT': return 'sent'
      case 'PAID': return 'paid'
      case 'OVERDUE': return 'overdue'
      case 'CANCELLED': return 'cancelled'
      case 'VOID': return 'void'
      default: return 'draft'
    }
  }

  private transformBill(sageBill: any): Bill {
    return {
      id: sageBill.id,
      number: sageBill.invoice_number,
      vendorId: sageBill.contact?.id,
      vendorName: sageBill.contact?.name,
      issueDate: sageBill.date,
      dueDate: sageBill.due_date,
      status: sageBill.status === 'PAID' ? 'paid' as any : 'sent' as any,
      currency: sageBill.currency?.iso_code || 'GBP',
      subtotal: sageBill.net_amount,
      taxTotal: sageBill.tax_amount,
      total: sageBill.total_amount,
      amountDue: sageBill.outstanding_amount,
      reference: sageBill.reference,
      notes: sageBill.notes,
      createdAt: sageBill.created_at || new Date().toISOString(),
      updatedAt: sageBill.updated_at || new Date().toISOString()
    }
  }

  private transformProduct(sageProduct: any): Item {
    return {
      id: sageProduct.id,
      name: sageProduct.item_code,
      code: sageProduct.item_code,
      description: sageProduct.description,
      unitPrice: sageProduct.sales_price,
      currency: 'GBP',
      unit: sageProduct.sales_unit_of_measure?.name,
      isActive: sageProduct.status === 'ACTIVE',
      isSold: sageProduct.item_type === 'STOCK' || sageProduct.item_type === 'SERVICE',
      isPurchased: sageProduct.item_type === 'STOCK',
      quantityOnHand: sageProduct.stock_quantity,
      createdAt: sageProduct.created_at || new Date().toISOString(),
      updatedAt: sageProduct.updated_at || new Date().toISOString()
    }
  }

  private transformAccount(sageAccount: any): Account {
    return {
      id: sageAccount.id,
      name: sageAccount.display_name,
      code: sageAccount.nominal_code,
      description: sageAccount.description,
      accountType: this.mapAccountType(sageAccount.ledger_account_type?.name),
      isActive: sageAccount.status === 'ACTIVE',
      currency: 'GBP',
      balance: sageAccount.balance,
      createdAt: sageAccount.created_at || new Date().toISOString(),
      updatedAt: sageAccount.updated_at || new Date().toISOString()
    }
  }

  private mapAccountType(sageType: string): 'asset' | 'liability' | 'equity' | 'income' | 'expense' | 'accounts_receivable' | 'accounts_payable' | 'bank' | 'credit_card' | 'current_asset' | 'fixed_asset' | 'other_asset' | 'current_liability' | 'long_term_liability' | 'cost_of_goods_sold' | 'other_income' | 'other_expense' {
    switch (sageType?.toLowerCase()) {
      case 'current_asset':
        return 'current_asset'
      case 'fixed_asset':
        return 'fixed_asset'
      case 'bank':
        return 'bank'
      case 'current_liability':
        return 'current_liability'
      case 'long_term_liability':
        return 'long_term_liability'
      case 'equity':
        return 'equity'
      case 'income':
        return 'income'
      case 'expense':
        return 'expense'
      case 'cost_of_sales':
        return 'cost_of_goods_sold'
      default:
        return 'other_asset'
    }
  }

  private transformExpense(sageExpense: any): Expense {
    return {
      id: sageExpense.id,
      amount: sageExpense.total_amount,
      currency: sageExpense.currency?.iso_code || 'GBP',
      date: sageExpense.date,
      description: sageExpense.description || sageExpense.reference,
      categoryId: sageExpense.purchase_invoice_lines?.[0]?.ledger_account?.id,
      categoryName: sageExpense.purchase_invoice_lines?.[0]?.ledger_account?.display_name,
      vendorId: sageExpense.contact?.id,
      vendorName: sageExpense.contact?.name,
      reference: sageExpense.reference,
      status: 'approved' as any,
      createdAt: sageExpense.created_at || new Date().toISOString(),
      updatedAt: sageExpense.updated_at || new Date().toISOString()
    }
  }

  private transformPayment(sagePayment: any): Payment {
    return {
      id: sagePayment.id,
      amount: sagePayment.total_amount,
      currency: sagePayment.currency?.iso_code || 'GBP',
      date: sagePayment.date,
      customerId: sagePayment.contact?.id,
      customerName: sagePayment.contact?.name,
      reference: sagePayment.reference,
      status: 'completed' as any,
      createdAt: sagePayment.created_at || new Date().toISOString(),
      updatedAt: sagePayment.updated_at || new Date().toISOString()
    }
  }

  // Helper methods to transform our data to Sage format
  private contactToSage(contact: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      name: contact.name,
      display_name: contact.displayName || contact.name,
      email: contact.email,
      website: contact.website,
      telephone: contact.phone?.number,
      tax_number: contact.taxNumber,
      main_address: contact.addresses?.[0] ? {
        address_line_1: contact.addresses[0].street,
        address_line_2: contact.addresses[0].street2,
        city: contact.addresses[0].city,
        region: contact.addresses[0].state,
        postal_code: contact.addresses[0].postalCode,
        country: { name: contact.addresses[0].country }
      } : undefined,
      credit_limit: contact.creditLimit
    }
  }

  private supplierToSage(supplier: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      name: supplier.name,
      display_name: supplier.displayName || supplier.name,
      email: supplier.email,
      website: supplier.website,
      telephone: supplier.phone?.number,
      tax_number: supplier.taxNumber,
      main_address: supplier.addresses?.[0] ? {
        address_line_1: supplier.addresses[0].street,
        address_line_2: supplier.addresses[0].street2,
        city: supplier.addresses[0].city,
        region: supplier.addresses[0].state,
        postal_code: supplier.addresses[0].postalCode,
        country: { name: supplier.addresses[0].country }
      } : undefined
    }
  }

  // Company Info
  async getCompanyInfo(): Promise<CompanyInfo> {
    const response = await this.request('/core/v3.1/businesses')
    if (!response.ok) {
      throw new Error(`Failed to get company info: ${response.statusText}`)
    }

    const data = await response.json() as any
    const business = data.$items?.[0]

    return {
      id: business.id,
      name: business.name,
      legalName: business.legal_name || business.name,
      email: business.email,
      phone: business.telephone,
      website: business.website,
      addresses: business.address ? [{
        type: 'billing' as any,
        street: business.address.address_line_1,
        street2: business.address.address_line_2,
        city: business.address.city,
        state: business.address.region,
        postalCode: business.address.postal_code,
        country: business.address.country?.name
      }] : [],
      taxNumber: business.tax_number,
      baseCurrency: business.base_currency?.iso_code || 'GBP',
      createdAt: business.created_at || new Date().toISOString(),
      updatedAt: business.updated_at || new Date().toISOString()
    }
  }

  // Account operations
  async getAccounts(options?: SyncOptions): Promise<SyncResult<Account>> {
    const response = await this.request('/core/v3.1/ledger_accounts')
    if (!response.ok) {
      throw new Error(`Failed to get accounts: ${response.statusText}`)
    }

    const data = await response.json() as any
    const accounts = data.$items?.map(this.transformAccount.bind(this)) || []

    return {
      data: accounts,
      hasMore: false,
      pagination: {
        page: 1,
        limit: accounts.length,
        total: accounts.length,
        hasNext: false
      }
    }
  }

  async getAccount(id: string): Promise<Account> {
    const response = await this.request(`/core/v3.1/ledger_accounts/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get account: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformAccount(data)
  }

  async createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const sageAccount = {
      display_name: account.name,
      nominal_code: account.code,
      description: account.description,
      ledger_account_type: { name: account.accountType }
    }

    const response = await this.request('/core/v3.1/ledger_accounts', {
      method: 'POST',
      body: JSON.stringify(sageAccount)
    })

    if (!response.ok) {
      throw new Error(`Failed to create account: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformAccount(data)
  }

  async updateAccount(id: string, account: Partial<Account>): Promise<Account> {
    const sageAccount: any = {}
    
    if (account.name) sageAccount.display_name = account.name
    if (account.code) sageAccount.nominal_code = account.code
    if (account.description) sageAccount.description = account.description

    const response = await this.request(`/core/v3.1/ledger_accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sageAccount)
    })

    if (!response.ok) {
      throw new Error(`Failed to update account: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformAccount(data)
  }

  async deleteAccount(id: string): Promise<void> {
    const response = await this.request(`/core/v3.1/ledger_accounts/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete account: ${response.statusText}`)
    }
  }

  // Customer operations
  async getCustomers(options?: SyncOptions): Promise<SyncResult<Customer>> {
    let url = '/core/v3.1/contacts?contact_type=CUSTOMER'
    
    if (options?.modifiedSince) {
      url += `&updated_after=${options.modifiedSince.toISOString()}`
    }

    const response = await this.request(url)
    if (!response.ok) {
      throw new Error(`Failed to get customers: ${response.statusText}`)
    }

    const data = await response.json() as any
    const customers = data.$items?.map(this.transformContact.bind(this)) || []

    return {
      data: customers,
      hasMore: false,
      pagination: {
        page: 1,
        limit: customers.length,
        total: customers.length,
        hasNext: false
      }
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await this.request(`/core/v3.1/contacts/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get customer: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformContact(data)
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const sageContact = {
      ...this.contactToSage(customer),
      contact_type: 'CUSTOMER'
    }

    const response = await this.request('/core/v3.1/contacts', {
      method: 'POST',
      body: JSON.stringify(sageContact)
    })

    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformContact(data)
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const sageContact: any = {}
    
    if (customer.name) sageContact.name = customer.name
    if (customer.displayName) sageContact.display_name = customer.displayName
    if (customer.email) sageContact.email = customer.email
    if (customer.website) sageContact.website = customer.website
    if (customer.phone) sageContact.telephone = customer.phone.number
    if (customer.taxNumber) sageContact.tax_number = customer.taxNumber
    if (customer.creditLimit) sageContact.credit_limit = customer.creditLimit
    if (customer.addresses?.[0]) {
      const addr = customer.addresses[0]
      sageContact.main_address = {
        address_line_1: addr.street,
        address_line_2: addr.street2,
        city: addr.city,
        region: addr.state,
        postal_code: addr.postalCode,
        country: { name: addr.country }
      }
    }

    const response = await this.request(`/core/v3.1/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sageContact)
    })

    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformContact(data)
  }

  async deleteCustomer(id: string): Promise<void> {
    const response = await this.request(`/core/v3.1/contacts/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete customer: ${response.statusText}`)
    }
  }

  // Vendor operations
  async getVendors(options?: SyncOptions): Promise<SyncResult<Vendor>> {
    let url = '/core/v3.1/contacts?contact_type=SUPPLIER'
    
    if (options?.modifiedSince) {
      url += `&updated_after=${options.modifiedSince.toISOString()}`
    }

    const response = await this.request(url)
    if (!response.ok) {
      throw new Error(`Failed to get vendors: ${response.statusText}`)
    }

    const data = await response.json() as any
    const vendors = data.$items?.map(this.transformSupplier.bind(this)) || []

    return {
      data: vendors,
      hasMore: false,
      pagination: {
        page: 1,
        limit: vendors.length,
        total: vendors.length,
        hasNext: false
      }
    }
  }

  async getVendor(id: string): Promise<Vendor> {
    const response = await this.request(`/core/v3.1/contacts/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get vendor: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformSupplier(data)
  }

  async createVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vendor> {
    const sageSupplier = {
      ...this.supplierToSage(vendor),
      contact_type: 'SUPPLIER'
    }

    const response = await this.request('/core/v3.1/contacts', {
      method: 'POST',
      body: JSON.stringify(sageSupplier)
    })

    if (!response.ok) {
      throw new Error(`Failed to create vendor: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformSupplier(data)
  }

  async updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor> {
    const sageSupplier: any = {}
    
    if (vendor.name) sageSupplier.name = vendor.name
    if (vendor.displayName) sageSupplier.display_name = vendor.displayName
    if (vendor.email) sageSupplier.email = vendor.email
    if (vendor.website) sageSupplier.website = vendor.website
    if (vendor.phone) sageSupplier.telephone = vendor.phone.number
    if (vendor.taxNumber) sageSupplier.tax_number = vendor.taxNumber
    if (vendor.addresses?.[0]) {
      const addr = vendor.addresses[0]
      sageSupplier.main_address = {
        address_line_1: addr.street,
        address_line_2: addr.street2,
        city: addr.city,
        region: addr.state,
        postal_code: addr.postalCode,
        country: { name: addr.country }
      }
    }

    const response = await this.request(`/core/v3.1/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sageSupplier)
    })

    if (!response.ok) {
      throw new Error(`Failed to update vendor: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformSupplier(data)
  }

  async deleteVendor(id: string): Promise<void> {
    const response = await this.request(`/core/v3.1/contacts/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete vendor: ${response.statusText}`)
    }
  }

  // Item operations
  async getItems(options?: SyncOptions): Promise<SyncResult<Item>> {
    const response = await this.request('/core/v3.1/products')
    if (!response.ok) {
      throw new Error(`Failed to get items: ${response.statusText}`)
    }

    const data = await response.json() as any
    const items = data.$items?.map(this.transformProduct.bind(this)) || []

    return {
      data: items,
      hasMore: false,
      pagination: {
        page: 1,
        limit: items.length,
        total: items.length,
        hasNext: false
      }
    }
  }

  async getItem(id: string): Promise<Item> {
    const response = await this.request(`/core/v3.1/products/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get item: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformProduct(data)
  }

  async createItem(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const sageProduct = {
      item_code: item.code,
      description: item.description,
      sales_price: item.unitPrice,
      item_type: item.isSold ? 'SERVICE' : 'STOCK'
    }

    const response = await this.request('/core/v3.1/products', {
      method: 'POST',
      body: JSON.stringify(sageProduct)
    })

    if (!response.ok) {
      throw new Error(`Failed to create item: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformProduct(data)
  }

  async updateItem(id: string, item: Partial<Item>): Promise<Item> {
    const sageProduct: any = {}
    
    if (item.code) sageProduct.item_code = item.code
    if (item.description) sageProduct.description = item.description
    if (item.unitPrice) sageProduct.sales_price = item.unitPrice

    const response = await this.request(`/core/v3.1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sageProduct)
    })

    if (!response.ok) {
      throw new Error(`Failed to update item: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformProduct(data)
  }

  async deleteItem(id: string): Promise<void> {
    const response = await this.request(`/core/v3.1/products/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`)
    }
  }

  // Invoice operations
  async getInvoices(options?: SyncOptions): Promise<SyncResult<Invoice>> {
    let url = '/core/v3.1/sales_invoices'
    
    if (options?.modifiedSince) {
      url += `?updated_after=${options.modifiedSince.toISOString()}`
    }

    const response = await this.request(url)
    if (!response.ok) {
      throw new Error(`Failed to get invoices: ${response.statusText}`)
    }

    const data = await response.json() as any
    const invoices = data.$items?.map(this.transformInvoice.bind(this)) || []

    return {
      data: invoices,
      hasMore: false,
      pagination: {
        page: 1,
        limit: invoices.length,
        total: invoices.length,
        hasNext: false
      }
    }
  }

  async getInvoice(id: string): Promise<Invoice> {
    const response = await this.request(`/core/v3.1/sales_invoices/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get invoice: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformInvoice(data)
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const sageInvoice = {
      contact: { id: invoice.customerId },
      date: invoice.issueDate,
      due_date: invoice.dueDate,
      reference: invoice.reference,
      notes: invoice.notes,
      invoice_lines: invoice.lineItems?.map(item => ({
        description: item.description,
        product: item.itemId ? { id: item.itemId } : undefined,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount_percentage: item.discount
      })) || []
    }

    const response = await this.request('/core/v3.1/sales_invoices', {
      method: 'POST',
      body: JSON.stringify(sageInvoice)
    })

    if (!response.ok) {
      throw new Error(`Failed to create invoice: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformInvoice(data)
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    const sageInvoice: any = {}
    
    if (invoice.customerId) sageInvoice.contact = { id: invoice.customerId }
    if (invoice.issueDate) sageInvoice.date = invoice.issueDate
    if (invoice.dueDate) sageInvoice.due_date = invoice.dueDate
    if (invoice.reference) sageInvoice.reference = invoice.reference
    if (invoice.notes) sageInvoice.notes = invoice.notes
    if (invoice.lineItems) {
      sageInvoice.invoice_lines = invoice.lineItems.map(item => ({
        description: item.description,
        product: item.itemId ? { id: item.itemId } : undefined,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount_percentage: item.discount
      }))
    }

    const response = await this.request(`/core/v3.1/sales_invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sageInvoice)
    })

    if (!response.ok) {
      throw new Error(`Failed to update invoice: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformInvoice(data)
  }

  async deleteInvoice(id: string): Promise<void> {
    const response = await this.request(`/core/v3.1/sales_invoices/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete invoice: ${response.statusText}`)
    }
  }

  async sendInvoice(id: string, options?: { email?: string; subject?: string; message?: string }): Promise<void> {
    const emailData = {
      to: options?.email,
      subject: options?.subject || 'Invoice',
      message: options?.message || 'Please find attached invoice'
    }

    const response = await this.request(`/core/v3.1/sales_invoices/${id}/email`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      throw new Error(`Failed to send invoice: ${response.statusText}`)
    }
  }

  // Bill operations
  async getBills(options?: SyncOptions): Promise<SyncResult<Bill>> {
    const response = await this.request('/core/v3.1/purchase_invoices')
    if (!response.ok) {
      throw new Error(`Failed to get bills: ${response.statusText}`)
    }

    const data = await response.json() as any
    const bills = data.$items?.map(this.transformBill.bind(this)) || []

    return {
      data: bills,
      hasMore: false,
      pagination: {
        page: 1,
        limit: bills.length,
        total: bills.length,
        hasNext: false
      }
    }
  }

  async getBill(id: string): Promise<Bill> {
    const response = await this.request(`/core/v3.1/purchase_invoices/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get bill: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformBill(data)
  }

  async createBill(bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bill> {
    const sageBill = {
      contact: { id: bill.vendorId },
      date: bill.issueDate,
      due_date: bill.dueDate,
      reference: bill.reference,
      notes: bill.notes,
      total_amount: bill.total
    }

    const response = await this.request('/core/v3.1/purchase_invoices', {
      method: 'POST',
      body: JSON.stringify(sageBill)
    })

    if (!response.ok) {
      throw new Error(`Failed to create bill: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformBill(data)
  }

  async updateBill(id: string, bill: Partial<Bill>): Promise<Bill> {
    const sageBill: any = {}
    
    if (bill.vendorId) sageBill.contact = { id: bill.vendorId }
    if (bill.issueDate) sageBill.date = bill.issueDate
    if (bill.dueDate) sageBill.due_date = bill.dueDate
    if (bill.reference) sageBill.reference = bill.reference
    if (bill.notes) sageBill.notes = bill.notes
    if (bill.total) sageBill.total_amount = bill.total

    const response = await this.request(`/core/v3.1/purchase_invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sageBill)
    })

    if (!response.ok) {
      throw new Error(`Failed to update bill: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformBill(data)
  }

  async deleteBill(id: string): Promise<void> {
    const response = await this.request(`/core/v3.1/purchase_invoices/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete bill: ${response.statusText}`)
    }
  }

  // Transaction operations (Limited)
  async getTransactions(options?: SyncOptions): Promise<SyncResult<Transaction>> {
    // Sage doesn't have a direct transactions endpoint
    return {
      data: [],
      hasMore: false,
      pagination: {
        page: 1,
        limit: 0,
        total: 0,
        hasNext: false
      }
    }
  }

  async getTransaction(id: string): Promise<Transaction> {
    throw new Error('Direct transaction operations not supported by Sage API')
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    throw new Error('Direct transaction operations not supported by Sage API')
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    throw new Error('Direct transaction operations not supported by Sage API')
  }

  async deleteTransaction(id: string): Promise<void> {
    throw new Error('Direct transaction operations not supported by Sage API')
  }

  async reconcileTransaction(id: string, bankTransactionId: string): Promise<Transaction> {
    throw new Error('Direct transaction operations not supported by Sage API')
  }

  // Expense operations
  async getExpenses(options?: SyncOptions): Promise<SyncResult<Expense>> {
    const response = await this.request('/core/v3.1/purchase_invoices?expense=true')
    if (!response.ok) {
      throw new Error(`Failed to get expenses: ${response.statusText}`)
    }

    const data = await response.json() as any
    const expenses = data.$items?.map(this.transformExpense.bind(this)) || []

    return {
      data: expenses,
      hasMore: false,
      pagination: {
        page: 1,
        limit: expenses.length,
        total: expenses.length,
        hasNext: false
      }
    }
  }

  async getExpense(id: string): Promise<Expense> {
    const response = await this.request(`/core/v3.1/purchase_invoices/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get expense: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformExpense(data)
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const sageExpense = {
      contact: expense.vendorId ? { id: expense.vendorId } : undefined,
      date: expense.date,
      total_amount: expense.amount,
      description: expense.description,
      reference: expense.reference
    }

    const response = await this.request('/core/v3.1/purchase_invoices', {
      method: 'POST',
      body: JSON.stringify(sageExpense)
    })

    if (!response.ok) {
      throw new Error(`Failed to create expense: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformExpense(data)
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    const sageExpense: any = {}
    
    if (expense.vendorId) sageExpense.contact = { id: expense.vendorId }
    if (expense.date) sageExpense.date = expense.date
    if (expense.amount) sageExpense.total_amount = expense.amount
    if (expense.description) sageExpense.description = expense.description
    if (expense.reference) sageExpense.reference = expense.reference

    const response = await this.request(`/core/v3.1/purchase_invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sageExpense)
    })

    if (!response.ok) {
      throw new Error(`Failed to update expense: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformExpense(data)
  }

  async deleteExpense(id: string): Promise<void> {
    const response = await this.request(`/core/v3.1/purchase_invoices/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete expense: ${response.statusText}`)
    }
  }

  async submitExpense(id: string): Promise<Expense> {
    // Sage doesn't have expense submission workflow
    return await this.getExpense(id)
  }

  async approveExpense(id: string): Promise<Expense> {
    // Sage doesn't have expense approval workflow
    return await this.getExpense(id)
  }

  async rejectExpense(id: string, reason?: string): Promise<Expense> {
    // Sage doesn't have expense rejection workflow
    return await this.getExpense(id)
  }

  // Journal Entry operations
  async getJournalEntries(options?: SyncOptions): Promise<SyncResult<JournalEntry>> {
    const response = await this.request('/core/v3.1/journal_entries')
    if (!response.ok) {
      throw new Error(`Failed to get journal entries: ${response.statusText}`)
    }

    const data = await response.json() as any
    const journalEntries = data.$items?.map((entry: any) => ({
      id: entry.id,
      number: entry.reference,
      date: entry.date,
      description: entry.description,
      reference: entry.reference,
      status: 'posted' as any,
      currency: 'GBP',
      createdAt: entry.created_at || new Date().toISOString(),
      updatedAt: entry.updated_at || new Date().toISOString()
    })) || []

    return {
      data: journalEntries,
      hasMore: false,
      pagination: {
        page: 1,
        limit: journalEntries.length,
        total: journalEntries.length,
        hasNext: false
      }
    }
  }

  async getJournalEntry(id: string): Promise<JournalEntry> {
    const response = await this.request(`/core/v3.1/journal_entries/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get journal entry: ${response.statusText}`)
    }

    const data = await response.json() as any

    return {
      id: data.id,
      number: data.reference,
      date: data.date,
      description: data.description,
      reference: data.reference,
      status: 'posted' as any,
      currency: 'GBP',
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString()
    }
  }

  async createJournalEntry(journalEntry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
    const sageJournalEntry = {
      date: journalEntry.date,
      reference: journalEntry.reference,
      description: journalEntry.description,
      journal_lines: journalEntry.journalRows?.map(row => ({
        ledger_account: { id: row.accountId },
        debit: row.debit,
        credit: row.credit,
        description: row.description
      })) || []
    }

    const response = await this.request('/core/v3.1/journal_entries', {
      method: 'POST',
      body: JSON.stringify(sageJournalEntry)
    })

    if (!response.ok) {
      throw new Error(`Failed to create journal entry: ${response.statusText}`)
    }

    const data = await response.json() as any

    return {
      id: data.id,
      number: data.reference,
      date: data.date,
      description: data.description,
      reference: data.reference,
      status: 'posted' as any,
      currency: 'GBP',
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString()
    }
  }

  async updateJournalEntry(id: string, journalEntry: Partial<JournalEntry>): Promise<JournalEntry> {
    const sageJournalEntry: any = {}
    
    if (journalEntry.date) sageJournalEntry.date = journalEntry.date
    if (journalEntry.reference) sageJournalEntry.reference = journalEntry.reference
    if (journalEntry.description) sageJournalEntry.description = journalEntry.description
    if (journalEntry.journalRows) {
      sageJournalEntry.journal_lines = journalEntry.journalRows.map(row => ({
        ledger_account: { id: row.accountId },
        debit: row.debit,
        credit: row.credit,
        description: row.description
      }))
    }

    const response = await this.request(`/core/v3.1/journal_entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sageJournalEntry)
    })

    if (!response.ok) {
      throw new Error(`Failed to update journal entry: ${response.statusText}`)
    }

    const data = await response.json() as any

    return {
      id: data.id,
      number: data.reference,
      date: data.date,
      description: data.description,
      reference: data.reference,
      status: 'posted' as any,
      currency: 'GBP',
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString()
    }
  }

  async deleteJournalEntry(id: string): Promise<void> {
    const response = await this.request(`/core/v3.1/journal_entries/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete journal entry: ${response.statusText}`)
    }
  }

  async postJournalEntry(id: string): Promise<JournalEntry> {
    // Sage journal entries are automatically posted
    return await this.getJournalEntry(id)
  }

  // Payment operations
  async getPayments(options?: SyncOptions): Promise<SyncResult<Payment>> {
    const response = await this.request('/core/v3.1/sales_receipts')
    if (!response.ok) {
      throw new Error(`Failed to get payments: ${response.statusText}`)
    }

    const data = await response.json() as any
    const payments = data.$items?.map(this.transformPayment.bind(this)) || []

    return {
      data: payments,
      hasMore: false,
      pagination: {
        page: 1,
        limit: payments.length,
        total: payments.length,
        hasNext: false
      }
    }
  }

  async getPayment(id: string): Promise<Payment> {
    const response = await this.request(`/core/v3.1/sales_receipts/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get payment: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformPayment(data)
  }

  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const sagePayment = {
      contact: { id: payment.customerId },
      date: payment.date,
      total_amount: payment.amount,
      reference: payment.reference
    }

    const response = await this.request('/core/v3.1/sales_receipts', {
      method: 'POST',
      body: JSON.stringify(sagePayment)
    })

    if (!response.ok) {
      throw new Error(`Failed to create payment: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformPayment(data)
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    const sagePayment: any = {}
    
    if (payment.customerId) sagePayment.contact = { id: payment.customerId }
    if (payment.date) sagePayment.date = payment.date
    if (payment.amount) sagePayment.total_amount = payment.amount
    if (payment.reference) sagePayment.reference = payment.reference

    const response = await this.request(`/core/v3.1/sales_receipts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sagePayment)
    })

    if (!response.ok) {
      throw new Error(`Failed to update payment: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformPayment(data)
  }

  async deletePayment(id: string): Promise<void> {
    const response = await this.request(`/core/v3.1/sales_receipts/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete payment: ${response.statusText}`)
    }
  }

  async processPayment(id: string): Promise<Payment> {
    // Sage payments are automatically processed
    return await this.getPayment(id)
  }

  // Attachment operations
  async getAttachments(entityType: string, entityId: string, attachmentType?: string): Promise<Attachment[]> {
    const response = await this.request(`/core/v3.1/attachments?entity_type=${entityType}&entity_id=${entityId}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get attachments: ${response.statusText}`)
    }

    const data = await response.json() as any
    return data.$items?.map((att: any) => ({
      id: att.id,
      filename: att.file_name,
      originalFilename: att.file_name,
      mimeType: att.mime_type,
      size: att.file_size,
      url: att.download_url,
      downloadUrl: att.download_url,
      entityType: entityType as any,
      entityId,
      description: att.description,
      createdAt: att.created_at || new Date().toISOString(),
      updatedAt: att.updated_at || new Date().toISOString()
    })) || []
  }

  async getAttachment(id: string): Promise<Attachment> {
    const response = await this.request(`/core/v3.1/attachments/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get attachment: ${response.statusText}`)
    }

    const data = await response.json() as any

    return {
      id: data.id,
      filename: data.file_name,
      originalFilename: data.file_name,
      mimeType: data.mime_type,
      size: data.file_size,
      url: data.download_url,
      downloadUrl: data.download_url,
      entityType: 'invoice' as any, // Default
      entityId: data.entity_id,
      description: data.description,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString()
    }
  }

  async downloadAttachment(id: string): Promise<ReadableStream | null> {
    const attachment = await this.getAttachment(id)
    
    if (!attachment.downloadUrl) {
      return null
    }

    const response = await fetch(attachment.downloadUrl)
    
    if (!response.ok) {
      return null
    }

    return response.body
  }

  async getAttachmentMetadata(id: string): Promise<any> {
    const attachment = await this.getAttachment(id)
    return {
      id: attachment.id,
      filename: attachment.filename,
      mimeType: attachment.mimeType,
      size: attachment.size,
      url: attachment.url,
      description: attachment.description
    }
  }

  // Bulk operations
  async bulkCreate<T>(entityType: string, entities: T[]): Promise<{ success: T[]; failed: { entity: T; error: string }[] }> {
    const success: T[] = []
    const failed: { entity: T; error: string }[] = []

    for (const entity of entities) {
      try {
        let result: any
        switch (entityType) {
          case 'customers':
            result = await this.createCustomer(entity as any)
            break
          case 'vendors':
            result = await this.createVendor(entity as any)
            break
          case 'invoices':
            result = await this.createInvoice(entity as any)
            break
          case 'bills':
            result = await this.createBill(entity as any)
            break
          case 'items':
            result = await this.createItem(entity as any)
            break
          case 'accounts':
            result = await this.createAccount(entity as any)
            break
          case 'expenses':
            result = await this.createExpense(entity as any)
            break
          case 'payments':
            result = await this.createPayment(entity as any)
            break
          case 'journal_entries':
            result = await this.createJournalEntry(entity as any)
            break
          default:
            throw new Error(`Bulk creation not supported for entity type: ${entityType}`)
        }
        success.push(result)
      } catch (error) {
        failed.push({ entity, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return { success, failed }
  }

  async bulkUpdate<T>(entityType: string, entities: { id: string; data: Partial<T> }[]): Promise<{ success: T[]; failed: { id: string; error: string }[] }> {
    const success: T[] = []
    const failed: { id: string; error: string }[] = []

    for (const { id, data } of entities) {
      try {
        let result: any
        switch (entityType) {
          case 'customers':
            result = await this.updateCustomer(id, data as any)
            break
          case 'vendors':
            result = await this.updateVendor(id, data as any)
            break
          case 'invoices':
            result = await this.updateInvoice(id, data as any)
            break
          case 'bills':
            result = await this.updateBill(id, data as any)
            break
          case 'items':
            result = await this.updateItem(id, data as any)
            break
          case 'accounts':
            result = await this.updateAccount(id, data as any)
            break
          case 'expenses':
            result = await this.updateExpense(id, data as any)
            break
          case 'payments':
            result = await this.updatePayment(id, data as any)
            break
          case 'journal_entries':
            result = await this.updateJournalEntry(id, data as any)
            break
          default:
            throw new Error(`Bulk update not supported for entity type: ${entityType}`)
        }
        success.push(result)
      } catch (error) {
        failed.push({ id, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return { success, failed }
  }

  async bulkDelete(entityType: string, ids: string[]): Promise<{ success: string[]; failed: { id: string; error: string }[] }> {
    const success: string[] = []
    const failed: { id: string; error: string }[] = []

    for (const id of ids) {
      try {
        switch (entityType) {
          case 'customers':
            await this.deleteCustomer(id)
            break
          case 'vendors':
            await this.deleteVendor(id)
            break
          case 'invoices':
            await this.deleteInvoice(id)
            break
          case 'bills':
            await this.deleteBill(id)
            break
          case 'items':
            await this.deleteItem(id)
            break
          case 'accounts':
            await this.deleteAccount(id)
            break
          case 'expenses':
            await this.deleteExpense(id)
            break
          case 'payments':
            await this.deletePayment(id)
            break
          case 'journal_entries':
            await this.deleteJournalEntry(id)
            break
          default:
            throw new Error(`Bulk deletion not supported for entity type: ${entityType}`)
        }
        success.push(id)
      } catch (error) {
        failed.push({ id, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return { success, failed }
  }

  // Export operations
  async startBulkExport(request: BulkExport): Promise<string> {
    const jobId = crypto.randomUUID()
    // In a real implementation, this would queue a job
    return jobId
  }

  async getExportStatus(jobId: string): Promise<any> {
    return {
      jobId,
      status: 'completed',
      progress: 100
    }
  }

  async getExportResult(jobId: string): Promise<any> {
    throw new Error('Export result retrieval not implemented yet')
  }

  async getRateLimitInfo(): Promise<RateLimitInfo> {
    return {
      remaining: 1000, // Sage typically allows 1000 requests per hour
      reset: new Date(Date.now() + 3600000),
      limit: 1000
    }
  }

  getProviderInfo(): { name: string; version: string; capabilities: string[] } {
    return {
      name: 'Sage Business Cloud Accounting',
      version: '3.1',
      capabilities: ['customers', 'vendors', 'invoices', 'bills', 'items', 'accounts', 'expenses', 'payments', 'journal_entries', 'attachments', 'full_crud']
    }
  }
} 