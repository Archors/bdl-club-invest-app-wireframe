import { Document, DocumentFilters } from '@/domain/types'

export interface IDocumentsService {
  getDocuments(userId: string, filters?: DocumentFilters): Promise<Document[]>
  getDocumentsByContract(contractId: string): Promise<Document[]>
  download(documentId: string): Promise<Blob>
  search(userId: string, query: string): Promise<Document[]>
}
