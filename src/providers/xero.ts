import { CoreProvider, ProviderConfig, ProviderAuth, SyncOptions, SyncResult, RateLimitInfo } from './core'
import { Customer, Invoice, Transaction, Attachment } from '../schemas'

export class XeroProvider extends CoreProvider {
  private baseUrl = 'https://api.xero.com/api.xro/2.0'
  
  constructor(config: ProviderConfig) {
    super(config)
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl
    }
  }

  getAuthUrl(scopes: string[]): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri || '',
      scope: scopes.join(' '),
      state: crypto.randomUUID()
    })
    
    return `https://login.xero.com/identity/connect/authorize?${params.toString()}`
  }

  async exchangeCodeForToken(code: string): Promise<ProviderAuth> {
    const response = await fetch('https://identity.xero.com/connect/token', {
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

    const response = await fetch('https://identity.xero.com/connect/token', {
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
      const response = await this.makeRequest('/Organisation')
      return response.ok
    } catch {
      return false
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!this.auth?.accessToken) {
      throw new Error('No access token available')
    }

    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.auth.accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (response.status === 401) {
      // Try to refresh token
      await this.refreshAccessToken()
      
      // Retry the request
      return fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.auth.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        }
      })
    }

    return response
  }

  private transformXeroCustomer(xeroCustomer: any): Customer {
    return {
      id: xeroCustomer.ContactID,
      name: xeroCustomer.Name,
      email: xeroCustomer.EmailAddress,
      phone: xeroCustomer.Phones?.[0]?.PhoneNumber,
      address: xeroCustomer.Addresses?.[0] ? {
        street: xeroCustomer.Addresses[0].AddressLine1,
        city: xeroCustomer.Addresses[0].City,
        state: xeroCustomer.Addresses[0].Region,
        postalCode: xeroCustomer.Addresses[0].PostalCode,
        country: xeroCustomer.Addresses[0].Country
      } : undefined,
      taxNumber: xeroCustomer.TaxNumber,
      currency: xeroCustomer.DefaultCurrency || 'USD',
      isActive: xeroCustomer.ContactStatus === 'ACTIVE',
      createdAt: xeroCustomer.CreatedDateUTC || new Date().toISOString(),
      updatedAt: xeroCustomer.UpdatedDateUTC || new Date().toISOString()
    }
  }

  async getCustomers(options?: SyncOptions): Promise<SyncResult<Customer>> {
    const params = new URLSearchParams()
    
    if (options?.modifiedSince) {
      params.append('If-Modified-Since', options.modifiedSince.toISOString())
    }
    
    if (options?.includeArchived) {
      params.append('includeArchived', 'true')
    }

    const response = await this.makeRequest(`/Contacts?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get customers: ${response.statusText}`)
    }

    const data = await response.json() as any
    const customers = data.Contacts.map(this.transformXeroCustomer)

    return {
      data: customers,
      hasMore: false, // Xero doesn't use cursor-based pagination in this example
      pagination: {
        page: 1,
        limit: customers.length,
        total: customers.length,
        hasNext: false
      }
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await this.makeRequest(`/Contacts/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get customer: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformXeroCustomer(data.Contacts[0])
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const xeroCustomer = {
      Name: customer.name,
      EmailAddress: customer.email,
      Phones: customer.phone ? [{ PhoneType: 'DEFAULT', PhoneNumber: customer.phone }] : [],
      Addresses: customer.address ? [{
        AddressType: 'STREET',
        AddressLine1: customer.address.street,
        City: customer.address.city,
        Region: customer.address.state,
        PostalCode: customer.address.postalCode,
        Country: customer.address.country
      }] : []
    }

    const response = await this.makeRequest('/Contacts', {
      method: 'POST',
      body: JSON.stringify({ Contacts: [xeroCustomer] })
    })

    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.statusText}`)
    }

    const data = await response.json() as any
    return this.transformXeroCustomer(data.Contacts[0])
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    // Similar implementation to createCustomer but with PUT method
    throw new Error('Not implemented yet')
  }

  async deleteCustomer(id: string): Promise<void> {
    // Xero doesn't support deletion, only archiving
    throw new Error('Xero does not support customer deletion, only archiving')
  }

  // Placeholder implementations for other methods
  async getInvoices(options?: SyncOptions): Promise<SyncResult<Invoice>> {
    throw new Error('Not implemented yet')
  }

  async getInvoice(id: string): Promise<Invoice> {
    throw new Error('Not implemented yet')
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    throw new Error('Not implemented yet')
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    throw new Error('Not implemented yet')
  }

  async deleteInvoice(id: string): Promise<void> {
    throw new Error('Not implemented yet')
  }

  async getTransactions(options?: SyncOptions): Promise<SyncResult<Transaction>> {
    throw new Error('Not implemented yet')
  }

  async getTransaction(id: string): Promise<Transaction> {
    throw new Error('Not implemented yet')
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    throw new Error('Not implemented yet')
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    throw new Error('Not implemented yet')
  }

  async deleteTransaction(id: string): Promise<void> {
    throw new Error('Not implemented yet')
  }

  async getAttachments(entityType: string, entityId: string, attachmentType?: string): Promise<Attachment[]> {
    let endpoint = ''
    
    switch (entityType) {
      case 'invoice':
        endpoint = `/Invoices/${entityId}/Attachments`
        break
      case 'bill':
        endpoint = `/Bills/${entityId}/Attachments`
        break
      case 'expense':
        endpoint = `/ExpenseClaims/${entityId}/Attachments`
        break
      case 'transaction':
        endpoint = `/BankTransactions/${entityId}/Attachments`
        break
      default:
        throw new Error(`Attachments not supported for entity type: ${entityType}`)
    }

    const response = await this.request(endpoint)
    
    if (!response.ok) {
      throw new Error(`Failed to get attachments: ${response.statusText}`)
    }

    const data = await response.json() as any
    return data.Attachments?.map((att: any) => ({
      id: att.AttachmentID,
      filename: att.FileName,
      originalFilename: att.FileName,
      mimeType: att.MimeType,
      size: att.ContentLength,
      url: att.Url,
      downloadUrl: att.Url,
      entityType: entityType as any,
      entityId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })) || []
  }

  async getAttachment(id: string): Promise<Attachment> {
    // Xero doesn't have a direct attachment endpoint, need to search through entities
    throw new Error('Direct attachment retrieval not supported by Xero API')
  }

  async downloadAttachment(id: string): Promise<ReadableStream | null> {
    // This would need to be implemented based on Xero's attachment download API
    const response = await this.request(`/Attachments/${id}/Content`)
    
    if (!response.ok) {
      return null
    }

    return response.body
  }

  async getAttachmentMetadata(id: string): Promise<any> {
    const response = await this.request(`/Attachments/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get attachment metadata: ${response.statusText}`)
    }

    return await response.json()
  }

  async getRateLimitInfo(): Promise<RateLimitInfo> {
    // Xero rate limits are typically in response headers
    return {
      remaining: 100,
      reset: new Date(Date.now() + 60000),
      limit: 100
    }
  }

  getProviderInfo(): { name: string; version: string; capabilities: string[] } {
    return {
      name: 'Xero',
      version: '2.0',
      capabilities: ['customers', 'invoices', 'transactions', 'attachments']
    }
  }
} 