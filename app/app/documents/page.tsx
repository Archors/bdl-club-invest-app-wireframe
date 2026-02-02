'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useContracts } from '@/hooks/useContracts'
import { documentsService } from '@/services'
import { formatDate, formatFileSize } from '@/domain/utils/formatters'
import { EmptyState, NoDocumentsIcon } from '@/components/ui/EmptyState'
import { SkeletonTable } from '@/components/ui/Skeleton'
import type { Document, DocumentType } from '@/domain/types'

const typeLabels: Record<DocumentType, string> = {
  releve: 'Relevé',
  rapport: 'Rapport',
  fiscal: 'Fiscal',
  contrat: 'Contrat',
  avenant: 'Avenant',
  autre: 'Autre',
}

export default function DocumentsPage() {
  const { user } = useAuth()
  const { contracts } = useContracts()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [contractFilter, setContractFilter] = useState<string>('all')

  useEffect(() => {
    if (user) {
      documentsService
        .getDocuments(user.id)
        .then(setDocuments)
        .finally(() => setLoading(false))
    }
  }, [user])

  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'releve', label: 'Relevés' },
    { value: 'rapport', label: 'Rapports' },
    { value: 'fiscal', label: 'Documents fiscaux' },
    { value: 'contrat', label: 'Contrats' },
    { value: 'avenant', label: 'Avenants' },
  ]

  const contractOptions = [
    { value: 'all', label: 'Tous les contrats' },
    ...contracts.map((c) => ({ value: c.id, label: c.label })),
  ]

  const filteredDocuments = documents.filter((doc) => {
    if (typeFilter !== 'all' && doc.type !== typeFilter) return false
    if (contractFilter !== 'all' && doc.contractId !== contractFilter) return false
    if (search && !doc.label.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleDownload = async (doc: Document) => {
    alert(`Téléchargement de ${doc.filename} - POC`)
  }

  const getContractLabel = (contractId?: string) => {
    if (!contractId) return 'Général'
    return contracts.find((c) => c.id === contractId)?.label || contractId
  }

  if (loading) {
    return (
      <div className="p-4">
        <SkeletonTable rows={6} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Search */}
      <Input
        placeholder="Rechercher un document..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        }
      />

      {/* Filters */}
      <div className="flex gap-4">
        <Select
          options={typeOptions}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="flex-1"
        />
        <Select
          options={contractOptions}
          value={contractFilter}
          onChange={(e) => setContractFilter(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon={<NoDocumentsIcon />}
          title="Aucun document"
          description="Aucun document ne correspond à vos critères de recherche."
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleDownload(doc)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-text">{doc.label}</p>
                    <p className="text-xs text-text-muted">
                      {getContractLabel(doc.contractId)} • {formatDate(doc.createdAt)} • {formatFileSize(doc.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{typeLabels[doc.type]}</Badge>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
