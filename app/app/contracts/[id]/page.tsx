'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useContract } from '@/hooks/useContracts'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, formatDate, formatFileSize } from '@/domain/utils/formatters'
import { documentsService } from '@/services'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import type { Document, DocumentType } from '@/domain/types'

const contractProfiles: Record<string, string> = {
  'contract-1': 'Audacieux',
  'contract-2': 'Tempéré',
  'contract-3': 'Tempéré',
}

const typeLabels: Record<DocumentType, string> = {
  releve: 'Relevé',
  rapport: 'Rapport',
  fiscal: 'Fiscal',
  contrat: 'Contrat',
  avenant: 'Avenant',
  autre: 'Autre',
}

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { contract, loading, error } = useContract(id)
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    if (user) {
      documentsService.getDocuments(user.id).then((docs) => {
        setDocuments(docs.filter((d) => d.contractId === id))
      })
    }
  }, [user, id])

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (error || !contract) {
    return (
      <div className="p-4">
        <ErrorState
          title="Contrat introuvable"
          message="Ce contrat n&apos;existe pas ou vous n&apos;y avez pas accès."
          onRetry={() => router.back()}
        />
      </div>
    )
  }

  const profileName = contractProfiles[contract.id] || 'Tempéré'
  const typeLabel = contract.type === 'assurance-vie' ? 'Assurance Vie' : contract.type === 'per' ? 'PER' : 'Compte-titres'

  const handleDownload = (doc: Document) => {
    alert(`Téléchargement de ${doc.filename} - POC`)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Infos contrat */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-semibold text-beige-light">{profileName}</span>
          <span className="text-text-muted">&middot;</span>
          <span className="text-sm text-text-muted">Gestion libre avec mandat d&apos;arbitrage</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-text-muted">Type de contrat</span>
            <span className="text-sm font-medium text-text">{typeLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-muted">Durée</span>
            <span className="text-sm font-medium text-text">Vie Entière</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-muted">Date d&apos;ouverture</span>
            <span className="text-sm font-medium text-text">{formatDate(contract.openedAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-muted">Versements réguliers</span>
            <span className="text-sm font-medium text-text">200,00 € / Mensuel</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-muted">Valeur actuelle</span>
            <span className="text-sm font-bold text-text">{formatCurrency(contract.currentValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-muted">Performance</span>
            <span className={`text-sm font-bold ${contract.performanceAmount >= 0 ? 'text-success' : 'text-danger'}`}>
              {contract.performanceAmount >= 0 ? '+' : ''}{formatCurrency(contract.performanceAmount)}
            </span>
          </div>
        </div>
      </Card>

      {/* Documents du contrat */}
      <div>
        <h3 className="font-semibold text-text mb-3">Documents du contrat</h3>
        {documents.length === 0 ? (
          <Card>
            <p className="text-center text-text-muted py-4">Aucun document pour ce contrat</p>
          </Card>
        ) : (
          <Card padding="none">
            <div className="divide-y divide-border/50">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleDownload(doc)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-danger/15 flex items-center justify-center text-danger shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">{doc.label}</p>
                      <p className="text-[11px] text-text-muted">
                        {formatDate(doc.createdAt)} &middot; {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge size="sm">{typeLabels[doc.type]}</Badge>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted shrink-0">
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

      {/* Disclaimer */}
      <p className="text-[10px] text-text-muted text-center">
        Dernière valorisation : {formatDate(contract.lastValuationAt)}. Les performances passées ne préjugent pas des performances futures.
      </p>
    </div>
  )
}
