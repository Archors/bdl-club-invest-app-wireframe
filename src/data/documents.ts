import { Document } from '@/domain/types'

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    userId: 'user-1',
    contractId: 'contract-1',
    type: 'releve',
    label: 'Relevé de situation - Décembre 2024',
    filename: 'releve_2024_12.pdf',
    mimeType: 'application/pdf',
    size: 245000,
    createdAt: '2024-12-15T08:00:00Z',
    year: 2024,
  },
  {
    id: 'doc-2',
    userId: 'user-1',
    contractId: 'contract-1',
    type: 'releve',
    label: 'Relevé de situation - Novembre 2024',
    filename: 'releve_2024_11.pdf',
    mimeType: 'application/pdf',
    size: 238000,
    createdAt: '2024-11-15T08:00:00Z',
    year: 2024,
  },
  {
    id: 'doc-3',
    userId: 'user-1',
    contractId: 'contract-1',
    type: 'rapport',
    label: 'Rapport annuel 2023',
    filename: 'rapport_annuel_2023.pdf',
    mimeType: 'application/pdf',
    size: 1250000,
    createdAt: '2024-01-31T08:00:00Z',
    year: 2023,
  },
  {
    id: 'doc-4',
    userId: 'user-1',
    type: 'fiscal',
    label: 'IFU 2023',
    filename: 'ifu_2023.pdf',
    mimeType: 'application/pdf',
    size: 156000,
    createdAt: '2024-02-15T08:00:00Z',
    year: 2023,
  },
  {
    id: 'doc-5',
    userId: 'user-1',
    contractId: 'contract-1',
    type: 'contrat',
    label: 'Conditions générales',
    filename: 'conditions_generales.pdf',
    mimeType: 'application/pdf',
    size: 890000,
    createdAt: '2021-03-15T08:00:00Z',
    year: 2021,
  },
  {
    id: 'doc-6',
    userId: 'user-1',
    contractId: 'contract-2',
    type: 'releve',
    label: 'Relevé PER - Décembre 2024',
    filename: 'releve_per_2024_12.pdf',
    mimeType: 'application/pdf',
    size: 198000,
    createdAt: '2024-12-15T08:00:00Z',
    year: 2024,
  },
  {
    id: 'doc-7',
    userId: 'user-1',
    contractId: 'contract-2',
    type: 'contrat',
    label: 'Bulletin adhésion PER',
    filename: 'adhesion_per.pdf',
    mimeType: 'application/pdf',
    size: 456000,
    createdAt: '2022-09-01T08:00:00Z',
    year: 2022,
  },
  {
    id: 'doc-8',
    userId: 'user-1',
    contractId: 'contract-1',
    type: 'avenant',
    label: 'Avenant - Modification bénéficiaires',
    filename: 'avenant_beneficiaires.pdf',
    mimeType: 'application/pdf',
    size: 125000,
    createdAt: '2023-06-10T08:00:00Z',
    year: 2023,
  },
]

export function getDocumentsByUserId(userId: string): Document[] {
  return mockDocuments
    .filter((d) => d.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getDocumentsByContractId(contractId: string): Document[] {
  return mockDocuments
    .filter((d) => d.contractId === contractId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function searchDocuments(query: string, documents: Document[]): Document[] {
  const q = query.toLowerCase()
  return documents.filter(
    (d) =>
      d.label.toLowerCase().includes(q) ||
      d.filename.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q)
  )
}
