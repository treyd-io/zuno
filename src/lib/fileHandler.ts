import { Attachment } from '../schemas'

// Provider interface for attachment operations (read-only)
export interface AttachmentProvider {
  getAttachments(entityType: string, entityId: string, attachmentType?: string): Promise<Attachment[]>
  getAttachment(id: string): Promise<Attachment>
  downloadAttachment(id: string): Promise<ReadableStream | null>
  getAttachmentMetadata(id: string): Promise<any>
  generateSignedUrl?(attachmentId: string, expiresIn?: number): Promise<string>
  streamAttachment?(attachmentId: string): Promise<ReadableStream>
}

// Attachment proxy handler - forwards read operations to ERP providers
export class AttachmentProxyHandler {
  private providers: Map<string, AttachmentProvider> = new Map()

  constructor(private env: any) {}

  // Register a provider for attachment handling
  registerProvider(name: string, provider: AttachmentProvider) {
    this.providers.set(name, provider)
  }

  // Get attachments for entity from ERP
  async getAttachments(provider: string, entityType: string, entityId: string, attachmentType?: string): Promise<Attachment[]> {
    const providerInstance = this.providers.get(provider)
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`)
    }

    return await providerInstance.getAttachments(entityType, entityId, attachmentType)
  }

  // Get single attachment from ERP
  async getAttachment(provider: string, attachmentId: string): Promise<Attachment> {
    const providerInstance = this.providers.get(provider)
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`)
    }

    return await providerInstance.getAttachment(attachmentId)
  }

  // Download file from ERP via provider
  async downloadFile(provider: string, attachmentId: string): Promise<ReadableStream | null> {
    const providerInstance = this.providers.get(provider)
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`)
    }

    return await providerInstance.downloadAttachment(attachmentId)
  }

  // Get file metadata from ERP
  async getFileMetadata(provider: string, attachmentId: string): Promise<any> {
    const providerInstance = this.providers.get(provider)
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`)
    }

    return await providerInstance.getAttachmentMetadata(attachmentId)
  }

  // Generate signed URL if supported by ERP
  async generateSignedUrl(provider: string, attachmentId: string, expiresIn: number = 3600): Promise<string> {
    const providerInstance = this.providers.get(provider)
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`)
    }

    if (providerInstance.generateSignedUrl) {
      return await providerInstance.generateSignedUrl(attachmentId, expiresIn)
    }

    // Fallback to getting attachment metadata for URL
    const metadata = await this.getFileMetadata(provider, attachmentId)
    return metadata.url || metadata.downloadUrl
  }

  // Proxy streaming for large files
  async streamFile(provider: string, attachmentId: string): Promise<ReadableStream> {
    const providerInstance = this.providers.get(provider)
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`)
    }

    if (providerInstance.streamAttachment) {
      return await providerInstance.streamAttachment(attachmentId)
    }

    // Fallback to regular download
    const stream = await this.downloadFile(provider, attachmentId)
    if (!stream) {
      throw new Error('Failed to stream file')
    }
    return stream
  }
}

// Helper function to create attachment proxy handler
export function createFileHandler(env: any): AttachmentProxyHandler {
  return new AttachmentProxyHandler(env)
}

// Export the proxy handler as default
export { AttachmentProxyHandler as default } 