'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useTransactions, useContracts } from '@/hooks/useContracts'
import { formatCurrency, formatDate } from '@/domain/utils/formatters'
import { EmptyState } from '@/components/ui/EmptyState'
import type { TransactionType, TransactionStatus } from '@/domain/types'

const typeLabels: Record<TransactionType, string> = {
  deposit: 'Versement',
  withdrawal: 'Rachat',
  rebalance: 'Arbitrage',
  fee: 'Frais',
  dividend: 'Dividende',
}

const statusLabels: Record<TransactionStatus, string> = {
  pending: 'En cours',
  completed: 'Exécuté',
  cancelled: 'Annulé',
  failed: 'Échoué',
}

export default function TransactionsPage() {
  const { contracts } = useContracts()
  const { transactions, loading } = useTransactions()

  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [contractFilter, setContractFilter] = useState<string>('all')

  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'deposit', label: 'Versements' },
    { value: 'withdrawal', label: 'Rachats' },
    { value: 'rebalance', label: 'Arbitrages' },
    { value: 'fee', label: 'Frais' },
    { value: 'dividend', label: 'Dividendes' },
  ]

  const contractOptions = [
    { value: 'all', label: 'Tous les contrats' },
    ...contracts.map((c) => ({ value: c.id, label: c.label })),
  ]

  const filteredTransactions = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false
    if (contractFilter !== 'all' && tx.contractId !== contractFilter) return false
    return true
  })

  const getContractLabel = (contractId: string) => {
    return contracts.find((c) => c.id === contractId)?.label || contractId
  }

  return (
    <div className="p-4 space-y-6">
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

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="Aucun mouvement"
          description="Aucun mouvement ne correspond à vos filtres."
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.amount >= 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tx.type === 'deposit' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="19" x2="12" y2="5" />
                          <polyline points="5 12 12 5 19 12" />
                        </svg>
                      ) : tx.type === 'withdrawal' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <polyline points="19 12 12 19 5 12" />
                        </svg>
                      ) : tx.type === 'rebalance' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-text">{tx.label}</p>
                      <p className="text-xs text-text-muted">
                        {getContractLabel(tx.contractId)} • {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.amount >= 0 ? 'text-accent' : 'text-text'}`}>
                      {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </p>
                    <Badge
                      variant={
                        tx.status === 'completed' ? 'success' :
                        tx.status === 'pending' ? 'warning' :
                        tx.status === 'failed' ? 'danger' : 'default'
                      }
                      size="sm"
                    >
                      {statusLabels[tx.status]}
                    </Badge>
                  </div>
                </div>
                {tx.details && (
                  <p className="text-sm text-text-muted ml-13 pl-13">{tx.details}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Export Button */}
      {filteredTransactions.length > 0 && (
        <Button variant="secondary" fullWidth onClick={() => alert('Export CSV - POC')}>
          Exporter en CSV
        </Button>
      )}
    </div>
  )
}
