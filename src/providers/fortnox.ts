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

export class FortnoxProvider extends CoreProvider {
  private baseUrl = 'https://api.fortnox.se/3'
  
  constructor(config: ProviderConfig) {
    super(config)
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl
    }
  }

  getAuthUrl(scopes: string[], state: string): string {
    // Fortnox uses a different OAuth2 flow
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri || '',
      scope: scopes.join(' '),
      state: state
    })
    
    return `https://apps.fortnox.se/oauth-v1/auth?${params.toString()}`
  }

  async exchangeCodeForToken(code: string): Promise<ProviderAuth> {
    const response = await fetch('https://apps.fortnox.se/oauth-v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`
      },
      body: new URLSearchParams({
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

    const response = await fetch('https://apps.fortnox.se/oauth-v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`
      },
      body: new URLSearchParams({
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
      const response = await this.request('/companyinformation')
      return response.ok
    } catch {
      return false
    }
  }

  // Transform data to unified format
  private transformCustomer(fortnoxCustomer: any): Customer {
    return {
      id: fortnoxCustomer.CustomerNumber,
      name: fortnoxCustomer.Name,
      displayName: fortnoxCustomer.Name,
      email: fortnoxCustomer.Email,
      website: fortnoxCustomer.WWW,
      phone: fortnoxCustomer.Phone1 ? {
        number: fortnoxCustomer.Phone1,
        type: 'work' as any
      } : undefined,
      addresses: [{
        type: 'billing' as any,
        street: fortnoxCustomer.Address1,
        street2: fortnoxCustomer.Address2,
        city: fortnoxCustomer.City,
        postalCode: fortnoxCustomer.ZipCode,
        country: fortnoxCustomer.Country
      }].filter(addr => addr.street || addr.city),
      taxNumber: fortnoxCustomer.OrganisationNumber,
      currency: fortnoxCustomer.Currency || 'SEK',
      paymentTerms: fortnoxCustomer.TermsOfPayment,
      isActive: fortnoxCustomer.Active,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private transformVendor(fortnoxSupplier: any): Vendor {
    return {
      id: fortnoxSupplier.SupplierNumber,
      name: fortnoxSupplier.Name,
      displayName: fortnoxSupplier.Name,
      email: fortnoxSupplier.Email,
      website: fortnoxSupplier.WWW,
      phone: fortnoxSupplier.Phone1 ? {
        number: fortnoxSupplier.Phone1,
        type: 'work' as any
      } : undefined,
      addresses: [{
        type: 'billing' as any,
        street: fortnoxSupplier.Address1,
        street2: fortnoxSupplier.Address2,
        city: fortnoxSupplier.City,
        postalCode: fortnoxSupplier.ZipCode,
        country: fortnoxSupplier.Country
      }].filter(addr => addr.street || addr.city),
      taxNumber: fortnoxSupplier.OrganisationNumber,
      currency: fortnoxSupplier.Currency || 'SEK',
      paymentTerms: fortnoxSupplier.TermsOfPayment,
      isActive: fortnoxSupplier.Active,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private transformInvoice(fortnoxInvoice: any): Invoice {
    return {
      id: fortnoxInvoice.DocumentNumber,
      number: fortnoxInvoice.DocumentNumber,
      customerId: fortnoxInvoice.CustomerNumber,
      customerName: fortnoxInvoice.CustomerName,
      issueDate: fortnoxInvoice.InvoiceDate,
      dueDate: fortnoxInvoice.DueDate,
      status: this.mapInvoiceStatus(fortnoxInvoice.Cancelled, fortnoxInvoice.Booked),
      currency: fortnoxInvoice.Currency || 'SEK',
      subtotal: fortnoxInvoice.Net,
      taxTotal: fortnoxInvoice.Tax,
      total: fortnoxInvoice.Total,
      amountDue: fortnoxInvoice.Balance,
      reference: fortnoxInvoice.YourReference,
      lineItems: fortnoxInvoice.InvoiceRows?.map((row: any) => ({
        id: row.RowId,
        itemId: row.ArticleNumber,
        description: row.Description,
        quantity: row.DeliveredQuantity,
        unitPrice: row.Price,
        discount: row.Discount,
        total: row.Total,
        taxAmount: row.VAT,
        accountId: row.AccountNumber
      })) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private mapInvoiceStatus(cancelled: boolean, booked: boolean): 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'void' {
    if (cancelled) return 'cancelled'
    if (!booked) return 'draft'
    return 'sent'
  }

  // Helper methods to transform our data to Fortnox format
  private customerToFortnox(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      Name: customer.name,
      Email: customer.email,
      WWW: customer.website,
      Phone1: customer.phone?.number,
      Address1: customer.addresses?.[0]?.street,
      Address2: customer.addresses?.[0]?.street2,
      City: customer.addresses?.[0]?.city,
      ZipCode: customer.addresses?.[0]?.postalCode,
      Country: customer.addresses?.[0]?.country,
      OrganisationNumber: customer.taxNumber,
      Currency: customer.currency || 'SEK',
      TermsOfPayment: customer.paymentTerms,
      Active: customer.isActive !== false
    }
  }

  private vendorToFortnox(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      Name: vendor.name,
      Email: vendor.email,
      WWW: vendor.website,
      Phone1: vendor.phone?.number,
      Address1: vendor.addresses?.[0]?.street,
      Address2: vendor.addresses?.[0]?.street2,
      City: vendor.addresses?.[0]?.city,
      ZipCode: vendor.addresses?.[0]?.postalCode,
      Country: vendor.addresses?.[0]?.country,
      OrganisationNumber: vendor.taxNumber,
      Currency: vendor.currency || 'SEK',
      TermsOfPayment: vendor.paymentTerms,
      Active: vendor.isActive !== false
    }
  }

  private invoiceToFortnox(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      CustomerNumber: invoice.customerId,
      InvoiceDate: invoice.issueDate,
      DueDate: invoice.dueDate,
      Currency: invoice.currency || 'SEK',
      YourReference: invoice.reference,
      Comments: invoice.notes,
      InvoiceRows: invoice.lineItems?.map(item => ({
        ArticleNumber: item.itemId,
        Description: item.description,
        DeliveredQuantity: item.quantity,
        Price: item.unitPrice,
        Discount: item.discount,
        AccountNumber: item.accountId
      })) || []
    }
  }

  // Company Info
  async getCompanyInfo(): Promise<CompanyInfo> {
    const response = await this.request('/companyinformation')
    if (!response.ok) {
      throw new Error(`Failed to get company info: ${response.statusText}`)
    }

    const data = await response.json() as any
    const company = data.CompanyInformation

    return {
      id: company.OrganisationNumber,
      name: company.CompanyName,
      legalName: company.CompanyName,
      email: company.Email,
      phone: company.Phone,
      addresses: [{
        type: 'billing' as any,
        street: company.Address1,
        street2: company.Address2,
        city: company.City,
        postalCode: company.ZipCode,
        country: company.Country
      }].filter(addr => addr.street || addr.city),
      taxNumber: company.OrganisationNumber,
      baseCurrency: 'SEK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  // Account operations
  async getAccounts(options?: SyncOptions): Promise<SyncResult<Account>> {
    const response = await this.request('/accounts')
    if (!response.ok) {
      throw new Error(`Failed to get accounts: ${response.statusText}`)
    }

    const data = await response.json() as any
    const accounts = data.Accounts.map((acc: any) => ({
      id: acc.Number,
      name: acc.Description,
      code: acc.Number,
      description: acc.Description,
      accountType: this.mapAccountType(acc.Number),
      isActive: acc.Active,
      currency: 'SEK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))

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

  private mapAccountType(accountNumber: string): 'asset' | 'liability' | 'equity' | 'income' | 'expense' | 'accounts_receivable' | 'accounts_payable' | 'bank' | 'credit_card' | 'current_asset' | 'fixed_asset' | 'other_asset' | 'current_liability' | 'long_term_liability' | 'cost_of_goods_sold' | 'other_income' | 'other_expense' {
    const num = parseInt(accountNumber)
    if (num >= 1000 && num <= 1999) return 'asset'
    if (num >= 2000 && num <= 2999) return 'liability'
    if (num >= 3000 && num <= 3999) return 'income'
    if (num >= 4000 && num <= 7999) return 'expense'
    if (num >= 8000 && num <= 8999) return 'other_expense'
    return 'other_asset'
  }

  async getAccount(id: string): Promise<Account> {
    const response = await this.request(`/accounts/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get account: ${response.statusText}`)
    }

    const data = await response.json() as any
    const acc = data.Account

    return {
      id: acc.Number,
      name: acc.Description,
      code: acc.Number,
      description: acc.Description,
      accountType: this.mapAccountType(acc.Number),
      isActive: acc.Active,
      currency: 'SEK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const fortnoxAccount = {
      Number: account.code,
      Description: account.name,
      Active: account.isActive !== false
    }

    const response = await this.request('/accounts', {
      method: 'POST',
      body: JSON.stringify({ Account: fortnoxAccount })
    })

    if (!response.ok) {
      throw new Error(`Failed to create account: ${response.statusText}`)
    }

    const data = await response.json() as any
    const acc = data.Account

    return {
      id: acc.Number,
      name: acc.Description,
      code: acc.Number,
      description: acc.Description,
      accountType: this.mapAccountType(acc.Number),
      isActive: acc.Active,
      currency: 'SEK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async updateAccount(id: string, account: Partial<Account>): Promise<Account> {
    const fortnoxAccount: any = {}
    
    if (account.name) fortnoxAccount.Description = account.name
    if (account.isActive !== undefined) fortnoxAccount.Active = account.isActive

    const response = await this.request(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ Account: fortnoxAccount })
    })

    if (!response.ok) {
      throw new Error(`Failed to update account: ${response.statusText}`)
    }

    const data = await response.json() as any
    const acc = data.Account

    return {
      id: acc.Number,
      name: acc.Description,
      code: acc.Number,
      description: acc.Description,
      accountType: this.mapAccountType(acc.Number),
      isActive: acc.Active,
      currency: 'SEK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async deleteAccount(id: string): Promise<void> {
    const response = await this.request(`/accounts/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete account: ${response.statusText}`)
    }
  }

  // Customer operations (Full CRUD)
  async getCustomers(options?: SyncOptions): Promise<SyncResult<Customer>> {
    const params = new URLSearchParams()
    
    if (options?.includeArchived === false) {
      params.append('filter', 'active')
    }

    const response = await this.request(`/customers?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get customers: ${response.statusText}`)
    }

    const data = await response.json() as any
    const customers = data.Customers.map(this.transformCustomer.bind(this))

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
    const response = await this.request(`/customers/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get customer: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformCustomer(data.Customer)
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const fortnoxCustomer = this.customerToFortnox(customer)

    const response = await this.request('/customers', {
      method: 'POST',
      body: JSON.stringify({ Customer: fortnoxCustomer })
    })

    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformCustomer(data.Customer)
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const fortnoxCustomer: any = {}
    
    if (customer.name) fortnoxCustomer.Name = customer.name
    if (customer.email) fortnoxCustomer.Email = customer.email
    if (customer.website) fortnoxCustomer.WWW = customer.website
    if (customer.phone?.number) fortnoxCustomer.Phone1 = customer.phone.number
    if (customer.addresses?.[0]) {
      const addr = customer.addresses[0]
      if (addr.street) fortnoxCustomer.Address1 = addr.street
      if (addr.street2) fortnoxCustomer.Address2 = addr.street2
      if (addr.city) fortnoxCustomer.City = addr.city
      if (addr.postalCode) fortnoxCustomer.ZipCode = addr.postalCode
      if (addr.country) fortnoxCustomer.Country = addr.country
    }
    if (customer.taxNumber) fortnoxCustomer.OrganisationNumber = customer.taxNumber
    if (customer.currency) fortnoxCustomer.Currency = customer.currency
    if (customer.paymentTerms) fortnoxCustomer.TermsOfPayment = customer.paymentTerms
    if (customer.isActive !== undefined) fortnoxCustomer.Active = customer.isActive

    const response = await this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ Customer: fortnoxCustomer })
    })

    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformCustomer(data.Customer)
  }

  async deleteCustomer(id: string): Promise<void> {
    const response = await this.request(`/customers/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete customer: ${response.statusText}`)
    }
  }

  // Vendor operations (Full CRUD)
  async getVendors(options?: SyncOptions): Promise<SyncResult<Vendor>> {
    const params = new URLSearchParams()
    
    if (options?.includeArchived === false) {
      params.append('filter', 'active')
    }

    const response = await this.request(`/suppliers?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get vendors: ${response.statusText}`)
    }

    const data = await response.json() as any
    const vendors = data.Suppliers.map(this.transformVendor.bind(this))

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
    const response = await this.request(`/suppliers/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get vendor: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformVendor(data.Supplier)
  }

  async createVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vendor> {
    const fortnoxSupplier = this.vendorToFortnox(vendor)

    const response = await this.request('/suppliers', {
      method: 'POST',
      body: JSON.stringify({ Supplier: fortnoxSupplier })
    })

    if (!response.ok) {
      throw new Error(`Failed to create vendor: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformVendor(data.Supplier)
  }

  async updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor> {
    const fortnoxSupplier: any = {}
    
    if (vendor.name) fortnoxSupplier.Name = vendor.name
    if (vendor.email) fortnoxSupplier.Email = vendor.email
    if (vendor.website) fortnoxSupplier.WWW = vendor.website
    if (vendor.phone?.number) fortnoxSupplier.Phone1 = vendor.phone.number
    if (vendor.addresses?.[0]) {
      const addr = vendor.addresses[0]
      if (addr.street) fortnoxSupplier.Address1 = addr.street
      if (addr.street2) fortnoxSupplier.Address2 = addr.street2
      if (addr.city) fortnoxSupplier.City = addr.city
      if (addr.postalCode) fortnoxSupplier.ZipCode = addr.postalCode
      if (addr.country) fortnoxSupplier.Country = addr.country
    }
    if (vendor.taxNumber) fortnoxSupplier.OrganisationNumber = vendor.taxNumber
    if (vendor.currency) fortnoxSupplier.Currency = vendor.currency
    if (vendor.paymentTerms) fortnoxSupplier.TermsOfPayment = vendor.paymentTerms
    if (vendor.isActive !== undefined) fortnoxSupplier.Active = vendor.isActive

    const response = await this.request(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ Supplier: fortnoxSupplier })
    })

    if (!response.ok) {
      throw new Error(`Failed to update vendor: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformVendor(data.Supplier)
  }

  async deleteVendor(id: string): Promise<void> {
    const response = await this.request(`/suppliers/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete vendor: ${response.statusText}`)
    }
  }

  // Item operations (Full CRUD)
  async getItems(options?: SyncOptions): Promise<SyncResult<Item>> {
    const response = await this.request('/articles')
    
    if (!response.ok) {
      throw new Error(`Failed to get items: ${response.statusText}`)
    }

    const data = await response.json() as any
    const items = data.Articles.map((article: any) => ({
      id: article.ArticleNumber,
      name: article.Description,
      code: article.ArticleNumber,
      description: article.Description,
      unitPrice: article.PurchasePrice || article.SalesPrice,
      currency: 'SEK',
      isActive: article.Active,
      isSold: true,
      isPurchased: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))

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
    const response = await this.request(`/articles/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get item: ${response.statusText}`)
    }

    const data = await response.json() as any
    const article = data.Article

    return {
      id: article.ArticleNumber,
      name: article.Description,
      code: article.ArticleNumber,
      description: article.Description,
      unitPrice: article.PurchasePrice || article.SalesPrice,
      currency: 'SEK',
      isActive: article.Active,
      isSold: true,
      isPurchased: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async createItem(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const fortnoxArticle = {
      ArticleNumber: item.code,
      Description: item.name,
      PurchasePrice: item.unitPrice,
      SalesPrice: item.unitPrice,
      Active: item.isActive !== false
    }

    const response = await this.request('/articles', {
      method: 'POST',
      body: JSON.stringify({ Article: fortnoxArticle })
    })

    if (!response.ok) {
      throw new Error(`Failed to create item: ${response.statusText}`)
    }

    const data = await response.json() as any
    const article = data.Article

    return {
      id: article.ArticleNumber,
      name: article.Description,
      code: article.ArticleNumber,
      description: article.Description,
      unitPrice: article.PurchasePrice || article.SalesPrice,
      currency: 'SEK',
      isActive: article.Active,
      isSold: true,
      isPurchased: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async updateItem(id: string, item: Partial<Item>): Promise<Item> {
    const fortnoxArticle: any = {}
    
    if (item.name) fortnoxArticle.Description = item.name
    if (item.unitPrice) {
      fortnoxArticle.PurchasePrice = item.unitPrice
      fortnoxArticle.SalesPrice = item.unitPrice
    }
    if (item.isActive !== undefined) fortnoxArticle.Active = item.isActive

    const response = await this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ Article: fortnoxArticle })
    })

    if (!response.ok) {
      throw new Error(`Failed to update item: ${response.statusText}`)
    }

    const data = await response.json() as any
    const article = data.Article

    return {
      id: article.ArticleNumber,
      name: article.Description,
      code: article.ArticleNumber,
      description: article.Description,
      unitPrice: article.PurchasePrice || article.SalesPrice,
      currency: 'SEK',
      isActive: article.Active,
      isSold: true,
      isPurchased: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async deleteItem(id: string): Promise<void> {
    const response = await this.request(`/articles/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`)
    }
  }

  // Invoice operations (Full CRUD)
  async getInvoices(options?: SyncOptions): Promise<SyncResult<Invoice>> {
    const params = new URLSearchParams()
    
    if (options?.modifiedSince) {
      params.append('lastmodified', options.modifiedSince.toISOString().split('T')[0])
    }

    const response = await this.request(`/invoices?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get invoices: ${response.statusText}`)
    }

    const data = await response.json() as any
    const invoices = data.Invoices.map(this.transformInvoice.bind(this))

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
    const response = await this.request(`/invoices/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get invoice: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformInvoice(data.Invoice)
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const fortnoxInvoice = this.invoiceToFortnox(invoice)

    const response = await this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify({ Invoice: fortnoxInvoice })
    })

    if (!response.ok) {
      throw new Error(`Failed to create invoice: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformInvoice(data.Invoice)
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    const fortnoxInvoice: any = {}
    
    if (invoice.customerId) fortnoxInvoice.CustomerNumber = invoice.customerId
    if (invoice.issueDate) fortnoxInvoice.InvoiceDate = invoice.issueDate
    if (invoice.dueDate) fortnoxInvoice.DueDate = invoice.dueDate
    if (invoice.currency) fortnoxInvoice.Currency = invoice.currency
    if (invoice.reference) fortnoxInvoice.YourReference = invoice.reference
    if (invoice.notes) fortnoxInvoice.Comments = invoice.notes
    if (invoice.lineItems) {
      fortnoxInvoice.InvoiceRows = invoice.lineItems.map(item => ({
        ArticleNumber: item.itemId,
        Description: item.description,
        DeliveredQuantity: item.quantity,
        Price: item.unitPrice,
        Discount: item.discount,
        AccountNumber: item.accountId
      }))
    }

    const response = await this.request(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ Invoice: fortnoxInvoice })
    })

    if (!response.ok) {
      throw new Error(`Failed to update invoice: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformInvoice(data.Invoice)
  }

  async deleteInvoice(id: string): Promise<void> {
    const response = await this.request(`/invoices/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete invoice: ${response.statusText}`)
    }
  }

  async sendInvoice(id: string, options?: { email?: string; subject?: string; message?: string }): Promise<void> {
    // Fortnox has a specific endpoint for sending invoices
    const response = await this.request(`/invoices/${id}/email`, {
      method: 'GET' // Fortnox uses GET to send invoices
    })

    if (!response.ok) {
      throw new Error(`Failed to send invoice: ${response.statusText}`)
    }
  }

  // Bill operations (Full CRUD)
  async getBills(options?: SyncOptions): Promise<SyncResult<Bill>> {
    const response = await this.request('/supplierinvoices')
    
    if (!response.ok) {
      throw new Error(`Failed to get bills: ${response.statusText}`)
    }

    const data = await response.json() as any
    const bills = data.SupplierInvoices?.map((invoice: any) => ({
      id: invoice.GivenNumber,
      number: invoice.InvoiceNumber,
      vendorId: invoice.SupplierNumber,
      vendorName: invoice.SupplierName,
      issueDate: invoice.InvoiceDate,
      dueDate: invoice.DueDate,
      status: invoice.Cancelled ? 'cancelled' as any : 'sent' as any,
      currency: invoice.Currency || 'SEK',
      subtotal: invoice.Net,
      taxTotal: invoice.VAT,
      total: invoice.Total,
      amountDue: invoice.Balance,
      reference: invoice.YourReference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })) || []

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
    const response = await this.request(`/supplierinvoices/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get bill: ${response.statusText}`)
    }

    const data = await response.json() as any
    const invoice = data.SupplierInvoice

    return {
      id: invoice.GivenNumber,
      number: invoice.InvoiceNumber,
      vendorId: invoice.SupplierNumber,
      vendorName: invoice.SupplierName,
      issueDate: invoice.InvoiceDate,
      dueDate: invoice.DueDate,
      status: invoice.Cancelled ? 'cancelled' as any : 'sent' as any,
      currency: invoice.Currency || 'SEK',
      subtotal: invoice.Net,
      taxTotal: invoice.VAT,
      total: invoice.Total,
      amountDue: invoice.Balance,
      reference: invoice.YourReference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async createBill(bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bill> {
    const fortnoxBill = {
      SupplierNumber: bill.vendorId,
      InvoiceNumber: bill.number,
      InvoiceDate: bill.issueDate,
      DueDate: bill.dueDate,
      Currency: bill.currency || 'SEK',
      YourReference: bill.reference,
      Total: bill.total
    }

    const response = await this.request('/supplierinvoices', {
      method: 'POST',
      body: JSON.stringify({ SupplierInvoice: fortnoxBill })
    })

    if (!response.ok) {
      throw new Error(`Failed to create bill: ${response.statusText}`)
    }

    const data = await response.json() as any
    const invoice = data.SupplierInvoice

    return {
      id: invoice.GivenNumber,
      number: invoice.InvoiceNumber,
      vendorId: invoice.SupplierNumber,
      vendorName: invoice.SupplierName,
      issueDate: invoice.InvoiceDate,
      dueDate: invoice.DueDate,
      status: invoice.Cancelled ? 'cancelled' as any : 'sent' as any,
      currency: invoice.Currency || 'SEK',
      subtotal: invoice.Net,
      taxTotal: invoice.VAT,
      total: invoice.Total,
      amountDue: invoice.Balance,
      reference: invoice.YourReference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async updateBill(id: string, bill: Partial<Bill>): Promise<Bill> {
    const fortnoxBill: any = {}
    
    if (bill.vendorId) fortnoxBill.SupplierNumber = bill.vendorId
    if (bill.number) fortnoxBill.InvoiceNumber = bill.number
    if (bill.issueDate) fortnoxBill.InvoiceDate = bill.issueDate
    if (bill.dueDate) fortnoxBill.DueDate = bill.dueDate
    if (bill.currency) fortnoxBill.Currency = bill.currency
    if (bill.reference) fortnoxBill.YourReference = bill.reference
    if (bill.total) fortnoxBill.Total = bill.total

    const response = await this.request(`/supplierinvoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ SupplierInvoice: fortnoxBill })
    })

    if (!response.ok) {
      throw new Error(`Failed to update bill: ${response.statusText}`)
    }

    const data = await response.json() as any
    const invoice = data.SupplierInvoice

    return {
      id: invoice.GivenNumber,
      number: invoice.InvoiceNumber,
      vendorId: invoice.SupplierNumber,
      vendorName: invoice.SupplierName,
      issueDate: invoice.InvoiceDate,
      dueDate: invoice.DueDate,
      status: invoice.Cancelled ? 'cancelled' as any : 'sent' as any,
      currency: invoice.Currency || 'SEK',
      subtotal: invoice.Net,
      taxTotal: invoice.VAT,
      total: invoice.Total,
      amountDue: invoice.Balance,
      reference: invoice.YourReference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async deleteBill(id: string): Promise<void> {
    const response = await this.request(`/supplierinvoices/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete bill: ${response.statusText}`)
    }
  }

  // Transaction operations (Limited support)
  async getTransactions(options?: SyncOptions): Promise<SyncResult<Transaction>> {
    // Fortnox doesn't have a direct transactions endpoint
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
    throw new Error('Transaction retrieval not supported by Fortnox')
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    throw new Error('Direct transaction creation not supported by Fortnox')
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    throw new Error('Direct transaction updates not supported by Fortnox')
  }

  async deleteTransaction(id: string): Promise<void> {
    throw new Error('Direct transaction deletion not supported by Fortnox')
  }

  async reconcileTransaction(id: string, bankTransactionId: string): Promise<Transaction> {
    throw new Error('Transaction reconciliation not supported by Fortnox')
  }

  // Expense operations (Limited support)
  async getExpenses(options?: SyncOptions): Promise<SyncResult<Expense>> {
    // Fortnox doesn't have a direct expenses endpoint
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

  async getExpense(id: string): Promise<Expense> {
    throw new Error('Expense retrieval not supported by Fortnox')
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    throw new Error('Direct expense creation not supported by Fortnox')
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    throw new Error('Direct expense updates not supported by Fortnox')
  }

  async deleteExpense(id: string): Promise<void> {
    throw new Error('Direct expense deletion not supported by Fortnox')
  }

  async submitExpense(id: string): Promise<Expense> {
    throw new Error('Expense submission not supported by Fortnox')
  }

  async approveExpense(id: string): Promise<Expense> {
    throw new Error('Expense approval not supported by Fortnox')
  }

  async rejectExpense(id: string, reason?: string): Promise<Expense> {
    throw new Error('Expense rejection not supported by Fortnox')
  }

  // Journal Entry operations (Full CRUD)
  async getJournalEntries(options?: SyncOptions): Promise<SyncResult<JournalEntry>> {
    const response = await this.request('/vouchers')
    
    if (!response.ok) {
      throw new Error(`Failed to get journal entries: ${response.statusText}`)
    }

    const data = await response.json() as any
    const journalEntries = data.Vouchers?.map((voucher: any) => ({
      id: voucher.VoucherNumber,
      number: voucher.VoucherNumber,
      date: voucher.TransactionDate,
      description: voucher.Description,
      reference: voucher.ReferenceNumber,
      status: 'posted' as any,
      currency: 'SEK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
    const response = await this.request(`/vouchers/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get journal entry: ${response.statusText}`)
    }

    const data = await response.json() as any
    const voucher = data.Voucher

    return {
      id: voucher.VoucherNumber,
      number: voucher.VoucherNumber,
      date: voucher.TransactionDate,
      description: voucher.Description,
      reference: voucher.ReferenceNumber,
      status: 'posted' as any,
      currency: 'SEK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async createJournalEntry(journalEntry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
    const fortnoxVoucher = {
      TransactionDate: journalEntry.date,
      Description: journalEntry.description,
      ReferenceNumber: journalEntry.reference,
      VoucherRows: journalEntry.journalRows?.map(row => ({
        Account: row.accountId,
        Debit: row.debit,
        Credit: row.credit,
        Description: row.description
      })) || []
    }

    const response = await this.request('/vouchers', {
      method: 'POST',
      body: JSON.stringify({ Voucher: fortnoxVoucher })
    })

    if (!response.ok) {
      throw new Error(`Failed to create journal entry: ${response.statusText}`)
    }

    const data = await response.json() as any
    const voucher = data.Voucher

    return {
      id: voucher.VoucherNumber,
      number: voucher.VoucherNumber,
      date: voucher.TransactionDate,
      description: voucher.Description,
      reference: voucher.ReferenceNumber,
      status: 'posted' as any,
      currency: 'SEK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async updateJournalEntry(id: string, journalEntry: Partial<JournalEntry>): Promise<JournalEntry> {
    const fortnoxVoucher: any = {}
    
    if (journalEntry.date) fortnoxVoucher.TransactionDate = journalEntry.date
    if (journalEntry.description) fortnoxVoucher.Description = journalEntry.description
    if (journalEntry.reference) fortnoxVoucher.ReferenceNumber = journalEntry.reference
    if (journalEntry.journalRows) {
      fortnoxVoucher.VoucherRows = journalEntry.journalRows.map(row => ({
        Account: row.accountId,
        Debit: row.debit,
        Credit: row.credit,
        Description: row.description
      }))
    }

    const response = await this.request(`/vouchers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ Voucher: fortnoxVoucher })
    })

    if (!response.ok) {
      throw new Error(`Failed to update journal entry: ${response.statusText}`)
    }

    const data = await response.json() as any
    const voucher = data.Voucher

    return {
      id: voucher.VoucherNumber,
      number: voucher.VoucherNumber,
      date: voucher.TransactionDate,
      description: voucher.Description,
      reference: voucher.ReferenceNumber,
      status: 'posted' as any,
      currency: 'SEK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async deleteJournalEntry(id: string): Promise<void> {
    const response = await this.request(`/vouchers/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete journal entry: ${response.statusText}`)
    }
  }

  async postJournalEntry(id: string): Promise<JournalEntry> {
    // Fortnox vouchers are automatically posted when created
    return this.getJournalEntry(id)
  }

  // Payment operations (Limited support)
  async getPayments(options?: SyncOptions): Promise<SyncResult<Payment>> {
    // Fortnox doesn't have a direct payments endpoint
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

  async getPayment(id: string): Promise<Payment> {
    throw new Error('Payment retrieval not supported by Fortnox')
  }

  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    throw new Error('Direct payment creation not supported by Fortnox')
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    throw new Error('Direct payment updates not supported by Fortnox')
  }

  async deletePayment(id: string): Promise<void> {
    throw new Error('Direct payment deletion not supported by Fortnox')
  }

  async processPayment(id: string): Promise<Payment> {
    throw new Error('Payment processing not supported by Fortnox')
  }

  // Attachment operations (Limited support)
  async getAttachments(entityType: string, entityId: string, attachmentType?: string): Promise<Attachment[]> {
    // Fortnox has limited attachment support
    return []
  }

  async getAttachment(id: string): Promise<Attachment> {
    throw new Error('Direct attachment retrieval not supported by Fortnox API')
  }

  async downloadAttachment(id: string): Promise<ReadableStream | null> {
    throw new Error('Attachment download not supported by Fortnox API')
  }

  async getAttachmentMetadata(id: string): Promise<any> {
    throw new Error('Attachment metadata not supported by Fortnox API')
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
          case 'items':
            result = await this.createItem(entity as any)
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
          case 'items':
            result = await this.updateItem(id, data as any)
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
          case 'items':
            await this.deleteItem(id)
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
      remaining: 25,
      reset: new Date(Date.now() + 5000),
      limit: 25
    }
  }

  getProviderInfo(): { name: string; version: string; capabilities: string[] } {
    return {
      name: 'Fortnox',
      version: '3.0',
      capabilities: ['customers', 'vendors', 'invoices', 'bills', 'accounts', 'items', 'journal_entries', 'full_crud']
    }
  }
} 