import { IDocumentsService } from '../interfaces/IDocumentsService'
import { Document, DocumentFilters } from '@/domain/types'
import {
  getDocumentsByUserId,
  getDocumentsByContractId,
  searchDocuments,
} from '@/data/documents'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const documentsService: IDocumentsService = {
  async getDocuments(userId: string, filters?: DocumentFilters): Promise<Document[]> {
    await delay(200)
    let docs = getDocumentsByUserId(userId)

    if (filters) {
      if (filters.type) {
        docs = docs.filter((d) => d.type === filters.type)
      }
      if (filters.contractId) {
        docs = docs.filter((d) => d.contractId === filters.contractId)
      }
      if (filters.year) {
        docs = docs.filter((d) => d.year === filters.year)
      }
      if (filters.search) {
        docs = searchDocuments(filters.search, docs)
      }
    }

    return docs
  },

  async getDocumentsByContract(contractId: string): Promise<Document[]> {
    await delay(200)
    return getDocumentsByContractId(contractId)
  },

  async download(documentId: string): Promise<Blob> {
    await delay(500)
    return new Blob(['Mock PDF content'], { type: 'application/pdf' })
  },

  async search(userId: string, query: string): Promise<Document[]> {
    await delay(200)
    const docs = getDocumentsByUserId(userId)
    return searchDocuments(query, docs)
  },
}
