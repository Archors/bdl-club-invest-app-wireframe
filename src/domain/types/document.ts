export type DocumentType = 'releve' | 'rapport' | 'fiscal' | 'contrat' | 'avenant' | 'autre'

export interface Document {
  id: string
  contractId?: string
  userId: string
  type: DocumentType
  label: string
  filename: string
  mimeType: string
  size: number
  createdAt: string
  year?: number
}

export interface DocumentFilters {
  type?: DocumentType
  contractId?: string
  year?: number
  search?: string
}
